import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReservasService } from '../../services/reservas.service';
import { ZonaComun, Reserva, DiaCalendario, ReservaCalendario } from '../../models/reserva.model';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Variables de estado
  mesActual = new Date();
  diaSeleccionado: DiaCalendario | null = null;
  zonasComunes: ZonaComun[] = [];
  reservas: Reserva[] = [];
  diasMes: DiaCalendario[] = [];
  reservasDelDiaSeleccionado: Reserva[] = [];

  // Variables de UI
  cargando = true;
  mostrarDetalleReserva = false;
  reservaSeleccionada: Reserva | null = null;

  // Configuración de calendario
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  mesesNombres = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.generarCalendario();
    this.seleccionarDiaActual();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarDatos(): void {
    this.zonasComunes = this.reservasService.getZonasComunes();

    this.reservasService.getReservas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reservas) => {
          this.reservas = reservas;
          this.generarCalendario();
          this.actualizarReservasDelDia();
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar reservas:', error);
          this.cargando = false;
        }
      });
  }

  generarCalendario(): void {
    const año = this.mesActual.getFullYear();
    const mes = this.mesActual.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const primerDiaSemana = primerDia.getDay();
    const hoy = new Date();

    this.diasMes = [];

    // Días vacíos al inicio
    for (let i = 0; i < primerDiaSemana; i++) {
      this.diasMes.push({
        numero: '',
        reservas: [],
        seleccionado: false,
        vacio: true,
        esHoy: false,
        esPasado: false
      });
    }

    // Días del mes
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaDia = new Date(año, mes, dia);
      const fechaString = fechaDia.toISOString().split('T')[0];
      const reservasDelDia = this.getReservasCalendario(fechaString);
      const esHoy = fechaDia.toDateString() === hoy.toDateString();
      const esPasado = fechaDia < hoy && !esHoy;

      this.diasMes.push({
        numero: dia,
        fecha: fechaDia,
        reservas: reservasDelDia,
        seleccionado: false,
        vacio: false,
        esHoy: esHoy,
        esPasado: esPasado
      });
    }
  }

  private getReservasCalendario(fecha: string): ReservaCalendario[] {
    const reservasDelDia = this.reservas.filter(r => r.fecha === fecha && r.estado !== 'cancelada');

    return reservasDelDia.map(reserva => {
      const zona = this.zonasComunes.find(z => z.id === reserva.zonaId);
      return {
        zona: reserva.zona,
        horario: reserva.horario,
        color: zona?.color || 'from-gray-400 to-gray-500',
        usuario: reserva.usuario,
        estado: reserva.estado
      };
    });
  }

  seleccionarDia(dia: DiaCalendario): void {
    if (dia.vacio) return;

    // Limpiar selección anterior
    this.diasMes.forEach(d => d.seleccionado = false);

    // Seleccionar nuevo día
    dia.seleccionado = true;
    this.diaSeleccionado = dia;
    this.actualizarReservasDelDia();
  }

  private seleccionarDiaActual(): void {
    const hoy = new Date();
    const diaActual = this.diasMes.find(d =>
      d.fecha && d.fecha.toDateString() === hoy.toDateString()
    );

    if (diaActual) {
      this.seleccionarDia(diaActual);
    } else if (this.diasMes.length > 7) {
      // Seleccionar el primer día disponible si no está el día actual
      const primerDiaDisponible = this.diasMes.find(d => !d.vacio);
      if (primerDiaDisponible) {
        this.seleccionarDia(primerDiaDisponible);
      }
    }
  }

  private actualizarReservasDelDia(): void {
    if (this.diaSeleccionado?.fecha) {
      const fechaSeleccionada = this.diaSeleccionado.fecha.toISOString().split('T')[0];
      this.reservasDelDiaSeleccionado = this.reservas.filter(r =>
        r.fecha === fechaSeleccionada && r.estado !== 'cancelada'
      );
    } else {
      this.reservasDelDiaSeleccionado = [];
    }
  }

  cambiarMes(direccion: number): void {
    this.mesActual = new Date(
      this.mesActual.getFullYear(),
      this.mesActual.getMonth() + direccion,
      1
    );
    this.generarCalendario();
    this.diaSeleccionado = null;
    this.reservasDelDiaSeleccionado = [];
  }

  getDiaClasses(dia: DiaCalendario): string {
    if (dia.vacio) return 'invisible';

    let clases = 'relative cursor-pointer transition-all duration-300 rounded-xl p-3 ';

    if (dia.seleccionado) {
      clases += 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105 ';
    } else if (dia.esHoy) {
      clases += 'bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 border-2 border-indigo-300 ';
    } else if (dia.esPasado) {
      clases += 'bg-gray-50 text-gray-400 ';
    } else if (dia.reservas.length > 0) {
      clases += 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border border-green-200 hover:shadow-md ';
    } else {
      clases += 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md ';
    }

    return clases;
  }

  getZonaIcon(zonaId: number): string {
    const zona = this.zonasComunes.find(z => z.id === zonaId);
    return zona?.icono || '📍';
  }

  getZonaColor(zonaId: number): string {
    const zona = this.zonasComunes.find(z => z.id === zonaId);
    return zona?.color || 'from-gray-400 to-gray-500';
  }

  verDetalleReserva(reserva: Reserva): void {
    this.reservaSeleccionada = reserva;
    this.mostrarDetalleReserva = true;
  }

  cerrarDetalleReserva(): void {
    this.mostrarDetalleReserva = false;
    this.reservaSeleccionada = null;
  }

  cancelarReserva(reserva: Reserva): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservasService.cancelarReserva(reserva.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.cerrarDetalleReserva();
              console.log('Reserva cancelada exitosamente');
            }
          },
          error: (error) => {
            console.error('Error al cancelar reserva:', error);
          }
        });
    }
  }

  get mesActualNombre(): string {
    return `${this.mesesNombres[this.mesActual.getMonth()]} ${this.mesActual.getFullYear()}`;
  }

  get fechaSeleccionadaFormateada(): string {
    if (!this.diaSeleccionado?.fecha) return '';

    const fecha = this.diaSeleccionado.fecha;
    const dia = fecha.getDate();
    const mes = this.mesesNombres[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${dia} de ${mes} de ${año}`;
  }

  // Métodos auxiliares para el template
  trackByReserva(index: number, reserva: Reserva): number {
    return reserva.id;
  }

  trackByDia(index: number, dia: DiaCalendario): string {
    return `${dia.numero}-${index}`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/zona-default.jpg';
    }
  }

  // Getters para verificaciones seguras en el template
  get reservaSeleccionadaSegura(): Reserva {
    return this.reservaSeleccionada!;
  }

  get diaSeleccionadoSeguro(): DiaCalendario {
    return this.diaSeleccionado!;
  }
}
