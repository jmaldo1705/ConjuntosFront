import {CommonModule} from '@angular/common';
import {NgIcon} from '@ng-icons/core';
import {Component} from '@angular/core';
import {LoginModalService} from '../../services/login-modal.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, NgIcon],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  constructor(private loginModalService: LoginModalService) {}

  // Method to handle login button click
  openLoginModal(): void {
    this.loginModalService.openLoginModal();
  }

  // Servicios principales de la plataforma
  serviciosPrincipales = [
    {
      title: 'Portal de Administración',
      description: 'Sistema completo para la gestión administrativa de conjuntos residenciales con herramientas avanzadas.',
      icon: 'tablerBuilding',
      features: ['Gestión de residentes', 'Control de pagos', 'Reportes detallados', 'Comunicación directa']
    },
    {
      title: 'Marketplace Inmobiliario',
      description: 'Plataforma de compra, venta y arriendo de apartamentos con búsqueda avanzada y filtros.',
      icon: 'tablerHome',
      features: ['Listados premium', 'Búsqueda avanzada', 'Tours virtuales', 'Asesoría especializada']
    }
  ];

  // Características del sistema de gestión
  caracteristicasGestion = [
    {
      title: 'Gestión de Residentes',
      description: 'Administra la información de propietarios e inquilinos de forma centralizada.',
      icon: 'tablerUsers',
      colorFrom: 'from-blue-500',
      colorTo: 'to-cyan-600'
    },
    {
      title: 'Pagos en Línea',
      description: 'Sistema de pagos integrado para administración, servicios y multas.',
      icon: 'tablerCreditCard',
      colorFrom: 'from-green-500',
      colorTo: 'to-emerald-600'
    },
    {
      title: 'Reservas de Amenidades',
      description: 'Gestión completa de reservas de espacios comunes y amenidades.',
      icon: 'tablerCalendar',
      colorFrom: 'from-purple-500',
      colorTo: 'to-indigo-600'
    },
    {
      title: 'Comunicación Efectiva',
      description: 'Sistema de notificaciones y comunicados para mantener informados a los residentes.',
      icon: 'tablerBell',
      colorFrom: 'from-yellow-500',
      colorTo: 'to-orange-600'
    },
    {
      title: 'Mantenimiento y Solicitudes',
      description: 'Gestión de solicitudes de mantenimiento con seguimiento en tiempo real.',
      icon: 'tablerTool',
      colorFrom: 'from-red-500',
      colorTo: 'to-pink-600'
    },
    {
      title: 'Reportes y Analytics',
      description: 'Dashboards y reportes detallados para la toma de decisiones.',
      icon: 'tablerChartBar',
      colorFrom: 'from-indigo-500',
      colorTo: 'to-purple-600'
    },
    {
      title: 'Seguridad Integrada',
      description: 'Control de acceso y registro de visitantes digitalizado.',
      icon: 'tablerShield',
      colorFrom: 'from-gray-500',
      colorTo: 'to-slate-600'
    },
    {
      title: 'Portal Móvil',
      description: 'Acceso completo desde dispositivos móviles para residentes y administradores.',
      icon: 'tablerDeviceMobile',
      colorFrom: 'from-teal-500',
      colorTo: 'to-blue-600'
    }
  ];

  // Características del marketplace inmobiliario
  caracteristicasMarketplace = [
    {
      title: 'Búsqueda Avanzada',
      description: 'Filtros inteligentes por ubicación, precio, características y amenidades.',
      icon: 'tablerSearch',
      colorFrom: 'from-blue-500',
      colorTo: 'to-indigo-600'
    },
    {
      title: 'Tours Virtuales',
      description: 'Recorridos virtuales 360° de los apartamentos disponibles.',
      icon: 'tablerEye',
      colorFrom: 'from-purple-500',
      colorTo: 'to-pink-600'
    },
    {
      title: 'Asesoría Especializada',
      description: 'Acompañamiento profesional en todo el proceso de compra o arriendo.',
      icon: 'tablerUserCheck',
      colorFrom: 'from-green-500',
      colorTo: 'to-teal-600'
    },
    {
      title: 'Documentación Digital',
      description: 'Gestión completa de contratos y documentos de forma digital.',
      icon: 'tablerFileText',
      colorFrom: 'from-orange-500',
      colorTo: 'to-red-600'
    }
  ];

  // Estadísticas de la plataforma
  estadisticasPlataforma = {
    conjuntos: '50+',
    apartamentos: '2,500+',
    residentes: '8,000+',
    transacciones: '99.9%'
  };

  // Información de contacto
  contactoInfo = {
    telefono: '+57 316 666 3666',
    email: 'info@vecinosconectados.com',
    horario: 'Lun - Vie: 8:00 AM - 6:00 PM',
    soporte: 'Soporte 24/7 disponible'
  };

  // Testimonios de clientes
  testimonios = [
    {
      nombre: 'María González',
      cargo: 'Administradora',
      conjunto: 'Conjunto Las Flores',
      testimonio: 'La plataforma ha revolucionado la gestión de nuestro conjunto. Todo es más eficiente y transparente.',
      foto: 'https://randomuser.me/api/portraits/women/32.jpg',
      rating: 5
    },
    {
      nombre: 'Carlos Rodríguez',
      cargo: 'Propietario',
      conjunto: 'Conjunto Los Pinos',
      testimonio: 'Encontré mi apartamento ideal a través del marketplace. El proceso fue muy fácil y rápido.',
      foto: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 5
    },
    {
      nombre: 'Ana Martínez',
      cargo: 'Tesorera',
      conjunto: 'Villa del Sol',
      testimonio: 'Los reportes financieros y el control de pagos nos han facilitado enormemente la administración.',
      foto: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 5
    }
  ];
}
