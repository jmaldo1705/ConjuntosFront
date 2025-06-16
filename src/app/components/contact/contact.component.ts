import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

interface ContactFormData {
  nombreConjunto: string;
  numeroUnidades: string;
  nombreContacto: string;
  cargo: string;
  telefono: string;
  email: string;
  ciudad: string;
  comunicacion: boolean;
  pagos: boolean;
  reservas: boolean;
  seguridad: boolean;
  mantenimiento: boolean;
  reportes: boolean;
  mensaje: string;
  aceptaTerminos: boolean;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  @ViewChild('contactForm') contactFormElement!: ElementRef;
  @ViewChild('featuresSection') featuresSection!: ElementRef;

  isSubmitting = false;

  formData: ContactFormData = {
    nombreConjunto: '',
    numeroUnidades: '',
    nombreContacto: '',
    cargo: '',
    telefono: '',
    email: '',
    ciudad: '',
    comunicacion: false,
    pagos: false,
    reservas: false,
    seguridad: false,
    mantenimiento: false,
    reportes: false,
    mensaje: '',
    aceptaTerminos: false
  };

  constructor(private toastService: ToastService) {}

  scrollToForm(): void {
    this.contactFormElement.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  scrollToFeatures(): void {
    this.featuresSection.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  onSubmit(): void {
    if (!this.formData.aceptaTerminos) {
      this.toastService.error('Debes aceptar los términos y condiciones', 'Error de validación');
      return;
    }

    this.isSubmitting = true;

    // Simular envío de formulario
    setTimeout(() => {
      console.log('Formulario enviado:', this.formData);

      this.toastService.success(
        'Un especialista se contactará contigo en las próximas 24 horas.',
        '¡Solicitud Enviada!',
        { timeOut: 6000 }
      );

      this.resetForm();
      this.isSubmitting = false;
    }, 2000);
  }

  private resetForm(): void {
    this.formData = {
      nombreConjunto: '',
      numeroUnidades: '',
      nombreContacto: '',
      cargo: '',
      telefono: '',
      email: '',
      ciudad: '',
      comunicacion: false,
      pagos: false,
      reservas: false,
      seguridad: false,
      mantenimiento: false,
      reportes: false,
      mensaje: '',
      aceptaTerminos: false
    };
  }
}
