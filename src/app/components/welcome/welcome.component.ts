import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.model';
import { ToastrService } from 'ngx-toastr';
import { catchError, timeout, of, finalize } from 'rxjs';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
  user: User | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';
  showSidebar: boolean = false; // For mobile sidebar toggle

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
    private toastr: ToastrService,
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

  loadUserData(): void {
    if (!this.authService.isLoggedIn()) {
      this.errorMessage = 'Debe iniciar sesión para acceder a esta página.';
      this.toastr.warning(this.errorMessage, 'Acceso Restringido');
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

    this.authService.getCurrentUser()
      .pipe(
        timeout(10000),
        catchError(error => {
          this.isLoading = false;

          if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
            this.toastr.warning('Sesión expirada', 'Acceso Restringido');
            this.authService.logout();
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else if (error.name === 'TimeoutError') {
            this.errorMessage = 'La petición ha tardado demasiado. Verifique su conexión a internet.';
            this.toastr.error(this.errorMessage, 'Timeout');
          } else {
            this.errorMessage = 'Error al cargar los datos del usuario. Por favor, inténtelo de nuevo.';
            this.toastr.error(this.errorMessage, 'Error');
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
          } else {
            if (!this.errorMessage) {
              this.errorMessage = 'Error al cargar los datos del usuario. Por favor, inténtelo de nuevo.';
              this.toastr.error(this.errorMessage, 'Error');
            }
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Error al cargar los datos del usuario. Por favor, inténtelo de nuevo.';
          this.toastr.error(this.errorMessage, 'Error');
          this.cdr.detectChanges();
        }
      });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.toastr.success('Sesión cerrada correctamente', 'Hasta pronto');
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}
