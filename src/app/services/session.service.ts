
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface SessionState {
  isLoggedIn: boolean;
  user: any | null; // Usar tu interface User aquí
  lastActivity: number;
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSION_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutos
  private readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutos antes del vencimiento

  private sessionState = new BehaviorSubject<SessionState>({
    isLoggedIn: false,
    user: null,
    lastActivity: Date.now()
  });

  private sessionTimer?: any;
  private warningTimer?: any;

  public sessionState$ = this.sessionState.asObservable();

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeSession();
    this.setupActivityListeners();
  }

  private initializeSession(): void {
    if (this.isBrowser()) {
      const isLoggedIn = this.authService.isLoggedIn();
      const user = this.authService.getCurrentUserSync();

      this.updateSessionState({
        isLoggedIn,
        user,
        lastActivity: Date.now()
      });

      if (isLoggedIn) {
        this.startSessionTimer();
      }
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private setupActivityListeners(): void {
    if (this.isBrowser()) {
      // Escuchar eventos de actividad del usuario
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

      merge(...activityEvents.map(event => fromEvent(document, event)))
        .pipe(
          filter(() => this.sessionState.value.isLoggedIn)
        )
        .subscribe(() => {
          this.updateActivity();
        });

      // Escuchar cambios de visibilidad de la página
      fromEvent(document, 'visibilitychange').subscribe(() => {
        if (!document.hidden && this.sessionState.value.isLoggedIn) {
          this.checkSessionValidity();
        }
      });
    }
  }

  private updateActivity(): void {
    const currentState = this.sessionState.value;
    if (currentState.isLoggedIn) {
      this.updateSessionState({
        ...currentState,
        lastActivity: Date.now()
      });

      // Reiniciar timers
      this.startSessionTimer();
    }
  }

  private startSessionTimer(): void {
    this.clearTimers();

    // Timer de advertencia
    this.warningTimer = setTimeout(() => {
      this.showSessionWarning();
    }, this.SESSION_EXPIRY_TIME - this.WARNING_TIME);

    // Timer de expiración
    this.sessionTimer = setTimeout(() => {
      this.expireSession();
    }, this.SESSION_EXPIRY_TIME);
  }

  private clearTimers(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = undefined;
    }
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = undefined;
    }
  }

  private showSessionWarning(): void {
    this.toastr.warning(
      'Tu sesión expirará en 5 minutos. Realiza alguna acción para mantenerla activa.',
      'Advertencia de Sesión',
      {
        timeOut: 10000,
        progressBar: true,
        closeButton: true
      }
    );
  }

  private expireSession(): void {
    this.toastr.error('Tu sesión ha expirado por inactividad.', 'Sesión Expirada');
    this.logout();
  }

  private checkSessionValidity(): void {
    const currentState = this.sessionState.value;
    if (currentState.isLoggedIn) {
      const timeSinceLastActivity = Date.now() - currentState.lastActivity;

      if (timeSinceLastActivity >= this.SESSION_EXPIRY_TIME) {
        this.expireSession();
      } else {
        // Recalcular timer basado en el tiempo restante
        const remainingTime = this.SESSION_EXPIRY_TIME - timeSinceLastActivity;
        this.clearTimers();

        if (remainingTime > this.WARNING_TIME) {
          this.warningTimer = setTimeout(() => {
            this.showSessionWarning();
          }, remainingTime - this.WARNING_TIME);
        }

        this.sessionTimer = setTimeout(() => {
          this.expireSession();
        }, remainingTime);
      }
    }
  }

  private updateSessionState(newState: SessionState): void {
    this.sessionState.next(newState);
  }

  // Métodos públicos
  login(token: string, user: any): void {
    this.authService.saveUserData(token, user);

    this.updateSessionState({
      isLoggedIn: true,
      user,
      lastActivity: Date.now()
    });

    this.startSessionTimer();
    this.toastr.success(`¡Bienvenido ${user.fullName || user.username}!`, 'Login Exitoso');
  }

  logout(): void {
    this.clearTimers();
    this.authService.logout();

    this.updateSessionState({
      isLoggedIn: false,
      user: null,
      lastActivity: Date.now()
    });

    this.router.navigate(['/']);
  }

  extendSession(): void {
    if (this.sessionState.value.isLoggedIn) {
      this.updateActivity();
      this.toastr.success('Sesión extendida exitosamente.', 'Sesión Extendida');
    }
  }

  isLoggedIn(): boolean {
    return this.sessionState.value.isLoggedIn;
  }

  getCurrentUser(): any | null {
    return this.sessionState.value.user;
  }

  getSessionTimeRemaining(): number {
    const currentState = this.sessionState.value;
    if (!currentState.isLoggedIn) return 0;

    const elapsed = Date.now() - currentState.lastActivity;
    const remaining = this.SESSION_EXPIRY_TIME - elapsed;

    return Math.max(0, remaining);
  }
}
