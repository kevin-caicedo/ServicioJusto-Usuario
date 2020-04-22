import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CerrarCuentaPageRoutingModule } from './cerrar-cuenta-routing.module';

import { CerrarCuentaPage } from './cerrar-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CerrarCuentaPageRoutingModule
  ],
  declarations: [CerrarCuentaPage]
})
export class CerrarCuentaPageModule {}
