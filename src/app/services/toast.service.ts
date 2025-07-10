
import { Injectable, inject, DestroyRef } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastr = inject(ToastrService);

  constructor() {}

  /**
   * Método seguro para mostrar toasts que maneja errores de injector destruido
   */
  private safeToast(type: 'success' | 'error' | 'warning' | 'info', message: string, title?: string, config?: Partial<IndividualConfig>): void {
    try {
      switch (type) {
        case 'success':
          this.toastr.success(message, title, config);
          break;
        case 'error':
          this.toastr.error(message, title, config);
          break;
        case 'warning':
          this.toastr.warning(message, title, config);
          break;
        case 'info':
          this.toastr.info(message, title, config);
          break;
      }
    } catch (error) {
      // Si el injector está destruido, usar console como fallback
      console.warn(`Toast ${type}: ${title ? title + ' - ' : ''}${message}`);
    }
  }

  /**
   * Muestra un toast de éxito
   */
  success(message: string, title?: string, options?: Partial<IndividualConfig>): void {
    const config: Partial<IndividualConfig> = {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
      ...options
    };

    this.safeToast('success', message, title, config);
  }

  /**
   * Muestra un toast de error
   */
  error(message: string, title?: string, options?: Partial<IndividualConfig>): void {
    const config: Partial<IndividualConfig> = {
      timeOut: 6000,
      progressBar: true,
      closeButton: true,
      ...options
    };

    this.safeToast('error', message, title, config);
  }

  /**
   * Muestra un toast de advertencia
   */
  warning(message: string, title?: string, options?: Partial<IndividualConfig>): void {
    const config: Partial<IndividualConfig> = {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      ...options
    };

    this.safeToast('warning', message, title, config);
  }

  /**
   * Toast para operaciones de login/auth
   */
  authSuccess(message: string): void {
    this.success(message, '🔐 Autenticación', {
      timeOut: 3000,
      positionClass: 'toast-top-center'
    });
  }

  /**
   * Toast para operaciones de red
   */
  networkError(message: string): void {
    this.error(message, '🌐 Error de Conexión', {
      timeOut: 8000,
      positionClass: 'toast-bottom-right'
    });
  }

  /**
   * Toast para confirmaciones importantes
   */
  confirmation(message: string): void {
    this.persistent(message, '✅ Confirmación', 'success');
  }

  /**
   * Muestra un toast de información
   */
  info(message: string, title?: string, options?: Partial<IndividualConfig>): void {
    const config: Partial<IndividualConfig> = {
      timeOut: 4000,
      progressBar: true,
      closeButton: true,
      ...options
    };

    this.safeToast('info', message, title, config);
  }

  /**
   * Limpia todos los toasts
   */
  clear(): void {
    try {
      this.toastr.clear();
    } catch (error) {
      console.warn('No se pudo limpiar los toasts, injector posiblemente destruido');
    }
  }

  /**
   * Métodos de conveniencia con configuraciones específicas
   */
  quickSuccess(message: string): void {
    this.success(message, '✅ Éxito', { timeOut: 3000 });
  }

  quickError(message: string): void {
    this.error(message, '❌ Error', { timeOut: 5000 });
  }

  quickWarning(message: string): void {
    this.warning(message, '⚠️ Atención', { timeOut: 4000 });
  }

  quickInfo(message: string): void {
    this.info(message, 'ℹ️ Información', { timeOut: 4000 });
  }

  /**
   * Toast persistente (no se cierra automáticamente)
   */
  persistent(message: string, title: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const config: Partial<IndividualConfig> = {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: true,
      tapToDismiss: false
    };

    this.safeToast(type, message, title, config);
  }
}
