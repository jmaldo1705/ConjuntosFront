
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
  // Enhanced features for Wakari residential complex
  enhancedFeatures = [
    {
      title: 'Gimnasio Completo',
      description: 'Espacio equipado con máquinas de cardio y pesas para mantenerte en forma.',
      icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
      colorFrom: 'from-red-500',
      colorTo: 'to-pink-600'
    },
    {
      title: 'Piscina',
      description: 'Amplia piscina para disfrutar en familia y relajarte después del trabajo.',
      icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
      colorFrom: 'from-blue-500',
      colorTo: 'to-cyan-600'
    },
    {
      title: 'Sala de Cine',
      description: 'Disfruta de películas y eventos especiales en nuestra cómoda sala de cine.',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      colorFrom: 'from-purple-500',
      colorTo: 'to-indigo-600'
    },
    {
      title: 'Zona de Juegos Infantiles',
      description: 'Área segura y divertida donde los niños pueden jugar y socializar.',
      icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      colorFrom: 'from-yellow-500',
      colorTo: 'to-orange-600'
    },
    {
      title: 'Cancha de Fútbol Sintética',
      description: 'Cancha de fútbol con césped sintético para partidos y entrenamientos.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      colorFrom: 'from-green-500',
      colorTo: 'to-emerald-600'
    },
    {
      title: 'Cancha de Básquetball',
      description: 'Cancha reglamentaria para practicar básquetball y organizar torneos.',
      icon: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7z',
      colorFrom: 'from-orange-500',
      colorTo: 'to-red-600'
    },
    {
      title: 'Zona BBQ',
      description: 'Espacio equipado con parrillas para asados familiares y reuniones al aire libre.',
      icon: 'M4 3h16M4 7h16M6 7v13M18 7v13M8 21h8',
      colorFrom: 'from-amber-500',
      colorTo: 'to-yellow-600'
    },
    {
      title: 'Zona de Fogata',
      description: 'Área especial para fogatas nocturnas, perfecta para momentos únicos en familia.',
      icon: 'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1-4 4-4 1.657 0 3 .895 3 2 0 1.5-.5 2.5-1.5 3.5l1.5 1.5zm-4.828-8.485A4 4 0 0010.5 6c-.5 0-1 .22-1.5.657A4 4 0 008 8.657',
      colorFrom: 'from-red-500',
      colorTo: 'to-orange-600'
    },
    {
      title: 'Shut para Basuras',
      description: 'Sistema centralizado de recolección de basuras que facilita la disposición de residuos de manera cómoda y ordenada para todos los residentes.',
      icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
      colorFrom: 'from-gray-500',
      colorTo: 'to-slate-600'
    },
    {
      title: 'Salón Social',
      description: 'Espacio amplio y versátil para celebraciones familiares y eventos comunitarios.',
      icon: 'M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C17 14.17 12.33 13 10 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h4v-2.5c0-2.33-4.67-3.5-7-3.5z',
      colorFrom: 'from-teal-500',
      colorTo: 'to-blue-600'
    },
    {
      title: 'Seguridad 24/7',
      description: 'Vigilancia permanente con acceso controlado por reconocimiento facial.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      colorFrom: 'from-gray-500',
      colorTo: 'to-gray-700'
    }
  ];


  // Features focused on resident portal and administration
  features = [
    {
      title: 'Portal de Residentes',
      description: 'Accede fácilmente a la información del conjunto, realiza pagos online y comunícate directamente con la administración.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
    },
    {
      title: 'Pagos en Línea',
      description: 'Paga tu administración, servicios adicionales y multas de forma segura desde casa, con recordatorios automáticos.',
      icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z'
    },
    {
      title: 'Reserva de Amenidades',
      description: 'Reserva fácilmente el salón social, cancha de fútbol, básquetball o la sala de cine desde tu portal.',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    },
    {
      title: 'Solicitudes de Mantenimiento',
      description: 'Reporta problemas y solicita mantenimiento de forma rápida, con seguimiento en tiempo real del estado.',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    }
  ];

  // Realistic testimonials for Wakari residents
  testimonials = [
    {
      name: 'Carmen Elena Rodríguez',
      role: 'Residente Torre A',
      quote: 'Vivir en Wakari es maravilloso. Los espacios verdes y la tranquilidad del sector La Samaria han sido perfectos para mi familia. El portal en línea facilita mucho la vida.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Luis Fernando Martínez',
      role: 'Presidente del Consejo',
      quote: 'La administración ha mejorado mucho desde que implementamos el sistema digital. Los residentes están más informados y la comunicación es más efectiva.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'María José Herrera',
      role: 'Administradora',
      quote: 'El sistema nos ha permitido ser más organizados y transparentes. Los residentes pueden hacer todo desde casa y nosotros tenemos mejor control de las actividades.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Andrés Camilo Torres',
      role: 'Residente Torre B',
      quote: 'Las amenidades son excelentes. La cancha de fútbol sintética y el gimnasio están siempre disponibles. Es como tener un club privado en casa.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
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

  // Method to handle login button click
  onLoginClick(): void {
    // This would typically open a login modal or navigate to login page
    console.log('Login button clicked');
  }

  // Method to handle contact form
  onContactClick(): void {
    // This would typically scroll to contact section or open contact modal
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Method to start virtual tour
  startVirtualTour(): void {
    // This would typically open virtual tour functionality
    console.log('Virtual tour started');
  }

  // Method to handle feature interaction
  onFeatureClick(feature: any): void {
    // This would typically show more details about the feature
    console.log('Feature clicked:', feature.title);
  }
}
