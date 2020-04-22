import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CerrarCuentaPage } from './cerrar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: CerrarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CerrarCuentaPageRoutingModule {}
