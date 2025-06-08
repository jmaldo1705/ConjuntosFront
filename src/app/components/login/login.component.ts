import { Component } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        // After successful login, navigate to welcome page
        this.router.navigate(['/welcome']);
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        // Handle specific error cases
        if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.';
        } else if (error.status === 403) {
          this.errorMessage = 'Tu cuenta no tiene permisos para acceder. Contacta al administrador.';
        } else {
          this.errorMessage = error.error?.message || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
        }
        this.toastr.error(this.errorMessage, 'Error');
      }
    });
  }
}
