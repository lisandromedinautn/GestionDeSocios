import { Routes } from '@angular/router';
import { SocioComponent } from './socio/socio.component';
import { SocioCreateComponent } from './socio-create/socio-create.component';
import { SocioViewComponent } from './socio-view/socio-view.component';
import { SocioEditComponent } from './socio-edit/socio-edit.component';
import { AdminComponent } from './admin/admin.component';
import { EstadoComponent } from './estado/estado.component';
import { CajaComponent } from './caja/caja.component';

export const routes: Routes = [
  { path: 'socios', component: SocioComponent },
  { path: 'socios/crear', component: SocioCreateComponent },
  { path: 'socios/ver/:id', component: SocioViewComponent },
  { path: 'socios/editar/:id', component: SocioEditComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'estado', component: EstadoComponent },
  { path: 'caja', component: CajaComponent },
  { path: '', redirectTo: '/socios', pathMatch: 'full' }, // Redirección por defecto
  { path: '**', redirectTo: '/socios' }, // Si ponen cualquier cosa, los manda a socios
];
