import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  // Features of the residential complex system
  features = [
    {
      title: 'Administración de la Comunidad',
      description: 'Gestión eficiente de comunidades residenciales con herramientas para administradores y residentes.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    {
      title: 'Procesamiento de Pagos',
      description: 'Procesamiento seguro y conveniente de pagos para cuotas y servicios comunitarios.',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z'
    },
    {
      title: 'Reserva de Zonas Comunes',
      description: 'Sistema sencillo para reservar zonas comunes como piscinas, gimnasios y salones de eventos.',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      title: 'Solicitudes de Mantenimiento',
      description: 'Proceso optimizado para enviar y hacer seguimiento a solicitudes de mantenimiento.',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    }
  ];

  // Testimonials from satisfied residents
  testimonials = [
    {
      name: 'María Rodríguez',
      role: 'Residente',
      quote: 'El sistema de administración del conjunto ha hecho que vivir aquí sea mucho más conveniente. ¡Puedo pagar mis cuotas en línea y reservar zonas comunes con solo unos clics!',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
    },
    {
      name: 'Carlos Méndez',
      role: 'Presidente del Consejo',
      quote: 'Como presidente del consejo, este sistema ha optimizado nuestras operaciones y mejorado la comunicación con todos los residentes.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Sofía García',
      role: 'Administradora',
      quote: 'Administrar múltiples propiedades nunca ha sido tan fácil. El tablero me proporciona toda la información que necesito de un vistazo.',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  ];
}
