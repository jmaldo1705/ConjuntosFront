import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    username: '',
    password: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  debugInfo: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  addDebugInfo(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.debugInfo.push(`${timestamp}: ${message}`);
    console.log(`🐛 DEBUG: ${message}`);

    // Mantener solo los últimos 10 mensajes
    if (this.debugInfo.length > 10) {
      this.debugInfo.shift();
    }
  }

  resetLoadingState(reason: string) {
    this.addDebugInfo(`RESETING isLoading to false - Reason: ${reason}`);
    this.isLoading = false;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    this.addDebugInfo('=== INICIO onSubmit() ===');

    // Validar que no esté ya procesando
    if (this.isLoading) {
      this.addDebugInfo('CANCELADO: Ya está en loading');
      return;
    }

    // Validar campos
    if (!this.loginRequest.username?.trim() || !this.loginRequest.password?.trim()) {
      this.errorMessage = 'Por favor completa todos los campos';
      this.addDebugInfo('CANCELADO: Campos vacíos');
      return;
    }

    // Iniciar loading
    this.addDebugInfo('Estableciendo isLoading = true');
    this.errorMessage = '';
    this.isLoading = true;
    this.cdr.detectChanges();

    // Timeout de emergencia
    const emergencyTimeout = setTimeout(() => {
      this.resetLoadingState('EMERGENCY TIMEOUT after 10 seconds');
      this.errorMessage = 'Timeout de emergencia activado';
      this.toastr.error('Timeout de emergencia', 'Error');
    }, 10000);

    this.addDebugInfo('Llamando authService.login()');

    // Hacer la llamada HTTP sin RxJS operators complicados
    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        clearTimeout(emergencyTimeout);
        this.addDebugInfo('SUCCESS: Login exitoso');
        this.resetLoadingState('Login exitoso');
        this.toastr.success('Login exitoso', 'Éxito');
        setTimeout(() => {
          this.router.navigate(['/welcome']);
        }, 100);
      },
      error: (error) => {
        clearTimeout(emergencyTimeout);
        this.addDebugInfo(`ERROR: ${error.status} - ${error.message}`);
        this.resetLoadingState('Error en login');

        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas';
        } else {
          this.errorMessage = 'Error de conexión';
        }
        this.toastr.error(this.errorMessage, 'Error');
      },
      complete: () => {
        clearTimeout(emergencyTimeout);
        this.addDebugInfo('COMPLETE: Observable completado');
        this.resetLoadingState('Observable complete');
      }
    });

    this.addDebugInfo('=== FIN onSubmit() ===');
  }

  // Método de emergencia
  forceReset(): void {
    this.addDebugInfo('FORCE RESET ejecutado manualmente');
    this.isLoading = false;
    this.errorMessage = '';
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  // Método público para toggle loading (para testing)
  toggleLoading(): void {
    this.addDebugInfo(`TOGGLE: isLoading cambiado de ${this.isLoading} a ${!this.isLoading}`);
    this.isLoading = !this.isLoading;
    this.cdr.detectChanges();
  }

  clearDebug(): void {
    this.debugInfo = [];
  }

  onInputChange(): void {
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}
