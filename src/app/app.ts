import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginModalService } from './services/login-modal.service';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { LoginRequest } from './models/auth.model';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    ReactiveFormsModule
  ],
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  private loginModalSubscription?: Subscription;
  isWelcomePage = false;
  showLoginModal = false;
  showMobileMenu = false;
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private loginModalService: LoginModalService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    // Crear el formulario manualmente sin FormBuilder
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.loginModalSubscription = this.loginModalService.loginModal$.subscribe(() => {
      this.openLoginModal();
    });

    // Detectar la ruta actual al cargar la página
    this.checkCurrentRoute();

    // Escuchar cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isWelcomePage = event.url === '/welcome';
      });
  }

  ngOnDestroy(): void {
    if (this.loginModalSubscription) {
      this.loginModalSubscription.unsubscribe();
    }
  }

  private checkCurrentRoute() {
    this.isWelcomePage = this.router.url === '/welcome';
  }

  openLoginModal() {
    this.showLoginModal = true;
    this.errorMessage = '';
    this.loginForm.reset();
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.errorMessage = '';
    this.loginForm.reset();
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      // Prevenir múltiples submissions
      if (this.isLoading) {
        console.log('⚠️ Login ya en proceso, ignorando...');
        return;
      }

      console.log('🔄 Iniciando login desde modal...');
      this.isLoading = true;
      this.errorMessage = '';

      // Timeout de emergencia para resetear el estado
      const emergencyTimeout = setTimeout(() => {
        console.log('🚨 TIMEOUT EMERGENCIA: Reseteando isLoading');
        this.isLoading = false;
        this.errorMessage = 'La solicitud tardó demasiado. Inténtalo de nuevo.';
        this.cdr.detectChanges(); // Asegurar que Angular detecte el cambio
      }, 15000);

      const loginRequest: LoginRequest = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginRequest)
        .pipe(
          finalize(() => {
            // ESTE BLOQUE SIEMPRE SE EJECUTA
            console.log('🏁 FINALIZE: Reseteando isLoading');
            clearTimeout(emergencyTimeout);
            this.isLoading = false;
            this.cdr.detectChanges(); // Forzar detección de cambios
          })
        )
        .subscribe({
          next: (response) => {
            console.log('✅ Login exitoso desde modal');
            this.closeLoginModal();
            this.router.navigate(['/welcome']);
          },
          error: (error) => {
            console.error('❌ Error de login desde modal:', error);

            // Triple seguridad: resetear aquí también
            this.isLoading = false;
            this.cdr.detectChanges();

            if (error.status === 401) {
              this.errorMessage = 'Usuario o contraseña incorrectos';
            } else if (error.status === 500) {
              this.errorMessage = 'Error interno del sistema. Por favor, intenta más tarde o contacta al administrador';
            } else if (error.status === 503) {
              this.errorMessage = 'Servicio temporalmente no disponible. Intenta nuevamente en unos minutos';
            } else if (error.status === 0 || error.status === 'timeout') {
              this.errorMessage = 'Error de conexión. Verifica tu conexión a internet';
            } else {
              this.errorMessage = 'Error técnico del sistema. Si el problema persiste, contacta al administrador';
            }
          }
        });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos';
    }
  }
}
