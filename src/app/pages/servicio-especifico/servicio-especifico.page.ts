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
import { AlertController } from '@ionic/angular';

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
  entra: boolean = true;
  peticionArrayTemporal: string[] = [];
  usuarioTemporal : UsuarioModel;

  constructor(private activatedRoute: ActivatedRoute, private servicioService: ServiciosService, 
              private router: Router,
              private auth: AuthService, 
              private _peticion: PeticionesService,
              private _auth: AuthService,
              public alertController: AlertController,
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

  entrando: boolean = false;

  confirmacion(){

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
          text: `¿Está seguro que desea solicitar el servicio?`,
          icon: "question",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar'
        }).then( resp=>{
    
          this.peticion.pago = this.pago

          if( resp.value ){            
          
              this._auth.getUsuario( localStorage.getItem('idUsuario') ).subscribe((respUsuario: UsuarioModel)=>{
                this.usuarioTemporal = respUsuario;
                this.usuarioTemporal.id = localStorage.getItem('idUsuario');                

                if( this.usuarioTemporal.peticiones ){

                  if( this.usuarioTemporal.peticiones.length != 3 ){

                    this.verficaAgregarServicio();
                    
                  }else{
                    console.log('Esta seguro que eres tu');

                    this.autentica();
                    
                  }
                  
                }else{
                    this._peticion.agregarPeticion( this.peticion ).subscribe( resp =>{
                    this.peticion = resp;
                    this.usuarioTemporal.peticiones = [ this.peticion.id ];
                    this.router.navigate(['estado-solicitud', this.peticion.id]);
                    this._auth.actualizarUsuario( this.usuarioTemporal ).subscribe();
                  });
                }
              })            
          }                
        });
    }

    verficaAgregarServicio(){

      for(let i = 0; i<this.usuarioTemporal.peticiones.length; i++){

        this._peticion.getPeticion( this.usuarioTemporal.peticiones[i] ).subscribe((resp: PeticionModel)=>{
          let peticionT: PeticionModel = resp;
          
          if(peticionT.idServicio === this.peticion.idServicio){
            Swal.fire(
              'Atención!',
              'Ya tienes un servicio similar en desarrollo',
              'warning'
            )
            this.entrando = true;
          }                                          
        })

        if(this.entrando){
          break;
        }
      }

      setTimeout(() => {

        if(!this.entrando){
          this._peticion.agregarPeticion( this.peticion ).subscribe( resp =>{
            this.peticion = resp;
            this.usuarioTemporal.peticiones.push( this.peticion.id );
            this.router.navigate(['estado-solicitud', this.peticion.id]);
            this._auth.actualizarUsuario( this.usuarioTemporal ).subscribe();
          });
          return;
        }  

      },1500);

      
    }

    async incorrecto() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Atención',
        subHeader: 'Autenticación fallida',
        message: 'Datos incorrectos.',
        buttons: ['OK']
      });
  
      await alert.present();
    }


    async autentica() {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirma tu cuenta, para solicitar más servicios!',
        inputs: [
          {
            name: 'correo',
            type: 'email',
            placeholder: 'Correo'
          },
          {
            name: 'contrasena',
            type: 'password',
            placeholder: 'Contraseña'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: ( blah ) => {

              this.usuarioTemporal.email = blah.correo;
              this.usuarioTemporal.password = blah.contrasena;

              this._auth.login( this.usuarioTemporal ).subscribe(resp=>{
                this.verficaAgregarServicio();
              }, err =>{
                this.incorrecto();
              })
              
            }
          }
        ]
      });
  
      await alert.present();
    }
}
