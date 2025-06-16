import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest, RegisterResponse } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    fullName: '',
    apartmentNumber: '',
    phoneNumber: '',
    conjuntoId: ''
  };

  confirmPassword = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  successMessage = '';
  validationErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.clearMessages();

    if (!this.validateForm()) {
      this.errorMessage = 'Por favor, corrija los errores en el formulario.';

      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerRequest).subscribe({
      next: (response: RegisterResponse) => {
        this.isLoading = false;
        this.successMessage = 'Usuario registrado exitosamente. Redirigiendo al login...';

        console.log('Usuario registrado:', response);

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error en registro:', error);

        let errorMessage = '';
        let toastMessage = '';

        if (error.status === 400) {
          errorMessage = 'Datos inválidos. Verifique la información ingresada.';
          toastMessage = 'Datos inválidos. Revise el formulario.';
        } else if (error.status === 409) {
          errorMessage = 'El usuario o email ya existe. Por favor, use datos diferentes.';
          toastMessage = 'Usuario o email ya existe.';
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
          toastMessage = 'Error del servidor. Intente más tarde.';
        } else {
          errorMessage = 'Error al registrar usuario. Verifique su conexión e intente nuevamente.';
          toastMessage = 'Error de conexión. Intente nuevamente.';
        }

        this.errorMessage = errorMessage;
      }
    });
  }

  validateForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    // Validar nombre completo
    if (!this.registerRequest.fullName.trim()) {
      this.validationErrors['fullName'] = 'El nombre completo es requerido';
      isValid = false;
    } else if (this.registerRequest.fullName.trim().length < 2) {
      this.validationErrors['fullName'] = 'El nombre debe tener al menos 2 caracteres';
      isValid = false;
    }

    // Validar nombre de usuario
    if (!this.registerRequest.username.trim()) {
      this.validationErrors['username'] = 'El nombre de usuario es requerido';
      isValid = false;
    } else if (this.registerRequest.username.length < 3) {
      this.validationErrors['username'] = 'El nombre de usuario debe tener al menos 3 caracteres';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(this.registerRequest.username)) {
      this.validationErrors['username'] = 'El nombre de usuario solo puede contener letras, números y guiones bajos';
      isValid = false;
    }

    // Validar email
    if (!this.registerRequest.email.trim()) {
      this.validationErrors['email'] = 'El email es requerido';
      isValid = false;
    } else if (!this.authService.validateEmail(this.registerRequest.email)) {
      this.validationErrors['email'] = 'Ingrese un email válido';
      isValid = false;
    }

    // Validar número de apartamento
    if (!this.registerRequest.apartmentNumber.trim()) {
      this.validationErrors['apartmentNumber'] = 'El número de apartamento es requerido';
      isValid = false;
    }

    // Validar teléfono
    if (!this.registerRequest.phoneNumber.trim()) {
      this.validationErrors['phoneNumber'] = 'El número de teléfono es requerido';
      isValid = false;
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(this.registerRequest.phoneNumber)) {
      this.validationErrors['phoneNumber'] = 'Ingrese un número de teléfono válido';
      isValid = false;
    }

    // Validar contraseña
    if (!this.registerRequest.password) {
      this.validationErrors['password'] = 'La contraseña es requerida';
      isValid = false;
    } else {
      const passwordValidation = this.authService.validatePassword(this.registerRequest.password);
      if (!passwordValidation.valid) {
        this.validationErrors['password'] = passwordValidation.errors.join(', ');
        isValid = false;
      }
    }

    // Validar confirmación de contraseña
    if (!this.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Debe confirmar la contraseña';
      isValid = false;
    } else if (this.registerRequest.password !== this.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Las contraseñas no coinciden';
      isValid = false;
    }

    return isValid;
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onFieldChange() {
    if (this.errorMessage || this.successMessage) {
      this.clearMessages();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onApartmentNumberChange() {
    if (this.validationErrors['apartmentNumber']) {
      delete this.validationErrors['apartmentNumber'];
    }

    this.onFieldChange();

    if (this.registerRequest.apartmentNumber) {
      const conjunto = this.determinarConjuntoVisual(this.registerRequest.apartmentNumber);
      console.log('Conjunto determinado:', conjunto);
    }
  }

  private determinarConjuntoVisual(apartmentNumber: string): string {
    const apartmentUpper = apartmentNumber.toUpperCase();

    if (apartmentUpper.startsWith('LF') || apartmentUpper.includes('FLORES')) {
      return 'Conjunto Residencial Las Flores';
    }
    if (apartmentUpper.startsWith('LP') || apartmentUpper.includes('PINOS')) {
      return 'Conjunto Residencial Los Pinos';
    }
    if (apartmentUpper.startsWith('VS') || apartmentUpper.includes('VILLA')) {
      return 'Conjunto Villa del Sol';
    }

    const numeroApartamento = parseInt(apartmentNumber);
    if (numeroApartamento >= 100 && numeroApartamento < 200) {
      return 'Conjunto Residencial Las Flores';
    }
    if (numeroApartamento >= 200 && numeroApartamento < 300) {
      return 'Conjunto Residencial Los Pinos';
    }
    if (numeroApartamento >= 300) {
      return 'Conjunto Villa del Sol';
    }

    return 'Conjunto Residencial Las Flores';
  }

  getConjuntoDisplay(): string {
    if (this.registerRequest.apartmentNumber) {
      return this.determinarConjuntoVisual(this.registerRequest.apartmentNumber);
    }
    return '';
  }

  getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName] || '';
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.validationErrors[fieldName];
  }

  clearFieldError(fieldName: string) {
    if (this.validationErrors[fieldName]) {
      delete this.validationErrors[fieldName];
    }
  }
}
