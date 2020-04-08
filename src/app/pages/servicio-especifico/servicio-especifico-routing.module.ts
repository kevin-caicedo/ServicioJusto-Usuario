import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicioEspecificoPage } from './servicio-especifico.page';

const routes: Routes = [
  {
    path: '',
    component: ServicioEspecificoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioEspecificoPageRoutingModule {}
