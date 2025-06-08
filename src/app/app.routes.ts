import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { ManualConvivenciaComponent } from './components/manual-convivencia/manual-convivencia.component';
import { NormasPropiedadComponent } from './components/normas-propiedad/normas-propiedad.component';
import { NoticiasComponent } from './components/noticias/noticias.component';
import { AdministracionComponent } from './components/administracion/administracion.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

export const routes: Routes = [
  { path: '', component: IndexComponent, pathMatch: 'full' },
  { path: 'manual-convivencia', component: ManualConvivenciaComponent },
  { path: 'normas-propiedad', component: NormasPropiedadComponent },
  { path: 'noticias', component: NoticiasComponent },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'pagos', component: PagosComponent },
  { path: 'welcome', component: WelcomeComponent },
  // Redirect all other routes to the home page
  { path: '**', redirectTo: '' }
];
