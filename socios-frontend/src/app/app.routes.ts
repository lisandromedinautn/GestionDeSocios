import { Routes } from '@angular/router';
import { SocioComponent } from './socio/socio.component';

export const routes: Routes = [
  { path: 'socios', component: SocioComponent },
  { path: '', redirectTo: '/socios', pathMatch: 'full' }, // Redirección por defecto
  { path: '**', redirectTo: '/socios' }, // Si ponen cualquier cosa, los manda a socios
];
