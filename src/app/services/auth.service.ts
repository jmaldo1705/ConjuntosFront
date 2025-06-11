
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    const token = this.getFromStorage('token');
    return !!token;
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
  }

  // Método de logout
  logout(): void {
    this.removeFromStorage('token');
    this.removeFromStorage('currentUser');
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
