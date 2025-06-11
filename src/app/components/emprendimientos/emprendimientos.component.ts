import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { EmprendimientosService } from '../../services/emprendimientos.service';
import { Emprendimiento, FiltrosEmprendimiento } from '../../models/emprendimiento.model';

@Component({
  selector: 'app-emprendimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emprendimientos.component.html',
  styleUrls: ['./emprendimientos.component.css']
})
export class EmprendimientosComponent implements OnInit, OnDestroy {
  emprendimientos: Emprendimiento[] = [];
  emprendimientosFiltrados: Emprendimiento[] = [];
  emprendimientoSeleccionado: Emprendimiento | null = null;
  categorias: string[] = [];
  cargando = false;
  imagenActual = 0;

  // Contadores para el banner
  totalEmprendimientos = 0;
  emprendimientosActivos = 0;
  emprendimientosDestacados = 0;

  filtros: FiltrosEmprendimiento = {
    categoria: 'todas',
    busqueda: '',
    ordenarPor: 'nombre',
    soloActivos: true,
    soloDestacados: false
  };

  private destroy$ = new Subject<void>();

  constructor(private emprendimientosService: EmprendimientosService) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarEmprendimientos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarCategorias(): void {
    this.categorias = this.emprendimientosService.obtenerCategorias();
  }

  cargarEmprendimientos(): void {
    this.cargando = true;
    this.emprendimientosService.obtenerEmprendimientos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (emprendimientos) => {
          this.emprendimientos = emprendimientos;
          this.actualizarContadores();
          this.aplicarFiltros();
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error al cargar emprendimientos:', error);
          this.cargando = false;
        }
      });
  }

  aplicarFiltros(): void {
    this.emprendimientosService.obtenerEmprendimientosFiltrados(this.filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (emprendimientos) => {
          this.emprendimientosFiltrados = emprendimientos;
        }
      });
  }

  onBusquedaChange(): void {
    this.aplicarFiltros();
  }

  onCategoriaChange(): void {
    this.aplicarFiltros();
  }

  onOrdenarChange(): void {
    this.aplicarFiltros();
  }

  toggleSoloDestacados(): void {
    this.filtros.soloDestacados = !this.filtros.soloDestacados;
    this.aplicarFiltros();
  }

  limpiarFiltros(): void {
    this.filtros = {
      categoria: 'todas',
      busqueda: '',
      ordenarPor: 'nombre',
      soloActivos: true,
      soloDestacados: false
    };
    this.aplicarFiltros();
  }

  verDetalles(emprendimiento: Emprendimiento): void {
    this.emprendimientoSeleccionado = emprendimiento;
    this.imagenActual = 0;
  }

  cerrarDetalles(): void {
    this.emprendimientoSeleccionado = null;
    this.imagenActual = 0;
  }

  imagenAnterior(): void {
    if (this.emprendimientoSeleccionado && this.emprendimientoSeleccionado.imagenes.length > 1) {
      this.imagenActual = this.imagenActual > 0 ? this.imagenActual - 1 : this.emprendimientoSeleccionado.imagenes.length - 1;
    }
  }

  imagenSiguiente(): void {
    if (this.emprendimientoSeleccionado && this.emprendimientoSeleccionado.imagenes.length > 1) {
      this.imagenActual = this.imagenActual < this.emprendimientoSeleccionado.imagenes.length - 1 ? this.imagenActual + 1 : 0;
    }
  }

  contactarEmprendimiento(emprendimiento: Emprendimiento, metodo: 'telefono' | 'email' | 'whatsapp'): void {
    const contacto = emprendimiento.contacto;

    switch (metodo) {
      case 'telefono':
        if (contacto.telefono) {
          window.open(`tel:${contacto.telefono}`, '_self');
        }
        break;
      case 'email':
        if (contacto.email) {
          window.open(`mailto:${contacto.email}?subject=Consulta sobre ${emprendimiento.nombre}`, '_self');
        }
        break;
      case 'whatsapp':
        if (contacto.whatsapp) {
          const mensaje = `Hola, estoy interesado en ${emprendimiento.nombre}`;
          const numeroLimpio = contacto.whatsapp.replace(/\D/g, '');
          window.open(`https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
        }
        break;
    }
  }

  obtenerEstrellas(rating: number | undefined): string[] {
    if (!rating) return [];
    const estrellas = [];
    const ratingEntero = Math.floor(rating);
    const tieneMediaEstrella = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < ratingEntero) {
        estrellas.push('full');
      } else if (i === ratingEntero && tieneMediaEstrella) {
        estrellas.push('half');
      } else {
        estrellas.push('empty');
      }
    }
    return estrellas;
  }

  formatearPrecio(precio: { min: number; max: number; moneda: string } | undefined): string {
    if (!precio) return 'Precio a consultar';

    const formatoMoneda = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: precio.moneda
    });

    if (precio.min === precio.max) {
      return formatoMoneda.format(precio.min);
    }

    return `${formatoMoneda.format(precio.min)} - ${formatoMoneda.format(precio.max)}`;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/emprendimiento-default.jpg';
    }
  }

  private actualizarContadores(): void {
    this.totalEmprendimientos = this.emprendimientos.length;
    this.emprendimientosActivos = this.emprendimientos.filter(emp => emp.activo).length;
    this.emprendimientosDestacados = this.emprendimientos.filter(emp => emp.destacado).length;
  }
}
