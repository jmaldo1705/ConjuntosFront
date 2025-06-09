import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';
  private readonly AUTH_URL = `${this.API_URL}/auth`;
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.AUTH_URL}/register`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    console.log('AuthService: Enviando solicitud de login...', request);

    return this.http.post<LoginResponse>(`${this.AUTH_URL}/login`, request)
      .pipe(
        tap(response => {
          console.log('AuthService: Login exitoso, guardando token...', response);
          this.setToken(response.token);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('AuthService: Error en login:', error);
          // Asegurar que el error se propague correctamente
          return throwError(() => error);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<User>(`${this.API_URL}/users/me`, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('AuthService: Error HTTP:', error);

    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = error.error?.message || `Error del servidor: ${error.status}`;
    }

    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      error: error.error
    }));
  }
}
