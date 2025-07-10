import { Routes } from '@angular/router';
import { NormasPropiedadComponent } from './components/normas-propiedad/normas-propiedad.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { ContactComponent } from './components/contact/contact.component';
import { ManualConvivenciaComponent } from './components/manual-convivencia/manual-convivencia.component';
import { EmprendimientosComponent } from './components/emprendimientos/emprendimientos.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guestGuard';
import { ApartamentosResolver } from './resolvers/apartamentos.resolver';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'apartamentos',
    loadComponent: () => import('./components/apartamentos/apartamentos.component').then(m => m.ApartamentosComponent),
    resolve: {
      datos: ApartamentosResolver
    }
  },
  { path: 'normas-propiedad', component: NormasPropiedadComponent },
  { path: 'manual-convivencia', component: ManualConvivenciaComponent },
  { path: 'emprendimientos', component: EmprendimientosComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'reservas', component: ReservasComponent },
  {
    path: 'home',
    loadComponent: () => import('./components/index/index.component').then(m => m.IndexComponent),
    canActivate: [GuestGuard]
  },
  {
    path: 'welcome',
    loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/reservas',
    loadComponent: () => import('./components/confirmacion-reservas/confirmacion-reservas.component').then(c => c.ConfirmacionReservasComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/home' }
];
