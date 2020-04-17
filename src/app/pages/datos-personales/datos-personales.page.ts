import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from '../../models/Usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
})
export class DatosPersonalesPage implements OnInit {

  usuario: any;
  constructor( private auth: AuthService ) { 
    
    console.log("imprimo datos personales" + this.usuario);
    this.auth.getDatosUsuario().subscribe(resp=>{
      console.log("Imprimo datos personales resp" + resp);
      console.log("Imprimo datos personales this.usuario" + this.usuario);
      this.usuario = resp;

    },(err)=>{
      console.log(err);
    });
  }

  ngOnInit() {


  }

  actualizar( form: NgForm ){
    console.log(form);


  }

}
