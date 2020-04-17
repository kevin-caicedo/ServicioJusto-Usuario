import { Component, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/servicio.model';
import { ServiciosService } from '../../services/servicios.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  servicios: ServicioModel[] = [];

  constructor( private servicioService: ServiciosService ) { }

  ngOnInit() {
    this.servicioService.getServicios()
      .subscribe(resp => this.servicios = resp);
  }

}
