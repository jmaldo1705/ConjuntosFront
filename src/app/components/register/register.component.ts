import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest, RegisterResponse } from '../../models/auth.model';
import { ToastrService } from 'ngx-toastr';

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
    conjuntoId: '' // Se determinará automáticamente
  };

  confirmPassword = '';
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  // Mensajes para el template
  errorMessage = '';
  successMessage = '';

  // Errores de validación
  validationErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    // Limpiar mensajes previos
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
        this.toastr.success('Usuario registrado exitosamente', 'Registro Completo');
        console.log('Usuario registrado:', response);

        // Redirigir al login después de registro exitoso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error en registro:', error);

        if (error.status === 400) {
          this.errorMessage = 'Datos inválidos. Verifique la información ingresada.';
          this.toastr.error('Datos inválidos. Verifique la información ingresada.', 'Error de Registro');
        } else if (error.status === 409) {
          this.errorMessage = 'El usuario o email ya existe. Por favor, use datos diferentes.';
          this.toastr.error('El usuario o email ya existe.', 'Usuario Duplicado');
        } else if (error.status === 500) {
          this.errorMessage = 'Error interno del servidor. Intente nuevamente más tarde.';
          this.toastr.error('Error del servidor. Intente nuevamente.', 'Error del Servidor');
        } else {
          this.errorMessage = 'Error al registrar usuario. Verifique su conexión e intente nuevamente.';
          this.toastr.error('Error al registrar usuario. Intente nuevamente.', 'Error de Conexión');
        }
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

  // Método para limpiar mensajes
  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Método que se ejecuta cuando el usuario empieza a escribir en cualquier campo
  onFieldChange() {
    // Limpiar mensajes cuando el usuario interactúa con el formulario
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

  // Método para obtener el conjunto automáticamente basado en el apartamento
  onApartmentNumberChange() {
    // Limpiar error previo
    if (this.validationErrors['apartmentNumber']) {
      delete this.validationErrors['apartmentNumber'];
    }

    // Limpiar mensajes generales
    this.onFieldChange();

    // El conjunto se determinará automáticamente en el servicio
    // pero podemos mostrar una vista previa al usuario
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

  // Método para obtener el mensaje de error de un campo específico
  getFieldError(fieldName: string): string {
    return this.validationErrors[fieldName] || '';
  }

  // Método para verificar si un campo tiene error
  hasFieldError(fieldName: string): boolean {
    return !!this.validationErrors[fieldName];
  }

  // Método para limpiar error de un campo específico
  clearFieldError(fieldName: string) {
    if (this.validationErrors[fieldName]) {
      delete this.validationErrors[fieldName];
    }
  }
}
