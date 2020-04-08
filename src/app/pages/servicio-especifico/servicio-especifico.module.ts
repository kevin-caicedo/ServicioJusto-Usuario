import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicioEspecificoPageRoutingModule } from './servicio-especifico-routing.module';

import { ServicioEspecificoPage } from './servicio-especifico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicioEspecificoPageRoutingModule
  ],
  declarations: [ServicioEspecificoPage]
})
export class ServicioEspecificoPageModule {}
