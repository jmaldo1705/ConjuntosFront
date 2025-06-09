
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Apartamento {
  id: number;
  tipo: 'venta' | 'arriendo';
  titulo: string;
  precio: number;
  habitaciones: number;
  banos: number;
  area: number;
  piso: number;
  torre: string;
  apartamento: string;
  descripcion: string;
  caracteristicas: string[];
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
}

@Component({
  selector: 'app-apartamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apartamentos.component.html',
  styleUrl: './apartamentos.component.css'
})
export class ApartamentosComponent {
  // Apartamentos disponibles en Wakari
  apartamentos: Apartamento[] = [
    {
      id: 1,
      tipo: 'venta',
      titulo: 'Apartamento 3 Habitaciones - Torre A',
      precio: 280000000,
      habitaciones: 3,
      banos: 2,
      area: 85,
      piso: 4,
      torre: 'A',
      apartamento: '401',
      descripcion: 'Hermoso apartamento con vista a las zonas verdes del conjunto. Cocina integral, closets empotrados y amplio balcón.',
      caracteristicas: [
        'Cocina integral con mesón en granito',
        'Closets empotrados en habitaciones',
        'Balcón con vista a zonas verdes',
        'Pisos en cerámica de primera calidad',
        'Baño auxiliar con ducha',
        'Baño principal con tina',
        'Zona de ropas independiente',
        'Conexiones para internet y TV'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      disponible: true,
      destacado: true
    },
    {
      id: 2,
      tipo: 'arriendo',
      titulo: 'Apartamento 2 Habitaciones - Torre B',
      precio: 1200000,
      habitaciones: 2,
      banos: 2,
      area: 68,
      piso: 2,
      torre: 'B',
      apartamento: '203',
      descripcion: 'Cómodo apartamento ideal para pareja o familia pequeña. Ubicado en piso bajo con fácil acceso.',
      caracteristicas: [
        'Sala-comedor amplia',
        'Cocina integral',
        'Habitación principal con closet',
        'Habitación auxiliar',
        'Dos baños completos',
        'Balcón con tendedero',
        'Parqueadero asignado',
        'Cuarto útil'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      disponible: true,
      destacado: false
    },
    {
      id: 3,
      tipo: 'venta',
      titulo: 'Apartamento 3 Habitaciones - Torre C',
      precio: 295000000,
      habitaciones: 3,
      banos: 2,
      area: 90,
      piso: 6,
      torre: 'C',
      apartamento: '602',
      descripcion: 'Apartamento en piso alto con excelente vista panorámica de Ibagué. Acabados de primera calidad.',
      caracteristicas: [
        'Vista panorámica de la ciudad',
        'Sala-comedor con ventanal amplio',
        'Cocina integral con barra',
        'Habitación principal con walk-in closet',
        'Dos habitaciones auxiliares',
        'Baño principal con jacuzzi',
        'Balcón terraza',
        'Depósito adicional'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      disponible: true,
      destacado: true
    },
    {
      id: 4,
      tipo: 'arriendo',
      titulo: 'Apartamento 1 Habitación - Torre A',
      precio: 850000,
      habitaciones: 1,
      banos: 1,
      area: 45,
      piso: 3,
      torre: 'A',
      apartamento: '305',
      descripcion: 'Perfecto para persona soltera o pareja joven. Funcional y bien distribuido con todas las comodidades.',
      caracteristicas: [
        'Sala-comedor integrada',
        'Cocina americana',
        'Habitación con closet',
        'Baño completo',
        'Balcón con vista interna',
        'Parqueadero visitantes',
        'Zona de ropas',
        'Acabados modernos'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      disponible: true,
      destacado: false
    },
    {
      id: 5,
      tipo: 'venta',
      titulo: 'Apartamento 2 Habitaciones - Torre B',
      precio: 245000000,
      habitaciones: 2,
      banos: 2,
      area: 70,
      piso: 5,
      torre: 'B',
      apartamento: '501',
      descripcion: 'Excelente oportunidad de inversión. Apartamento bien conservado con vista a las amenidades del conjunto.',
      caracteristicas: [
        'Vista a la piscina',
        'Sala amplia con comedor',
        'Cocina integral',
        'Habitación principal',
        'Habitación auxiliar',
        'Dos baños',
        'Balcón con vista amenidades',
        'Parqueadero propio'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      disponible: false,
      destacado: false
    },
    {
      id: 6,
      tipo: 'arriendo',
      titulo: 'Apartamento 3 Habitaciones - Torre C',
      precio: 1450000,
      habitaciones: 3,
      banos: 2,
      area: 88,
      piso: 1,
      torre: 'C',
      apartamento: '102',
      descripcion: 'Apartamento en primer piso con jardín privado. Ideal para familias con niños pequeños o mascotas.',
      caracteristicas: [
        'Jardín privado',
        'Acceso directo desde parqueadero',
        'Sala-comedor amplia',
        'Cocina con barra',
        'Tres habitaciones',
        'Dos baños completos',
        'Cuarto útil grande',
        'Terraza posterior'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566752734-0973420f95dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      ],
      disponible: true,
      destacado: true
    }
  ];

  // Filtros
  filtroActivo = 'todos';
  apartamentosFiltrados: Apartamento[] = [...this.apartamentos];

  // Apartamento seleccionado para vista detallada
  apartamentoSeleccionado: Apartamento | null = null;
  imagenActual = 0;

  // Computed properties para evitar cálculos en el template
  get apartamentosVenta(): number {
    return this.apartamentos.filter(a => a.tipo === 'venta').length;
  }

  get apartamentosArriendo(): number {
    return this.apartamentos.filter(a => a.tipo === 'arriendo').length;
  }

  // TrackBy function para optimizar rendimiento
  trackByApartamento(index: number, apartamento: Apartamento): number {
    return apartamento.id;
  }

  // Métodos de filtrado
  filtrarPor(tipo: string): void {
    this.filtroActivo = tipo;
    if (tipo === 'todos') {
      this.apartamentosFiltrados = [...this.apartamentos];
    } else {
      this.apartamentosFiltrados = this.apartamentos.filter(apt => apt.tipo === tipo);
    }
  }

  // Formatear precio
  formatearPrecio(precio: number, tipo: string): string {
    if (tipo === 'venta') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(precio);
    } else {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(precio) + '/mes';
    }
  }

  // Ver detalles del apartamento
  verDetalles(apartamento: Apartamento): void {
    this.apartamentoSeleccionado = apartamento;
    this.imagenActual = 0;
  }

  // Cerrar vista de detalles
  cerrarDetalles(): void {
    this.apartamentoSeleccionado = null;
    this.imagenActual = 0;
  }

  // Navegación de imágenes
  imagenAnterior(): void {
    if (this.apartamentoSeleccionado) {
      this.imagenActual = this.imagenActual > 0
        ? this.imagenActual - 1
        : this.apartamentoSeleccionado.imagenes.length - 1;
    }
  }

  imagenSiguiente(): void {
    if (this.apartamentoSeleccionado) {
      this.imagenActual = this.imagenActual < this.apartamentoSeleccionado.imagenes.length - 1
        ? this.imagenActual + 1
        : 0;
    }
  }

  // Contactar para más información
  contactarInfo(apartamento: Apartamento | null): void {
    if (!apartamento) return;

    const mensaje = `Hola, estoy interesado en el ${apartamento.titulo} (${apartamento.torre}${apartamento.apartamento}) en Wakari. ¿Podrían darme más información?`;
    const numeroWhatsApp = '+573214567890';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

// Programar visita
  programarVisita(apartamento: Apartamento | null): void {
    if (!apartamento) return;

    const mensaje = `Hola, me gustaría programar una visita al ${apartamento.titulo} (${apartamento.torre}${apartamento.apartamento}) en Wakari. ¿Cuándo sería posible?`;
    const numeroWhatsApp = '+573214567890';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

}
