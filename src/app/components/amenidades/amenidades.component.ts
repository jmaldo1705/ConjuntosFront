
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Amenidad {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  imagen: string;
  disponible: boolean;
  horarioApertura: string;
  horarioCierre: string;
  requiereReserva: boolean;
  capacidadMaxima?: number;
  ubicacion: string;
  caracteristicas: string[];
  restricciones?: string[];
}

@Component({
  selector: 'app-amenidades',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amenidades.component.html',
  styleUrls: ['./amenidades.component.css']
})
export class AmenidadesComponent {

  amenidades: Amenidad[] = [
    {
      id: 1,
      nombre: 'Piscina Principal',
      descripcion: 'Amplia piscina con área para adultos y niños, perfecta para la recreación familiar.',
      icono: 'swimming-pool',
      imagen: '/assets/images/piscina-principal.jpg',
      disponible: true,
      horarioApertura: '06:00',
      horarioCierre: '22:00',
      requiereReserva: false,
      capacidadMaxima: 50,
      ubicacion: 'Zona Central - Nivel 1',
      caracteristicas: [
        'Piscina semiolímpica 25m',
        'Área infantil separada',
        'Sistema de filtración automática',
        'Iluminación LED nocturna',
        'Duchas y vestieres'
      ],
      restricciones: [
        'Uso obligatorio de gorro de baño',
        'Prohibido el ingreso con bebidas alcohólicas',
        'Menores de 12 años deben estar acompañados'
      ]
    },
    {
      id: 2,
      nombre: 'Gimnasio',
      descripcion: 'Moderno gimnasio equipado con máquinas de última tecnología para cardio y entrenamiento de fuerza.',
      icono: 'dumbbell',
      imagen: '/assets/images/gimnasio.jpg',
      disponible: true,
      horarioApertura: '05:00',
      horarioCierre: '23:00',
      requiereReserva: true,
      capacidadMaxima: 20,
      ubicacion: 'Torre A - Nivel 2',
      caracteristicas: [
        'Máquinas de cardio',
        'Área de pesas libres',
        'Máquinas multifuncionales',
        'Sistema de aire acondicionado',
        'Música ambiental',
        'Vestieres con lockers'
      ],
      restricciones: [
        'Uso obligatorio de ropa deportiva',
        'Toalla personal requerida',
        'Tiempo máximo de uso: 2 horas'
      ]
    },
    {
      id: 3,
      nombre: 'Salón Social',
      descripcion: 'Elegante salón para eventos sociales, celebraciones familiares y reuniones comunitarias.',
      icono: 'calendar-event',
      imagen: '/assets/images/salon-social.jpg',
      disponible: true,
      horarioApertura: '08:00AM',
      horarioCierre: '10:00PM',
      requiereReserva: true,
      capacidadMaxima: 80,
      ubicacion: 'Zona Central - Primer Piso',
      caracteristicas: [
        'Capacidad para 80 personas',
        'Sistema de sonido profesional',
        'Cocina equipada',
        'Sillas incluidas',
        'Decoración moderna'
      ],
      restricciones: [
        'Reserva con 15 días de anticipación',
        'Depósito de garantía requerido',
        'Limpieza posterior obligatoria'
      ]
    },
    {
      id: 4,
      nombre: 'Zona BBQ',
      descripcion: 'Área al aire libre con parrillas y mesas para disfrutar de deliciosas carnes asadas en familia.',
      icono: 'grill',
      imagen: '/assets/images/zona-bbq.jpg',
      disponible: true,
      horarioApertura: '10:00',
      horarioCierre: '22:00',
      requiereReserva: true,
      capacidadMaxima: 40,
      ubicacion: 'Terraza - Nivel 4',
      caracteristicas: [
        '4 parrillas a gas',
        'Mesas y bancos de madera',
        'Lavaplatos',
        'Área techada',
        'Vista panorámica de la ciudad',
        'Zona de juegos infantiles cercana'
      ],
      restricciones: [
        'Limpieza obligatoria después del uso',
        'No se permite música a alto volumen',
        'Reserva máxima 6 horas'
      ]
    },
    {
      id: 5,
      nombre: 'Cancha Sintética',
      descripcion: 'Cancha para práctica de fútbol con superficie sintética.',
      icono: 'basketball',
      imagen: '/assets/images/cancha-multiple.jpg',
      disponible: true,
      horarioApertura: '06:00',
      horarioCierre: '22:00',
      requiereReserva: true,
      capacidadMaxima: 22,
      ubicacion: 'Zona Deportiva - Nivel 1',
      caracteristicas: [
        'Superficie sintética antideslizante',
        'Arcos de fútbol',
        'Graderías para espectadores',
        'Malla perimetral de seguridad'
      ],
      restricciones: [
        'Uso obligatorio de zapatos deportivos',
        'Reserva por turnos de 2 horas',
        'Máximo 22 personas simultáneamente'
      ]
    },
    {
      id: 6,
      nombre: 'Zona Infantil',
      descripcion: 'Parque infantil seguro y divertido con juegos apropiados para diferentes edades.',
      icono: 'playground',
      imagen: '/assets/images/zona-infantil.jpg',
      disponible: true,
      horarioApertura: '07:00',
      horarioCierre: '20:00',
      requiereReserva: false,
      ubicacion: 'Jardín Central - Nivel 1',
      caracteristicas: [
        'Juegos para edades 2-12 años',
        'Piso anti-golpes',
        'Columpios y toboganes',
        'Área de arena',
        'Bancas para padres',
        'Sombra natural de árboles'
      ],
      restricciones: [
        'Niños deben estar acompañados por un adulto',
        'Edad máxima: 12 años',
        'No se permite comida en el área de juegos'
      ]
    },
    {
      id: 7,
      nombre: 'Cinema',
      descripcion: 'Sala de cine en la cual podrás ver tus películas favoritas.',
      icono: 'briefcase',
      imagen: '/assets/images/business-center.jpg',
      disponible: true,
      horarioApertura: '06:00',
      horarioCierre: '23:00',
      requiereReserva: true,
      capacidadMaxima: 15,
      ubicacion: 'Torre C - Nivel 2',
      caracteristicas: [
        'WiFi de alta velocidad',
        'Café y agua gratis'
      ],
      restricciones: [
        'Reserva con 24 horas de anticipación',
        'Uso máximo 4 horas diarias'
      ]
    }
  ];

  selectedAmenidad: Amenidad | null = null;
  showReservaModal: boolean = false;

  constructor(private router: Router) {}

  openAmenidadDetail(amenidad: Amenidad): void {
    this.selectedAmenidad = amenidad;
  }

  closeAmenidadDetail(): void {
    this.selectedAmenidad = null;
  }

  openReservaModal(amenidad: Amenidad): void {
    if (amenidad.requiereReserva) {
      this.selectedAmenidad = amenidad;
      this.showReservaModal = true;
    }
  }

  closeReservaModal(): void {
    this.showReservaModal = false;
    this.selectedAmenidad = null;
  }

  // Método seguro para obtener los iconos - sin innerHTML
  getIconComponent(iconName: string): string {
    return iconName;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
