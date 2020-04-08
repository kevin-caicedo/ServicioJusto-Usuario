import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnviarPqrsPageRoutingModule } from './enviar-pqrs-routing.module';

import { EnviarPqrsPage } from './enviar-pqrs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnviarPqrsPageRoutingModule
  ],
  declarations: [EnviarPqrsPage]
})
export class EnviarPqrsPageModule {}
