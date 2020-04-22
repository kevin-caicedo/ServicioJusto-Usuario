import { Component, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/servicio.model';
import { ActivatedRoute } from '@angular/router';
import { ServiciosService } from '../../services/servicios.service';


@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  servicios: ServicioModel[] = [];

  termino:string;

  constructor( private router: ActivatedRoute, private serviciosService: ServiciosService ) { }

  ngOnInit() {

    this.router.params.subscribe( params => {
      this.termino = params['termino'];
      this.servicios = this.serviciosService.buscando( params['termino']);
    });
  }

}
