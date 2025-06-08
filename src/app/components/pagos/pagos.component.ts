import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css'
})
export class PagosComponent {
  // Sample payment methods
  metodosPago = [
    {
      nombre: 'AvalPay',
      logo: 'https://www.avalpaycenter.com/wps/wcm/connect/avalpay/7f4e5b3c-f5a5-4ced-a0c3-6d0c23fe1fcb/logo-avalpay-center.svg?MOD=AJPERES&CACHEID=ROOTWORKSPACE.Z18_P8I61H40IOV160QEU4HGAV2G63-7f4e5b3c-f5a5-4ced-a0c3-6d0c23fe1fcb-nQfvNfP',
      descripcion: 'Plataforma de pagos en línea del Grupo Aval. Permite pagar con tarjetas de crédito, débito y PSE.',
      url: 'https://www.avalpaycenter.com',
      instrucciones: [
        'Ingresa a la plataforma AvalPay Center',
        'Selecciona "Pagos" y luego "Administración de Inmuebles"',
        'Busca nuestro conjunto residencial por nombre o NIT',
        'Ingresa tu número de apartamento y referencia de pago',
        'Selecciona el método de pago y completa la transacción'
      ]
    }
  ];

  // Sample FAQs about payments
  preguntas = [
    {
      pregunta: '¿Cuál es la fecha límite de pago?',
      respuesta: 'La fecha límite para el pago de la administración es el día 10 de cada mes. Después de esta fecha se generarán intereses por mora.'
    },
    {
      pregunta: '¿Qué pasa si no puedo pagar a tiempo?',
      respuesta: 'Si tienes dificultades para realizar el pago a tiempo, te recomendamos comunicarte con la administración para establecer un acuerdo de pago y evitar intereses por mora.'
    },
    {
      pregunta: '¿Puedo pagar varios meses por adelantado?',
      respuesta: 'Sí, puedes realizar el pago de varios meses por adelantado. Esto te ayudará a evitar olvidos y posibles recargos por pagos tardíos.'
    },
    {
      pregunta: '¿Cómo obtengo un certificado de paz y salvo?',
      respuesta: 'Puedes solicitar el certificado de paz y salvo directamente en la oficina de administración o por correo electrónico, siempre y cuando estés al día con tus pagos.'
    },
    {
      pregunta: '¿Qué incluye el pago de administración?',
      respuesta: 'El pago de administración incluye servicios como vigilancia, aseo de áreas comunes, mantenimiento de zonas verdes, piscina y demás áreas comunes, así como un fondo de imprevistos.'
    }
  ];
}
