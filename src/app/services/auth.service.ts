import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
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
    return this.http.post<RegisterResponse>(`${this.AUTH_URL}/register`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.AUTH_URL}/login`, request)
      .pipe(
        tap(response => {
          this.setToken(response.token);
        })
      );
  }

  getCurrentUser(): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<User>(`${this.API_URL}/users/me`, { headers });
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
}
