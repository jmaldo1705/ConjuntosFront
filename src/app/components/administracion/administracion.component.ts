import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.css'
})
export class AdministracionComponent {
  // Sample data for administration team
  administrador = {
    nombre: 'Carlos Rodríguez',
    cargo: 'Administrador',
    email: 'administrador@conjuntoresidencial.com',
    telefono: '(+57) 300 123 4567',
    horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
    foto: 'https://randomuser.me/api/portraits/men/42.jpg',
    descripcion: 'Profesional en administración de propiedades con más de 10 años de experiencia en la gestión de conjuntos residenciales.'
  };

  consejo = [
    {
      nombre: 'Ana María Gómez',
      cargo: 'Presidente del Consejo',
      apartamento: '501',
      foto: 'https://randomuser.me/api/portraits/women/22.jpg'
    },
    {
      nombre: 'Juan Carlos Martínez',
      cargo: 'Secretario',
      apartamento: '302',
      foto: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      nombre: 'Patricia Sánchez',
      cargo: 'Tesorera',
      apartamento: '704',
      foto: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
      nombre: 'Roberto Díaz',
      cargo: 'Vocal',
      apartamento: '203',
      foto: 'https://randomuser.me/api/portraits/men/67.jpg'
    },
    {
      nombre: 'Lucía Hernández',
      cargo: 'Vocal',
      apartamento: '602',
      foto: 'https://randomuser.me/api/portraits/women/33.jpg'
    }
  ];

  // Sample data for office hours
  horarioOficina = {
    diasLaborales: 'Lunes a Viernes',
    horario: '8:00 AM - 5:00 PM',
    sabados: '9:00 AM - 12:00 PM',
    domingos: 'Cerrado',
    telefonoOficina: '(+57) 1 234 5678',
    emailOficina: 'oficina@conjuntoresidencial.com',
    ubicacion: 'Primer piso, junto a la portería principal'
  };
}
