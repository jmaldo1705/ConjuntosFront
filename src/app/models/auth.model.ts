import type { ConfiguracionSistema } from './shared.model';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  apartmentNumber: string;
  phoneNumber: string;
  conjuntoId?: string; // Agregar conjunto ID
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  apartmentNumber: string;
  phoneNumber: string;
  roles: string[];
  isActive: boolean;
  conjuntoId: string; // ID del conjunto al que pertenece
  conjunto?: ConfiguracionSistema; // Información del conjunto
}
