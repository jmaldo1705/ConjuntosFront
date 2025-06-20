import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { NormasPropiedadComponent } from './components/normas-propiedad/normas-propiedad.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { ContactComponent } from './components/contact/contact.component';
import { ApartamentosComponent } from './components/apartamentos/apartamentos.component';
import { ManualConvivenciaComponent } from './components/manual-convivencia/manual-convivencia.component';
import { EmprendimientosComponent } from './components/emprendimientos/emprendimientos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: IndexComponent },
  { path: 'apartamentos', component: ApartamentosComponent },
  { path: 'normas-propiedad', component: NormasPropiedadComponent },
  { path: 'manual-convivencia', component: ManualConvivenciaComponent },
  { path: 'emprendimientos', component: EmprendimientosComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'contacto', component: ContactComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'reservas', component: ReservasComponent },

  { path: '**', redirectTo: '/home' }
];
