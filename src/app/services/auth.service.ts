
import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, Subscription, interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../models/auth.model';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private apiUrl = 'http://localhost:8080/api';
  private tokenCheckInterval: Subscription | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private toastService: ToastService
  ) {
    // Iniciar verificación de token si el usuario ya está logueado
    if (this.isLoggedIn()) {
      this.startTokenExpirationCheck();
    }
  }

  ngOnDestroy(): void {
    this.stopTokenExpirationCheck();
  }

  // Método para verificar si estamos en el navegador
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Método seguro para acceder a localStorage
  private getFromStorage(key: string): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  // Método seguro para guardar en localStorage
  private setToStorage(key: string, value: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(key, value);
    }
  }

  // Método seguro para eliminar de localStorage
  private removeFromStorage(key: string): void {
    if (this.isBrowser()) {
      localStorage.removeItem(key);
    }
  }

  // Obtener usuario actual de forma síncrona (seguro para SSR)
  getCurrentUserSync(): User | null {
    try {
      const token = this.getFromStorage('token');
      if (!token) {
        return null;
      }

      const userData = this.getFromStorage('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        // Asegurar que el usuario tenga un conjuntoId
        if (!user.conjuntoId) {
          user.conjuntoId = this.determinarConjuntoPorApartamento(user.apartmentNumber);
        }
        return user;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  // Método para determinar el conjunto basado en el número de apartamento
  private determinarConjuntoPorApartamento(apartmentNumber: string): string {
    if (!apartmentNumber) return 'conjunto-las-flores'; // fallback

    // Lógica para determinar el conjunto según la nomenclatura del apartamento
    const apartmentUpper = apartmentNumber.toUpperCase();

    if (apartmentUpper.startsWith('LF') || apartmentUpper.includes('FLORES')) {
      return 'conjunto-las-flores';
    }
    if (apartmentUpper.startsWith('LP') || apartmentUpper.includes('PINOS')) {
      return 'conjunto-los-pinos';
    }
    if (apartmentUpper.startsWith('VS') || apartmentUpper.includes('VILLA')) {
      return 'conjunto-villa-sol';
    }

    // Si el apartamento empieza con número, determinar por rango
    const numeroApartamento = parseInt(apartmentNumber);
    if (numeroApartamento >= 100 && numeroApartamento < 200) {
      return 'conjunto-las-flores';
    }
    if (numeroApartamento >= 200 && numeroApartamento < 300) {
      return 'conjunto-los-pinos';
    }
    if (numeroApartamento >= 300) {
      return 'conjunto-villa-sol';
    }

    return 'conjunto-las-flores'; // fallback por defecto
  }

  // Obtener usuario actual de forma asíncrona
  getCurrentUser(): Observable<User> {
    const user = this.getCurrentUserSync();
    if (user) {
      return of(user);
    }

    // Si no hay usuario en storage, intentar obtener del servidor
    return this.http.get<User>(`${this.apiUrl}/users/me`);
  }

  // Decodificar token JWT
  private decodeToken(token: string): any {
    try {
      // Dividir el token en sus partes (header, payload, signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decodificar la parte del payload (segunda parte)
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  // Verificar si el token ha expirado
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true; // Si no se puede decodificar o no tiene fecha de expiración, considerarlo expirado
    }

    // La fecha de expiración en el token está en segundos desde epoch
    const expirationDate = new Date(decoded.exp * 1000);
    const currentDate = new Date();

    return expirationDate < currentDate;
  }

  // Iniciar verificación periódica de expiración del token
  private startTokenExpirationCheck(): void {
    // Detener cualquier verificación existente primero
    this.stopTokenExpirationCheck();

    if (this.isBrowser()) {
      // Verificar cada minuto si el token ha expirado
      this.tokenCheckInterval = interval(60000).subscribe(() => {
        const token = this.getFromStorage('token');
        if (token && this.isTokenExpired(token)) {
          console.log('Token expirado detectado en verificación periódica');
          this.logout();
        }
      });
    }
  }

  // Detener verificación periódica de expiración del token
  private stopTokenExpirationCheck(): void {
    if (this.tokenCheckInterval) {
      this.tokenCheckInterval.unsubscribe();
      this.tokenCheckInterval = null;
    }
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    try {
      const token = this.getFromStorage('token');
      const user = this.getFromStorage('currentUser');

      // Verificar que tanto el token como el usuario existan
      if (!token || !user) {
        return false;
      }

      // Verificar que el token no esté expirado
      if (this.isTokenExpired(token)) {
        console.log('Token expirado, cerrando sesión');
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error verificando estado de login:', error);
      return false;
    }
  }

  // Método de login con tipado correcto
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  // Método de registro - ESTE ES EL QUE FALTABA
  register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    // Asegurar que el conjunto esté determinado antes de enviar
    if (!registerRequest.conjuntoId) {
      registerRequest.conjuntoId = this.determinarConjuntoPorApartamento(registerRequest.apartmentNumber);
    }

    return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, registerRequest);
  }

  // Guardar datos de usuario después del login
  saveUserData(token: string, user: User): void {
    this.setToStorage('token', token);

    // Asegurar que el usuario tenga un conjuntoId
    if (!user.conjuntoId) {
      user.conjuntoId = this.determinarConjuntoPorApartamento(user.apartmentNumber);
    }

    this.setToStorage('currentUser', JSON.stringify(user));

    // Iniciar verificación periódica de expiración del token
    this.startTokenExpirationCheck();
  }

  // Método de logout
  logout(): void {
    try {
      // Detener la verificación periódica de expiración del token
      this.stopTokenExpirationCheck();

      this.removeFromStorage('token');
      this.removeFromStorage('currentUser');

      // Limpiar cualquier otro dato de sesión que pueda existir
      if (this.isBrowser()) {
        // Limpiar localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.startsWith('auth_') ||
            key.startsWith('user_') ||
            key === 'token' ||
            key === 'currentUser' ||
            key.includes('token') ||
            key.includes('user')
          )) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));

        // Limpiar sessionStorage también
        const sessionKeysToRemove = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && (
            key.startsWith('auth_') ||
            key.startsWith('user_') ||
            key === 'token' ||
            key === 'currentUser' ||
            key.includes('token') ||
            key.includes('user')
          )) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));

        // Limpiar cookies relacionadas con la autenticación
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name && (
            name.startsWith('auth_') ||
            name.startsWith('user_') ||
            name === 'token' ||
            name === 'currentUser' ||
            name.includes('token') ||
            name.includes('user')
          )) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
      }

      // Mostrar mensaje de éxito
      this.toastService.authSuccess('Se ha cerrado sesión exitosamente');

      // Redirigir al usuario a la página de inicio
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error durante logout:', error);
      // Mostrar mensaje de error
      this.toastService.error('Hubo un problema al cerrar sesión', 'Error');
      // Intentar redirigir incluso si hay un error
      this.router.navigate(['/']);
    }
  }

  // Obtener token
  getToken(): string | null {
    return this.getFromStorage('token');
  }

  // Método para validar email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para validar contraseña
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
