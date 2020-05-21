import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from '../../services/servicios.service';
import { ServicioModel } from '../../models/servicio.model';
import Swal from 'sweetalert2';
import { PeticionModel } from '../../models/peticion.model';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/Usuario.model';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-servicio-especifico',
  templateUrl: './servicio-especifico.page.html',
  styleUrls: ['./servicio-especifico.page.scss'],
})
export class ServicioEspecificoPage implements OnInit {

  servicio = new ServicioModel();
  peticion: PeticionModel = new PeticionModel();
  usuarioArray: UsuarioModel[] = [];
  direccion: string;
  pago: string;

  constructor(private activatedRoute: ActivatedRoute, private servicioService: ServiciosService, 
              private router: Router,
              private auth: AuthService, 
              private _peticion: PeticionesService,
              private _auth: AuthService,
              public geolocation: Geolocation) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      this.peticion.direccion = geoposition.coords.latitude + "," + geoposition.coords.longitude;
    })
    

    if(!this._auth.estaAutenticado()){
      localStorage.setItem('idServicio', id);
    }
    this.servicioService.getServicio( id )
        .subscribe((resp: ServicioModel) => {
          this.servicio = resp;
          this.servicio.id = id;
          this.peticion.idServicio = this.servicio.id;
        });

    this.traeUsuario();


  }

  geolocationPerson(){
    this.geolocation.getCurrentPosition().then((geoposition: Geoposition)=>{
      
    })
  }

  traeUsuario(){

    this.auth.getTodosUsuario().subscribe( resp=>{
      this.usuarioArray = resp;

      for(let item of this.usuarioArray){
        if( this.auth.leerLocalId() == item.typeId ){
          this.peticion.typeIdUsuario = item.typeId;
          this.direccion = item.direccion;
          this.peticion.ubicacion = item.direccion;
        }
      }
    });
    
  }

  confirmacion(){

    if( !localStorage.getItem('idPeticion') ){

        if(!this.pago){
          Swal.fire(
            'Seleccionar método de pago!',
            'Efectivo o tarjeta',
            'error'
          )
          return;
        }
    
        this.peticion.pago = this.pago
        this.peticion.codigo = Math.floor(Math.random()*1000000);
    
        Swal.fire({
          title: '¿Está seguro?',
          text: `¿Está seguro que desea comenzar el servicio?`,
          icon: "question",
          showConfirmButton: true,
          showCancelButton: true
        }).then( resp=>{
    
          this.peticion.pago = this.pago
          if( resp.value ){
            this._peticion.agregarPeticion( this.peticion ).subscribe( resp =>{
              this.peticion = resp;
              this.router.navigate(['estado-solicitud', this.peticion.id]);
            });
          }
        });
      }else{
        Swal.fire(
          'Atención!',
          'Ya tienes un servicio en desarrollo!',
          'warning'
        );
      }
    }

    
}
