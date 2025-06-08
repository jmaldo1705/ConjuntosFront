import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginRequest } from './models/auth.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'ConjuntosFront';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if we're in a browser environment
    if (typeof document !== 'undefined') {
      // Add event listeners after component initialization
      // Use a longer timeout to ensure DOM is fully loaded
      setTimeout(() => {
        this.setupEventListeners();

        // If elements weren't found on first try, retry with increasing delays
        const retrySetup = (attempts = 1) => {
          if (attempts <= 3) {
            // Check if the CTA button exists yet
            const ctaLoginBtn = document.getElementById('ctaLoginBtn');
            if (!ctaLoginBtn) {
              console.log(`Retry attempt ${attempts} to set up event listeners`);
              setTimeout(() => {
                this.setupEventListeners();
                retrySetup(attempts + 1);
              }, 500 * attempts); // Increasing delay with each attempt
            }
          }
        };

        retrySetup();
      }, 300);
    }
  }

  private setupEventListeners() {
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      return;
    }

    // Toggle mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // Toggle login modal
    const loginBtn = document.getElementById('loginBtn');
    const heroLoginBtn = document.getElementById('heroLoginBtn');
    const ctaLoginBtn = document.getElementById('ctaLoginBtn');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginModal = document.getElementById('loginModal');

    if (loginBtn && loginModal) {
      loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
        this.resetLoginForm();
      });
    }

    if (heroLoginBtn && loginModal) {
      heroLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
        this.resetLoginForm();
      });
    }

    if (ctaLoginBtn && loginModal) {
      ctaLoginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
        this.resetLoginForm();
      });
    }

    if (closeLoginModal && loginModal) {
      closeLoginModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
      });
    }

    // Close modal when clicking outside
    if (loginModal) {
      loginModal.addEventListener('click', (event) => {
        if (event.target === loginModal) {
          loginModal.classList.add('hidden');
        }
      });
    }

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleLoginFormSubmit();
      });
    }
  }

  private resetLoginForm() {
    // Reset form fields and error message
    const usernameInput = document.getElementById('modalUsername') as HTMLInputElement;
    const passwordInput = document.getElementById('modalPassword') as HTMLInputElement;
    const errorMessage = document.getElementById('loginErrorMessage');

    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (errorMessage) errorMessage.classList.add('hidden');
  }

  private handleLoginFormSubmit() {
    const usernameInput = document.getElementById('modalUsername') as HTMLInputElement;
    const passwordInput = document.getElementById('modalPassword') as HTMLInputElement;
    const errorMessage = document.getElementById('loginErrorMessage');
    const errorText = document.getElementById('errorText');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginBtnLoading = document.getElementById('loginBtnLoading');
    const loginModal = document.getElementById('loginModal');

    if (!usernameInput || !passwordInput || !errorMessage || !errorText || !loginBtnText || !loginBtnLoading) {
      console.error('Form elements not found');
      return;
    }

    // Show loading state
    loginBtnText.classList.add('hidden');
    loginBtnLoading.classList.remove('hidden');
    errorMessage.classList.add('hidden');

    const loginRequest: LoginRequest = {
      username: usernameInput.value,
      password: passwordInput.value
    };

    this.authService.login(loginRequest).subscribe({
      next: () => {
        // Hide loading state
        loginBtnText.classList.remove('hidden');
        loginBtnLoading.classList.add('hidden');

        // Close modal
        if (loginModal) {
          loginModal.classList.add('hidden');
        }

        // Navigate to welcome page
        this.router.navigate(['/welcome']);
      },
      error: (error) => {
        // Hide loading state
        loginBtnText.classList.remove('hidden');
        loginBtnLoading.classList.add('hidden');

        // Show error message
        errorMessage.classList.remove('hidden');

        // Handle specific error cases
        if (error.status === 401) {
          errorText.textContent = 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.';
        } else if (error.status === 403) {
          errorText.textContent = 'Tu cuenta no tiene permisos para acceder. Contacta al administrador.';
        } else {
          errorText.textContent = error.error?.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        }
      }
    });
  }
}
