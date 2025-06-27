
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { ToastService } from '../../services/toast.service';
import { Reserva, ZonaComun } from '../../models/reserva.model';
import { Subject, takeUntil } from 'rxjs';

interface ReservaConZona extends Reserva {
  zonaInfo?: ZonaComun;
  fechaFormateada?: string;
  horaFormateada?: string;
}

@Component({
  selector: 'app-confirmacion-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirmacion-reservas.component.html',
  styleUrls: ['./confirmacion-reservas.component.css']
})
export class ConfirmacionReservasComponent implements OnInit, OnDestroy {

  private destroy$$ = new Subject<void>();
  isBrowser: boolean;

  // Estado del componente
  cargando = true;
  procesandoReserva = false;
  reservaSeleccionada: ReservaConZona | null = null;
  mostrarModalDetalle = false;
  mostrarModalConfirmacion = false;
  mostrarModalRechazo = false;

  // Datos
  reservasPendientes: ReservaConZona[] = [];
  reservasConfirmadas: ReservaConZona[] = [];
  reservasCanceladas: ReservaConZona[] = [];
  zonasComunes: ZonaComun[] = [];

  // Filtros y búsqueda
  filtroEstado = 'pendientes';
  filtroZona = '';
  filtroFecha = '';
  terminoBusqueda = '';

  // Estadísticas
  estadisticas = {
    totalPendientes: 0,
    totalConfirmadas: 0,
    totalCanceladas: 0,
    ingresosMes: 0
  };

  // Formulario de rechazo
  formularioRechazo = {
    motivo: '',
    observaciones: ''
  };

  motivosRechazo = [
    'Zona no disponible',
    'Horario ocupado',
    'Mantenimiento programado',
    'Documentación incompleta',
    'Incumplimiento de normas',
    'Otro'
  ];

  get reservasFiltradas(): ReservaConZona[] {
    let reservas: ReservaConZona[] = [];

    switch (this.filtroEstado) {
      case 'pendientes':
        reservas = this.reservasPendientes;
        break;
      case 'confirmadas':
        reservas = this.reservasConfirmadas;
        break;
      case 'canceladas':
        reservas = this.reservasCanceladas;
        break;
      default:
        reservas = [...this.reservasPendientes, ...this.reservasConfirmadas, ...this.reservasCanceladas];
    }

    // Filtrar por zona
    if (this.filtroZona) {
      reservas = reservas.filter(r => r.zonaId.toString() === this.filtroZona);
    }

    // Filtrar por fecha
    if (this.filtroFecha) {
      reservas = reservas.filter(r => r.fecha === this.filtroFecha);
    }

    // Filtrar por término de búsqueda
    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      reservas = reservas.filter(r =>
        r.usuario.toLowerCase().includes(termino) ||
        r.zona.toLowerCase().includes(termino) ||
        r.observaciones?.toLowerCase().includes(termino)
      );
    }

    return reservas.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private reservasService: ReservasService,
    private toastService: ToastService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.zonasComunes = this.reservasService.getZonasComunes();

