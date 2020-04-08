import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnviarPqrsPage } from './enviar-pqrs.page';

const routes: Routes = [
  {
    path: '',
    component: EnviarPqrsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnviarPqrsPageRoutingModule {}
