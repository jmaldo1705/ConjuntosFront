import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';
import { ToastService } from '../../services/toast.service';
import { catchError, timeout, of, finalize } from 'rxjs';

// Interfaz para los items del menú
export interface MenuItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  route?: string;
  action?: () => void;
  colorFrom?: string;
  colorTo?: string;
  isNew?: boolean;
  isDisabled?: boolean;
  notification?: number;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
  user: User | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  showSidebar: boolean = false;
  showUserMenu: boolean = false; // Nueva propiedad para el menú de usuario

  // Configuración del menú dashboard
  quickActionsMenuItems: MenuItem[] = [
    {
      id: 'pagar',
      title: 'Pagar',
      description: 'Administración',
      icon: '💳',
      route: '/pagos',
      colorFrom: 'from-indigo-500',
      colorTo: 'to-purple-600',
      isNew: false
    },
    {
      id: 'reservar',
      title: 'Reservar',
      description: 'Espacios',
      icon: '📅',
      route: '/reservas',
      colorFrom: 'from-purple-500',
      colorTo: 'to-indigo-600',
      notification: 2
    },
    {
      id: 'pqrs',
      title: 'PQRS',
      description: 'Reportar',
      icon: '📝',
      route: '/pqrs',
      colorFrom: 'from-indigo-500',
      colorTo: 'to-purple-600'
    },
    {
      id: 'chat',
      title: 'Chat',
      description: 'Vecinos',
      icon: '💬',
      action: () => this.openChat(),
      colorFrom: 'from-purple-500',
      colorTo: 'to-indigo-600',
      isNew: true
    },
    {
      id: 'estados',
      title: 'Estados',
      description: 'de Cuenta',
      icon: '📊',
      route: '/estados-cuenta',
      colorFrom: 'from-indigo-500',
      colorTo: 'to-purple-600'
    },
    {
      id: 'directorio',
      title: 'Directorio',
      description: 'Contactos',
      icon: '📞',
      route: '/directorio',
      colorFrom: 'from-purple-500',
      colorTo: 'to-indigo-600'
    }
  ];

  // Anuncios importantes
  anuncios = [
    {
      id: 1,
      titulo: 'Mantenimiento de la Piscina',
      fecha: '5 de junio, 2025',
      resumen: 'Se realizará mantenimiento de la piscina del conjunto. Estará cerrada durante dos días.',
      imagen: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      categoria: 'Mantenimiento'
    },
    {
      id: 2,
      titulo: 'Asamblea General Ordinaria',
      fecha: '1 de junio, 2025',
      resumen: 'Convocatoria a la Asamblea General Ordinaria de Copropietarios.',
      imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      categoria: 'Administración'
    },
    {
      id: 3,
      titulo: 'Nuevo Sistema de Seguridad',
      fecha: '28 de mayo, 2025',
      resumen: 'Implementación de un nuevo sistema de seguridad en el conjunto.',
      imagen: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      categoria: 'Seguridad'
    }
  ];

  // Próximos eventos
  eventos = [
    {
      id: 1,
      titulo: 'Jornada de Vacunación para Mascotas',
      fecha: '12 de junio, 2025',
      hora: '9:00 AM - 3:00 PM',
      lugar: 'Zona verde junto al salón comunal',
      descripcion: 'Jornada de vacunación gratuita para perros y gatos. No olvide traer el carné de vacunación de su mascota.'
    },
    {
      id: 2,
      titulo: 'Clase de Yoga al Aire Libre',
      fecha: '15 de junio, 2025',
      hora: '8:00 AM - 9:00 AM',
      lugar: 'Parque central del conjunto',
      descripcion: 'Clase gratuita para todos los residentes. Traer su propia colchoneta y ropa cómoda.'
    },
    {
      id: 3,
      titulo: 'Reunión del Comité de Convivencia',
      fecha: '18 de junio, 2025',
      hora: '6:00 PM',
      lugar: 'Salón comunal',
      descripcion: 'Reunión mensual para tratar temas de convivencia en el conjunto.'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Función para obtener las iniciales del usuario
  getUserInitials(): string {
    if (!this.user?.fullName) return 'U';

    const names = this.user.fullName.split(' ');
    if (names.length >= 2) {
      return names[0].charAt(0) + names[1].charAt(0);
    }
    return names[0].charAt(0);
  }

  // Función para obtener el primer nombre del usuario
  getUserFirstName(): string {
    if (!this.user?.fullName) return 'Usuario';

    const names = this.user.fullName.split(' ');
    return names[0];
  }

  // Función para obtener el nombre completo del usuario
  getUserFullName(): string {
    return this.user?.fullName || 'Usuario';
  }

  // Función para obtener el email del usuario
  getUserEmail(): string {
    return this.user?.email || '';
  }

  // Función para obtener el número de apartamento del usuario
  getUserApartmentNumber(): string {
    return this.user?.apartmentNumber || '';
  }

  // Métodos para calcular notificaciones
  getNewNotificationsCount(): number {
    return this.quickActionsMenuItems.filter(item => item.notification && item.notification > 0).length;
  }

  getImportantNotificationsCount(): number {
    return this.quickActionsMenuItems.filter(item => item.isNew).length;
  }

  // Método para obtener el total de acciones disponibles
  getTotalActionsCount(): number {
    return this.quickActionsMenuItems.length;
  }

  // Método para obtener el total de anuncios
  getTotalAnunciosCount(): number {
    return this.anuncios.length;
  }

  // Método para obtener el total de eventos
  getTotalEventosCount(): number {
    return this.eventos.length;
  }

  // Método para obtener el primer elemento de la fecha (día)
  getEventDay(fecha: string): string {
    return fecha.split(' ')[0];
  }

  // Nuevos métodos para el menú de usuario
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  openUserSettings(): void {
    this.showUserMenu = false;
    this.toastService.info('Redirigiendo a configuración de usuario');
    // Aquí puedes agregar la navegación a la página de configuración
    // this.router.navigate(['/configuracion']);
  }

  openProfile(): void {
    this.showUserMenu = false;
    this.toastService.info('Redirigiendo a perfil de usuario');
    // Aquí puedes agregar la navegación a la página de perfil
    // this.router.navigate(['/perfil']);
  }

  loadUserData(): void {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Debe iniciar sesión para acceder a esta página.';
      this.toastService.warning('Debe iniciar sesión para acceder a esta página.');
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.user = null;

    // Primero intentar obtener usuario del storage local
    const localUser = this.authService.getCurrentUserSync();
    if (localUser) {
      this.user = localUser;
      this.isLoading = false;
      this.cdr.detectChanges();
      return;
    }

    // Si no hay usuario local, intentar obtener del servidor
    this.authService.getCurrentUser()
      .pipe(
        timeout(10000),
        catchError(error => {
          console.error('Error en getCurrentUser:', error);
          this.isLoading = false;

          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
            this.toastService.warning('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
            this.authService.logout();
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else if (error.name === 'TimeoutError') {
            this.errorMessage = 'La petición ha tardado demasiado. Verifique su conexión a internet.';
            this.toastService.error(this.errorMessage);
          } else if (error.status === 0) {
            this.errorMessage = 'No se puede conectar con el servidor. Verifique que esté funcionando.';
            this.toastService.error(this.errorMessage);
          } else {
            this.errorMessage = `Error al cargar los datos del usuario: ${error.message || 'Error desconocido'}`;
            this.toastService.error(this.errorMessage);
          }

          this.cdr.detectChanges();
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.user = user;
            // Guardar en storage para futuras consultas
            this.authService.saveUserData(this.authService.getToken()!, user);
          }
          this.cdr.detectChanges();
        }
      });
  }

  logout(): void {
    this.showUserMenu = false;
    this.authService.logout();
    this.router.navigate(['/']);
    this.toastService.success('Sesión cerrada correctamente. ¡Hasta pronto!');
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToApartments(): void {
    this.router.navigate(['/apartamentos']);
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  onMenuItemClick(item: MenuItem): void {
    console.log('Menu item clicked:', item);

    if (item.isDisabled) return;

    if (item.action) {
      item.action();
    } else if (item.route) {
      this.router.navigate([item.route]);
    }

    this.toastService.info(`Navegando a ${item.title}`);

    // Cerrar sidebar en móvil después de hacer clic
    if (window.innerWidth < 1024) {
      this.showSidebar = false;
    }
  }

  openChat(): void {
    this.toastService.info('Funcionalidad de chat próximamente');
  }
}
