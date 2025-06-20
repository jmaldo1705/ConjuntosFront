import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarService } from '../../services/sidebar.service';

interface QuickStat {
  id: number;
  label: string;
  value: string;
  icon: string;
  trend?: {
    type: 'positive' | 'negative' | 'neutral';
    value: string;
    label: string;
  };
}

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: string;
  route: string;
  badge?: string;
}

interface Reservation {
  id: number;
  area: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  icon: string;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  private router = inject(Router);
  private sidebarService = inject(SidebarService);

  // Use the shared service for sidebar state
  sidebarExpanded = this.sidebarService.sidebarExpanded;

  quickStats = signal<QuickStat[]>([
    {
      id: 1,
      label: 'Reservas',
      value: '3',
      icon: '🏊‍♂️'
    },
    {
      id: 2,
      label: 'Pagos',
      value: '$125K',
      icon: '💳'
    },
    {
      id: 3,
      label: 'Alertas',
      value: '5',
      icon: '🔔'
    },
    {
      id: 4,
      label: 'Estado',
      value: 'Al día',
      icon: '✅'
    }
  ]);

  quickActions = signal<QuickAction[]>([
    {
      id: 1,
      title: 'Nueva Reserva',
      description: 'Reservar zona común para tus actividades',
      icon: '🏊‍♂️',
      route: '/dashboard/reservas',
      badge: 'Popular'
    },
    {
      id: 2,
      title: 'Ver Pagos',
      description: 'Consultar estado de cuenta y pagos pendientes',
      icon: '💰',
      route: '/dashboard/pagos'
    },
    {
      id: 3,
      title: 'Reportar PQRS',
      description: 'Hacer peticiones, quejas, reclamos o sugerencias',
      icon: '📝',
      route: '/dashboard/pqrs'
    },
    {
      id: 4,
      title: 'Ver Eventos',
      description: 'Próximas actividades y eventos comunitarios',
      icon: '🎉',
      route: '/dashboard/eventos'
    },
    {
      id: 5,
      title: 'Noticias',
      description: 'Comunicados y noticias de la administración',
      icon: '📰',
      route: '/dashboard/noticias'
    },
    {
      id: 6,
      title: 'Configuración',
      description: 'Ajustar preferencias y configuración de cuenta',
      icon: '⚙️',
      route: '/dashboard/configuracion'
    }
  ]);

  recentReservations = signal<Reservation[]>([
    {
      id: 1,
      area: 'Piscina Principal',
      date: '2024-01-20',
      time: '14:00 - 16:00',
      status: 'confirmed'
    },
    {
      id: 2,
      area: 'Salón Social',
      date: '2024-01-22',
      time: '18:00 - 22:00',
      status: 'pending'
    },
    {
      id: 3,
      area: 'Gimnasio',
      date: '2024-01-25',
      time: '06:00 - 08:00',
      status: 'confirmed'
    }
  ]);

  notifications = signal<Notification[]>([
    {
      id: 1,
      title: 'Pago de Administración',
      message: 'Recordatorio: Su pago de administración vence el 25 de enero.',
      time: 'hace 2 horas',
      type: 'warning',
      icon: '⚠️'
    },
    {
      id: 2,
      title: 'Asamblea General',
      message: 'Nueva reunión de propietarios programada para el 30 de enero a las 7:00 PM.',
      time: 'hace 1 día',
      type: 'info',
      icon: 'ℹ️'
    },
    {
      id: 3,
      title: 'Mantenimiento Programado',
      message: 'Corte de agua programado para mañana de 8:00 AM a 12:00 PM.',
      time: 'hace 2 días',
      type: 'warning',
      icon: '🔧'
    },
    {
      id: 4,
      title: 'Pago Confirmado',
      message: 'Su pago de administración del mes de diciembre ha sido confirmado.',
      time: 'hace 3 días',
      type: 'success',
      icon: '✅'
    },
    {
      id: 5,
      title: 'Nueva Amenidad',
      message: 'Se ha habilitado el nuevo gimnasio al aire libre.',
      time: 'hace 1 semana',
      type: 'info',
      icon: '🎯'
    }
  ]);

  navigateToAction(route: string): void {
    this.router.navigate([route]);
  }

  getStatusLabel(status: string): string {
    const labels = {
      'confirmed': 'Confirmada',
      'pending': 'Pendiente',
      'cancelled': 'Cancelada'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toggleMobileSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