    this.reservasService.getReservas()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (reservas) => {
          this.procesarReservas(reservas);
          this.calcularEstadisticas();
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar reservas:', error);
          this.cargando = false;
          this.toastService.error('Error al cargar las reservas', 'Error');
        }
      });
  }

  private procesarReservas(reservas: Reserva[]): void {
    const reservasConInfo = reservas.map(reserva => this.enriquecerReserva(reserva));

    this.reservasPendientes = reservasConInfo.filter(r => r.estado === 'pendiente');
    this.reservasConfirmadas = reservasConInfo.filter(r => r.estado === 'confirmada');
    this.reservasCanceladas = reservasConInfo.filter(r => r.estado === 'cancelada');
  }

  private enriquecerReserva(reserva: Reserva): ReservaConZona {
    const zonaInfo = this.zonasComunes.find(z => z.id === reserva.zonaId);
    const fecha = new Date(reserva.fecha + 'T00:00:00');

    return {
      ...reserva,
      zonaInfo,
      fechaFormateada: fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      horaFormateada: this.extraerHoraDeHorario(reserva.horario)
    };
  }

  private extraerHoraDeHorario(horario: string): string {
    const match = horario.match(/\(([^)]+)\)/);
    return match ? match[1] : horario;
  }

  private calcularEstadisticas(): void {
    this.estadisticas = {
      totalPendientes: this.reservasPendientes.length,
      totalConfirmadas: this.reservasConfirmadas.length,
      totalCanceladas: this.reservasCanceladas.length,
      ingresosMes: this.reservasConfirmadas.reduce((total, r) => total + r.costoTotal, 0)
    };
  }

  // Métodos de gestión de reservas
  verDetalle(reserva: ReservaConZona): void {
    this.reservaSeleccionada = reserva;
    this.mostrarModalDetalle = true;
  }

  abrirModalConfirmacion(reserva: ReservaConZona): void {
    this.reservaSeleccionada = reserva;
    this.mostrarModalConfirmacion = true;
  }

  abrirModalRechazo(reserva: ReservaConZona): void {
    this.reservaSeleccionada = reserva;
    this.formularioRechazo = { motivo: '', observaciones: '' };
    this.mostrarModalRechazo = true;
  }

  confirmarReserva(): void {
    if (!this.reservaSeleccionada) return;

    this.procesandoReserva = true;

    this.reservasService.confirmarReserva(this.reservaSeleccionada.id)
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (resultado) => {
          if (resultado) {
            this.toastService.success('Reserva confirmada exitosamente', '¡Confirmada!');
            this.cerrarModales();
            this.cargarDatos();
          } else {
            this.toastService.error('No se pudo confirmar la reserva', 'Error');
          }
          this.procesandoReserva = false;
        },
        error: (error) => {
          console.error('Error al confirmar reserva:', error);
          this.toastService.error('Error al confirmar la reserva', 'Error');
          this.procesandoReserva = false;
        }
      });
  }

  rechazarReserva(): void {
    if (!this.reservaSeleccionada || !this.formularioRechazo.motivo) {
      this.toastService.error('Por favor selecciona un motivo de rechazo', 'Error');
      return;
    }

    this.procesandoReserva = true;

    const motivoCompleto = this.formularioRechazo.motivo === 'Otro'
      ? this.formularioRechazo.observaciones
      : this.formularioRechazo.motivo;

    this.reservasService.rechazarReserva(this.reservaSeleccionada.id, motivoCompleto)
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (resultado) => {
          if (resultado) {
            this.toastService.success('Reserva rechazada exitosamente', 'Rechazada');
            this.cerrarModales();
            this.cargarDatos();
          } else {
            this.toastService.error('No se pudo rechazar la reserva', 'Error');
          }
          this.procesandoReserva = false;
        },
        error: (error) => {
          console.error('Error al rechazar reserva:', error);
          this.toastService.error('Error al rechazar la reserva', 'Error');
          this.procesandoReserva = false;
        }
      });
  }

  // Métodos auxiliares
  cerrarModales(): void {
    this.mostrarModalDetalle = false;
    this.mostrarModalConfirmacion = false;
    this.mostrarModalRechazo = false;
    this.reservaSeleccionada = null;
    this.formularioRechazo = { motivo: '', observaciones: '' };
  }

  limpiarFiltros(): void {
    this.filtroZona = '';
    this.filtroFecha = '';
    this.terminoBusqueda = '';
  }

  exportarReservas(): void {
    // Implementar exportación a CSV/Excel
    this.toastService.info('Función de exportar en desarrollo', 'Info');
  }

  obtenerColorEstado(estado: string): string {
    const colores = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'confirmada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return colores[estado as keyof typeof colores] || 'bg-gray-100 text-gray-800';
  }

  obtenerIconoEstado(estado: string): string {
    const iconos = {
      'pendiente': '⏳',
      'confirmada': '✅',
      'cancelada': '❌'
    };
    return iconos[estado as keyof typeof iconos] || '📋';
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  obtenerColorZona(zonaId: number): string {
    const zona = this.zonasComunes.find(z => z.id === zonaId);
    if (zona) {
      const colores: { [key: string]: string } = {
        'from-purple-500 to-pink-500': 'bg-purple-100 text-purple-800',
        'from-blue-500 to-cyan-500': 'bg-blue-100 text-blue-800',
        'from-green-500 to-emerald-500': 'bg-green-100 text-green-800',
        'from-orange-500 to-red-500': 'bg-orange-100 text-orange-800',
        'from-indigo-500 to-purple-500': 'bg-indigo-100 text-indigo-800',
        'from-red-500 to-pink-500': 'bg-red-100 text-red-800'
      };
      return colores[zona.color] || 'bg-gray-100 text-gray-800';
    }
    return 'bg-gray-100 text-gray-800';
  }

  trackByReserva(index: number, reserva: ReservaConZona): number {
    return reserva.id;
  }
}
