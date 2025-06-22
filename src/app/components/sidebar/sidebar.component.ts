import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';
import { NgIconComponent } from '@ng-icons/core';

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
  imports: [CommonModule, NgIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  // Use the shared service for sidebar state
  sidebarExpanded;

  navItems = signal<NavItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'tablerHome',
      route: '/dashboard/welcome',
      isActive: true
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: 'tablerCalendar',
      route: '/dashboard/reservas',
      isActive: false,
      badge: '3'
    },
    {
      id: 'pagos',
      label: 'Pagos',
      icon: 'tablerCreditCard',
      route: '/dashboard/pagos',
      isActive: false
    },
    {
      id: 'eventos',
      label: 'Eventos',
      icon: 'tablerStar',
      route: '/dashboard/eventos',
      isActive: false,
      badge: '2'
    },
    {
      id: 'noticias',
      label: 'Noticias',
      icon: 'tablerNews',
      route: '/dashboard/noticias',
      isActive: false
    },
    {
      id: 'pqrs',
      label: 'PQRS',
      icon: 'tablerFileText',
      route: '/dashboard/pqrs',
      isActive: false
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: 'tablerSettings',
      route: '/dashboard/configuracion',
      isActive: false
    }
  ]);

  quickActions = signal<QuickAction[]>([
    {
      id: 'nueva-reserva',
      title: 'Nueva Reserva',
      icon: 'tablerPlus',
      color: 'blue',
      route: '/dashboard/reservas/nueva'
    },
    {
      id: 'pagar',
      title: 'Pagar Ahora',
      icon: 'tablerCreditCard',
      color: 'emerald',
      route: '/dashboard/pagos/nuevo'
    },
    {
      id: 'soporte',
      title: 'Soporte',
      icon: 'tablerHelpCircle',
      color: 'purple',
      route: '/dashboard/soporte'
    }
  ]);

  constructor(
    private router: Router,
    private sidebarService: SidebarService,
    private authService: AuthService
  ) {
    this.sidebarExpanded = this.sidebarService.sidebarExpanded;
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  navigateToItem(item: NavItem): void {
    // Actualizar estado activo
    this.navItems.update((items: NavItem[]) =>
      items.map((navItem: NavItem) => ({
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
    this.authService.logout();
    // No need to navigate as the auth service already handles navigation
  }
}
