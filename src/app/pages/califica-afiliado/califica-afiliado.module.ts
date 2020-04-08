import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalificaAfiliadoPageRoutingModule } from './califica-afiliado-routing.module';

import { CalificaAfiliadoPage } from './califica-afiliado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalificaAfiliadoPageRoutingModule
  ],
  declarations: [CalificaAfiliadoPage]
})
export class CalificaAfiliadoPageModule {}
