
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  isActive: boolean;
  badge?: string;
  children?: NavItem[];
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  sidebarExpanded = signal(true);

  navItems = signal<NavItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'home',
      route: '/dashboard/welcome',
      isActive: true
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: 'calendar',
      route: '/dashboard/reservas',
      isActive: false,
      badge: '3'
    },
    {
      id: 'pagos',
      label: 'Pagos',
      icon: 'credit-card',
      route: '/dashboard/pagos',
      isActive: false
    },
    {
      id: 'eventos',
      label: 'Eventos',
      icon: 'star',
      route: '/dashboard/eventos',
      isActive: false,
      badge: '2'
    },
    {
      id: 'noticias',
      label: 'Noticias',
      icon: 'newspaper',
      route: '/dashboard/noticias',
      isActive: false
    },
    {
      id: 'pqrs',
      label: 'PQRS',
      icon: 'file-text',
      route: '/dashboard/pqrs',
      isActive: false
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: 'settings',
      route: '/dashboard/configuracion',
      isActive: false
    }
  ]);

  quickActions = signal<QuickAction[]>([
    {
      id: 'nueva-reserva',
      title: 'Nueva Reserva',
      icon: 'plus',
      color: 'blue',
      route: '/dashboard/reservas/nueva'
    },
    {
      id: 'pagar',
      title: 'Pagar Ahora',
      icon: 'credit-card',
      color: 'emerald',
      route: '/dashboard/pagos/nuevo'
    },
    {
      id: 'soporte',
      title: 'Soporte',
      icon: 'help-circle',
      color: 'purple',
      route: '/dashboard/soporte'
    }
  ]);

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarExpanded.set(!this.sidebarExpanded());
  }

  navigateToItem(item: NavItem): void {
    // Actualizar estado activo
    this.navItems.update(items =>
      items.map(navItem => ({
        ...navItem,
        isActive: navItem.id === item.id
      }))
    );

    this.router.navigate([item.route]);
  }

  navigateToAction(route: string): void {
    this.router.navigate([route]);
  }

  getUserInitials(): string {
    return 'JD'; // Juan Díaz - ejemplo
  }

  getUserName(): string {
    return 'Juan Díaz';
  }

  getUserApartment(): string {
    return 'Apt. 502 - Torre B';
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}
