
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalService } from '../../services/login-modal.service';
import {NgIcon} from '@ng-icons/core';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, NgIcon], // Agregamos NgIcon aquí
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  constructor(private loginModalService: LoginModalService) {}

  // Method to handle login button click
  openLoginModal(): void {
    this.loginModalService.openLoginModal();
  }

  // Enhanced features for Wakari residential complex
  enhancedFeatures = [
    {
      title: 'Gimnasio Completo',
      description: 'Espacio equipado con máquinas de cardio y pesas para mantenerte en forma.',
      icon: 'tablerBarbell',
      colorFrom: 'from-red-500',
      colorTo: 'to-pink-600'
    },
    {
      title: 'Piscina',
      description: 'Amplia piscina para disfrutar en familia y relajarte después del trabajo.',
      icon: 'tablerPool',
      colorFrom: 'from-blue-500',
      colorTo: 'to-cyan-600'
    },
    {
      title: 'Sala de Cine',
      description: 'Disfruta de películas y eventos especiales en nuestra cómoda sala de cine.',
      icon: 'tablerMovie',
      colorFrom: 'from-purple-500',
      colorTo: 'to-indigo-600'
    },
    {
      title: 'Zona de Juegos Infantiles',
      description: 'Área segura y divertida donde los niños pueden jugar y socializar.',
      icon: 'tablerMoodSmile',
      colorFrom: 'from-yellow-500',
      colorTo: 'to-orange-600'
    },
    {
      title: 'Cancha de Fútbol Sintética',
      description: 'Cancha de fútbol con césped sintético para partidos y entrenamientos.',
      icon: 'tablerBallFootball',
      colorFrom: 'from-green-500',
      colorTo: 'to-emerald-600'
    },
    {
      title: 'Cancha de Básquetball',
      description: 'Cancha reglamentaria para practicar básquetball y organizar torneos.',
      icon: 'tablerBallBasketball',
      colorFrom: 'from-orange-500',
      colorTo: 'to-red-600'
    },
    {
      title: 'Zona BBQ',
      description: 'Espacio equipado con parrillas para asados familiares y reuniones al aire libre.',
      icon: 'tablerGrill',
      colorFrom: 'from-amber-500',
      colorTo: 'to-yellow-600'
    },
    {
      title: 'Zona de Fogata',
      description: 'Área especial para fogatas nocturnas, perfecta para momentos únicos en familia.',
      icon: 'tablerFlame',
      colorFrom: 'from-red-500',
      colorTo: 'to-orange-600'
    },
    {
      title: 'Salón Social',
      description: 'Espacio amplio y versátil para celebraciones familiares y eventos comunitarios.',
      icon: 'tablerUsers',
      colorFrom: 'from-teal-500',
      colorTo: 'to-blue-600'
    },
    {
      title: 'Shut para Basuras',
      description: 'Sistema centralizado de recolección de basuras que facilita la disposición de residuos de manera cómoda y ordenada para todos los residentes.',
      icon: 'tablerTrash',
      colorFrom: 'from-gray-500',
      colorTo: 'to-slate-600'
    },
    {
      title: 'Seguridad 24/7',
      description: 'Vigilancia permanente con acceso controlado por reconocimiento facial.',
      icon: 'tablerShield',
      colorFrom: 'from-gray-500',
      colorTo: 'to-gray-700'
    }
  ];

  // Features focused on resident portal and administration
  features = [
    {
      title: 'Portal de Residentes',
      description: 'Accede fácilmente a la información del conjunto, realiza pagos online y comunícate directamente con la administración.',
      icon: 'tablerBuilding'
    },
    {
      title: 'Pagos en Línea',
      description: 'Paga tu administración, servicios adicionales y multas de forma segura desde casa, con recordatorios automáticos.',
      icon: 'tablerCreditCard'
    },
    {
      title: 'Reserva de Amenidades',
      description: 'Reserva fácilmente el salón social, cancha de fútbol, BBQ, fogata o la sala de cine desde tu portal.',
      icon: 'tablerCalendar'
    },
    {
      title: 'Solicitudes de Mantenimiento',
      description: 'Reporta problemas y solicita mantenimiento de forma rápida, con seguimiento en tiempo real del estado.',
      icon: 'tablerTool'
    }
  ];

  // Wakari specific information - updated for Ibagué
  wakariInfo = {
    name: 'Wakari',
    tagline: 'Tranquilidad y Bienestar en La Samaria',
    description: 'Un conjunto residencial diseñado para brindarte comodidad, seguridad y espacios verdes en el corazón de Ibagué.',
    stats: {
      apartments: '120',
      security: '24/7',
      greenAreas: '65%',
      satisfaction: '96%'
    },
    contact: {
      phone: '+57 321 456 7890',
      email: 'administracion@wakari.co',
      schedule: 'Lun - Vie: 8:00 AM - 5:00 PM, Sáb: 8:00 AM - 12:00 PM',
      location: 'Ibagué, Tolima',
      address: 'Cll 95 # 13 - 175 Sur, Sector La Samaria'
    }
  };
}
