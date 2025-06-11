import { Component, OnInit, OnDestroy } from '@angular/core';
import {of, Subscription, timeout} from 'rxjs';
import { LoginModalService } from './services/login-modal.service';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import {catchError, filter} from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { LoginRequest } from './models/auth.model';
import { finalize } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import {ToastrService} from 'ngx-toastr';


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
  private loginInProgress = false; // Flag adicional para prevenir doble click

  constructor(
    private loginModalService: LoginModalService,
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService // Agregado para notificaciones
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });
  }

  ngOnInit() {
    this.loginModalSubscription = this.loginModalService.loginModal$.subscribe(() => {
      this.openLoginModal();
    });

    this.checkCurrentRoute();

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
    this.resetLoginState();
  }

  closeLoginModal() {
    this.showLoginModal = false;
    this.resetLoginState();
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  private resetLoginState() {
    this.errorMessage = '';
    this.isLoading = false;
    this.loginInProgress = false;
    this.loginForm.reset();
    this.cdr.detectChanges();
  }

  onSubmitLogin() {
    // Validar formulario
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor, completa todos los campos correctamente';
      return;
    }

    // Prevenir múltiples submissions
    if (this.isLoading || this.loginInProgress) {
      console.log('⚠️ Login ya en proceso, ignorando...');
      return;
    }

    console.log('🔄 Iniciando proceso de login...');

    // Establecer estados de carga
    this.isLoading = true;
    this.loginInProgress = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // Obtener datos del formulario
    const loginRequest: LoginRequest = {
      username: this.loginForm.get('username')?.value?.trim(),
      password: this.loginForm.get('password')?.value
    };

    console.log('📤 Enviando solicitud de login para usuario:', loginRequest.username);

    // Timeout de seguridad
    const safetyTimeout = setTimeout(() => {
      console.log('🚨 SAFETY TIMEOUT: Reseteando estados después de 20 segundos');
      this.resetLoginState();
      this.errorMessage = 'La solicitud tardó demasiado tiempo. Por favor, inténtalo de nuevo.';
      this.toastr.error('Timeout de conexión', 'Error');
    }, 20000);

    this.authService.login(loginRequest)
      .pipe(
        timeout(15000), // Timeout de 15 segundos
        catchError((error: any) => {
          console.error('❌ Error capturado en login:', error);

          // Limpiar timeout de seguridad
          clearTimeout(safetyTimeout);

          // Resetear estados inmediatamente
          this.isLoading = false;
          this.loginInProgress = false;
          this.cdr.detectChanges();

          // Determinar mensaje de error específico
          let errorMsg = '';

          if (error.name === 'TimeoutError') {
            errorMsg = 'La conexión tardó demasiado tiempo. Verifica tu conexión a internet.';
          } else if (error.status === 0) {
            errorMsg = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
          } else if (error.status === 401) {
            errorMsg = 'Usuario o contraseña incorrectos.';
          } else if (error.status === 403) {
            errorMsg = 'Acceso denegado. Contacta al administrador.';
          } else if (error.status === 404) {
            errorMsg = 'Servicio de autenticación no encontrado.';
          } else if (error.status >= 500) {
            errorMsg = 'Error del servidor. Intenta más tarde o contacta al administrador.';
          } else {
            errorMsg = error.error?.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
          }

          this.errorMessage = errorMsg;
          this.toastr.error(errorMsg, 'Error de Login');

          // Retornar un observable vacío para completar el flujo
          return of(null);
        }),
        finalize(() => {
          // Este bloque SIEMPRE se ejecuta
          console.log('🏁 FINALIZE: Limpiando estados');
          clearTimeout(safetyTimeout);
          this.isLoading = false;
          this.loginInProgress = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            console.log('✅ Login exitoso');
            this.toastr.success('¡Bienvenido a Vecinos Conectados!', 'Login Exitoso');

            // Cerrar modal y navegar
            this.closeLoginModal();

            // Pequeño delay para mejor UX
            setTimeout(() => {
              this.router.navigate(['/welcome']);
            }, 300);
          }
        },
        error: (error) => {
          // Este caso debería ser manejado por catchError, pero mantenemos por seguridad
          console.error('❌ Error no manejado en subscribe:', error);
          this.isLoading = false;
          this.loginInProgress = false;
          this.errorMessage = 'Error inesperado. Por favor, inténtalo de nuevo.';
          this.toastr.error(this.errorMessage, 'Error');
          this.cdr.detectChanges();
        }
      });
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para el template
  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Método para verificar si un campo tiene errores
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  // Método para obtener el mensaje de error de un campo
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName === 'username' ? 'Usuario' : 'Contraseña'} es requerido`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `Mínimo ${minLength} caracteres`;
      }
    }
    return '';
  }
}
