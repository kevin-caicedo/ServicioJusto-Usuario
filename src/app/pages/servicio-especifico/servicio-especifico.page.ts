import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../services/servicios.service';
import { ServicioModel } from '../../models/servicio.model';

@Component({
  selector: 'app-servicio-especifico',
  templateUrl: './servicio-especifico.page.html',
  styleUrls: ['./servicio-especifico.page.scss'],
})
export class ServicioEspecificoPage implements OnInit {

  servicio = new ServicioModel();

  constructor(private activatedRoute: ActivatedRoute, private servicioService: ServiciosService) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.servicioService.getServicio( id )
        .subscribe((resp: ServicioModel) => {
          this.servicio = resp;
          this.servicio.id = id;
        });

  }

}
