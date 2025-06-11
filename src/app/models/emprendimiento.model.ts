export interface Emprendimiento {
  id: string;
  nombre: string;
  descripcion: string;
  descripcionCompleta: string;
  categoria: string;
  propietario: string;
  contacto: {
    telefono?: string;
    email?: string;
    whatsapp?: string;
  };
  ubicacion: string;
  horarios: string;
  imagenes: string[];
  fechaCreacion: Date;
  activo: boolean;
  rating?: number;
  precio?: {
    min: number;
    max: number;
    moneda: string;
  };
  servicios: string[];
  destacado: boolean;
  redSocial?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  experiencia?: string;
  productos?: string[];
}

export interface FiltrosEmprendimiento {
  categoria?: string;
  busqueda?: string;
  ordenarPor?: 'nombre' | 'fecha' | 'rating';
  soloActivos?: boolean;
  soloDestacados?: boolean;
}
