import { Component, signal, OnInit, HostListener } from '@angular/core';
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
export class SidebarComponent implements OnInit {

  // Use the shared service for sidebar state
  sidebarExpanded;

  navItems = signal<NavItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'tablerHome',
      route: '/welcome',
      isActive: true
    },
    {
      id: 'reservas',
      label: 'Reservas',
      icon: 'tablerCalendar',
      route: '/reservas',
      isActive: false,
      badge: '3'
    },
    {
      id: 'pagos',
      label: 'Pagos',
      icon: 'tablerCreditCard',
      route: '/pagos',
      isActive: false
    },
    {
      id: 'eventos',
      label: 'Eventos',
      icon: 'tablerStar',
      route: '/eventos',
      isActive: false,
      badge: '2'
    },
    {
      id: 'noticias',
      label: 'Noticias',
      icon: 'tablerNews',
      route: '/noticias',
      isActive: false
    },
    {
      id: 'pqrs',
      label: 'PQRS',
      icon: 'tablerFileText',
      route: '/pqrs',
      isActive: false
    },
    {
      id: 'configuracion',
      label: 'Configuración',
      icon: 'tablerSettings',
      route: '/configuracion',
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

  ngOnInit(): void {
    // Asegurar estado inicial correcto basado en tamaño de pantalla
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 1024;
      if (!isDesktop && this.sidebarExpanded()) {
        // En móviles, cerrar sidebar automáticamente si está abierto
        this.sidebarService.closeSidebarOnMobile();
      }
    }
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

    // Cerrar sidebar en móviles después de navegar
    this.sidebarService.closeSidebarOnMobile();

    this.router.navigate([item.route]);
  }

  navigateToAction(route: string): void {
    // Cerrar sidebar en móviles después de navegar
    this.sidebarService.closeSidebarOnMobile();
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
