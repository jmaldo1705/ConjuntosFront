export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  apartmentNumber: string;
  phoneNumber: string;
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
}
