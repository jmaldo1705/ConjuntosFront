import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class NoticiasComponent {
  // Sample news data
  noticias = [
    {
      id: 1,
      titulo: 'Mantenimiento de la Piscina',
      fecha: '5 de junio, 2025',
      resumen: 'Se realizará mantenimiento de la piscina del conjunto. Estará cerrada durante dos días.',
      contenido: 'Estimados residentes, les informamos que se realizará el mantenimiento semestral de la piscina los días 10 y 11 de junio. Durante este tiempo, la piscina permanecerá cerrada. Agradecemos su comprensión.',
      imagen: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      categoria: 'Mantenimiento'
    },
    {
      id: 2,
      titulo: 'Asamblea General Ordinaria',
      fecha: '1 de junio, 2025',
      resumen: 'Convocatoria a la Asamblea General Ordinaria de Copropietarios.',
      contenido: 'Se convoca a todos los copropietarios a la Asamblea General Ordinaria que se llevará a cabo el día 20 de junio a las 7:00 PM en el salón comunal. Se tratarán temas importantes como el presupuesto anual y la elección del nuevo consejo de administración.',
      imagen: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      categoria: 'Administración'
    },
    {
      id: 3,
      titulo: 'Nuevo Sistema de Seguridad',
      fecha: '28 de mayo, 2025',
      resumen: 'Implementación de un nuevo sistema de seguridad en el conjunto.',
      contenido: 'Nos complace informar que a partir del 15 de junio se implementará un nuevo sistema de seguridad que incluye cámaras de vigilancia de última generación y control de acceso biométrico. Esto mejorará significativamente la seguridad de todos los residentes.',
      imagen: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      categoria: 'Seguridad'
    },
    {
      id: 4,
      titulo: 'Jornada de Vacunación para Mascotas',
      fecha: '20 de mayo, 2025',
      resumen: 'Se realizará una jornada de vacunación gratuita para mascotas del conjunto.',
      contenido: 'En colaboración con la Secretaría de Salud, realizaremos una jornada de vacunación gratuita para perros y gatos el día 12 de junio de 9:00 AM a 3:00 PM en la zona verde junto al salón comunal. No olvide traer el carné de vacunación de su mascota.',
      imagen: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      categoria: 'Eventos'
    }
  ];
}
