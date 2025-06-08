
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

  // Enlaces rápidos
  enlaces = [
    {
      titulo: 'Manual de Convivencia',
      icono: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      ruta: '/manual-convivencia'
    },
    {
      titulo: 'Normas de Propiedad Horizontal',
      icono: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
      ruta: '/normas-propiedad'
    },
    {
      titulo: 'Realizar Pagos',
      icono: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z',
      ruta: '/pagos'
    },
    {
      titulo: 'Noticias y Anuncios',
      icono: 'M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 711.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46',
      ruta: '/noticias'
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
}
