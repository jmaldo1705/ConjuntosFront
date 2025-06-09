import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-teal-100 py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div class="bg-gradient-to-r from-green-600 to-teal-600 p-6">
            <h2 class="text-xl font-bold text-white">Reserva de Zonas Comunes</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-600 mb-4">Esta funcionalidad estará disponible próximamente.</p>
            <p class="text-gray-600">Aquí podrás reservar zonas comunes como el salón comunal, la piscina, y otras áreas del conjunto.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ReservasComponent {
  constructor() { }
}
