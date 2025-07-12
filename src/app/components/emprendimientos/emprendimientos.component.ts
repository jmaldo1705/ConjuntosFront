import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Emprendimiento, FiltrosEmprendimiento } from '../../models/emprendimiento.model';
import { EmprendimientosService } from '../../services/emprendimientos.service';
import { ToastService } from '../../services/toast.service';
import { DatosEmprendimientos } from '../../resolvers/emprendimientos.resolver';

@Component({
  selector: 'app-emprendimientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emprendimientos.component.html',
  styleUrls: ['./emprendimientos.component.css']
})
export class EmprendimientosComponent implements OnInit, OnDestroy {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private busquedaSubject = new Subject<string>();

  // Datos principales
  emprendimientos: Emprendimiento[] = [];
  emprendimientosFiltrados: Emprendimiento[] = [];
  categorias: string[] = [];
  emprendimientoSeleccionado: Emprendimiento | null = null;
  imagenActual = 0;

  // Estado de carga
  cargando = false;
  error: string | null = null;
  datosInicializados = false;

  // Filtros
  filtros: FiltrosEmprendimiento = {
    categoria: 'todas',
    busqueda: '',
    ordenarPor: 'nombre',
    soloActivos: true,
    soloDestacados: false
  };

  // Contadores para el banner
  totalEmprendimientos = 0;
  emprendimientosActivos = 0;
  emprendimientosDestacados = 0;

  constructor(
    private emprendimientosService: EmprendimientosService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.inicializarBusqueda();
    this.cargarDatosDesdeResolver();
    this.suscribirACambiosDelServicio();
  }

  ngOnDestroy(): void {
    this.busquedaSubject.complete();
  }

  /**
   * Cargar datos que fueron pre-cargados por el resolver
   */
  private cargarDatosDesdeResolver(): void {
    const datos = this.route.snapshot.data['datos'] as DatosEmprendimientos;

    if (datos) {
      if (datos.error) {
        this.error = datos.error;
        this.toastService.error(datos.error, 'Error de Carga');
      } else {
        // Datos de emprendimientos
        this.emprendimientos = datos.emprendimientos.emprendimientos;
        this.totalEmprendimientos = datos.emprendimientos.total;

        // Categorías
        this.categorias = datos.categorias;

        // Aplicar filtros iniciales y actualizar estadísticas
        this.aplicarFiltrosLocales();
        this.actualizarContadores();
        this.datosInicializados = true;
      }
    }
  }

  /**
   * Suscribirse a cambios del servicio
   */
  private suscribirACambiosDelServicio(): void {
    this.emprendimientosService.emprendimientos$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(emprendimientos => {
      if (this.datosInicializados && emprendimientos.length > 0) {
        this.emprendimientos = emprendimientos;
        this.aplicarFiltrosLocales();
        this.actualizarContadores();
      }
    });

    this.emprendimientosService.categorias$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(categorias => {
      if (this.datosInicializados && categorias.length > 0) {
        this.categorias = categorias;
      }
    });

    this.emprendimientosService.cargando$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(cargando => {
      this.cargando = cargando;
    });
  }

  /**
   * Inicializar búsqueda con debounce
   */
  private inicializarBusqueda(): void {
    this.busquedaSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(termino => {
      this.filtros.busqueda = termino;
      this.aplicarFiltros();
    });
  }

  /**
   * Aplicar filtros locales
   */
  private aplicarFiltrosLocales(): void {
    let resultado = [...this.emprendimientos];

    if (this.filtros.soloActivos) {
      resultado = resultado.filter(emp => emp.activo);
    }

    if (this.filtros.soloDestacados) {
      resultado = resultado.filter(emp => emp.destacado);
    }

    if (this.filtros.categoria && this.filtros.categoria !== 'todas') {
      resultado = resultado.filter(emp =>
        emp.categoria.toLowerCase() === this.filtros.categoria!.toLowerCase()
      );
    }

    if (this.filtros.busqueda) {
      const busqueda = this.filtros.busqueda.toLowerCase();
      resultado = resultado.filter(emp =>
        emp.nombre.toLowerCase().includes(busqueda) ||
        emp.descripcion.toLowerCase().includes(busqueda) ||
        emp.servicios.some(servicio => servicio.toLowerCase().includes(busqueda)) ||
        emp.categoria.toLowerCase().includes(busqueda)
      );
    }

    if (this.filtros.ordenarPor) {
      resultado.sort((a, b) => {
        switch (this.filtros.ordenarPor) {
          case 'nombre':
            return a.nombre.localeCompare(b.nombre);
          case 'fecha':
            return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
    }

    this.emprendimientosFiltrados = resultado;
  }

  /**
   * Aplicar filtros
   */
  aplicarFiltros(): void {
    if (this.emprendimientos.length > 0) {
      this.aplicarFiltrosLocales();
    } else {
      this.aplicarFiltrosBackend();
    }
  }

  /**
   * Aplicar filtros usando el backend
   */
  private aplicarFiltrosBackend(): void {
    this.cargando = true;
    this.emprendimientosService.obtenerEmprendimientos(this.filtros).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.emprendimientosFiltrados = response.emprendimientos;
        this.cargando = false;
      },
      error: (error) => {
        this.error = 'Error al aplicar filtros. Por favor, intenta nuevamente.';
        this.cargando = false;
        this.toastService.error('Error al aplicar filtros', 'Error');
      }
    });
  }

  /**
   * Actualizar contadores
   */
  private actualizarContadores(): void {
    this.emprendimientosActivos = this.emprendimientos.filter(emp => emp.activo).length;
    this.emprendimientosDestacados = this.emprendimientos.filter(emp => emp.destacado).length;
  }

  // Métodos de eventos del template
  onBusquedaChange(): void {
    this.busquedaSubject.next(this.filtros.busqueda || '');
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

  /**
   * Contactar emprendimiento
   */
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

  /**
   * Obtener estrellas para rating
   */
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

  /**
   * Formatear precio
   */
  formatearPrecio(precio: { min: number; max: number; moneda: string } | undefined): string {
    if (!precio) return 'Precio a consultar';

    const formatoMoneda = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: precio.moneda,
      minimumFractionDigits: 0
    });

    if (precio.min === precio.max) {
      return formatoMoneda.format(precio.min);
    }

    return `${formatoMoneda.format(precio.min)} - ${formatoMoneda.format(precio.max)}`;
  }

  /**
   * Manejar error de imagen
   */
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = '/assets/images/logo.png';
    }
  }
}
