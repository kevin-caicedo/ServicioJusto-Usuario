import { Component, OnInit } from '@angular/core';
import { ServicioModel } from '../../models/servicio.model';
import { ServiciosService } from '../../services/servicios.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  servicios: ServicioModel[] = [];
  verifica: boolean;
  idPeticion: boolean;

  constructor( private servicioService: ServiciosService, private router:Router, private _auth: AuthService ) { }

  ngOnInit() {

    if( localStorage.getItem('idPeticion') ){
      this.idPeticion = true;
    }
    this._auth.obtenerDatosFirebase().subscribe(resp=>{
      if(resp['users']['0'].emailVerified){
        this.verifica = false;
        this.servicioService.getServicios()
        .subscribe(resp => this.servicios = resp);
      }else{
        this.verifica = true;
      }
    });
    
  }

  doRefresh(event) {
    location.reload();

    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  buscarServicio( termino: string ){

    this.router.navigate(['/buscar', termino]);
      
  }

  regresar(){
    this.router.navigate(['/estado-solicitud', localStorage.getItem('idPeticion')]);
  }

}
