import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  // Verificar si el usuario está logueado (esto también verifica si el token ha expirado)
  if (authService.isLoggedIn()) {
    // Obtener el token
    const token = authService.getToken();

    // Clonar la request y agregar el token si existe
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      // Manejar la respuesta
      return next(authReq).pipe(
        catchError((error) => {
          // Si el token expiró o es inválido
          if (error.status === 401) {
            authService.logout();
            toastService.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            router.navigate(['/']);
          }
          return throwError(() => error);
        })
      );
    }
  }

  // Si no hay token o el usuario no está logueado, continuar sin token
  return next(req).pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
