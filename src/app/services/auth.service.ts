import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/Usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apikey = 'AIzaSyBar45be1zu0zqw5ZlznwH3qS9Dfcc2Cls';

  private urlDatabase = 'https://proyecto-serviciojusto.firebaseio.com';
  private idTemporal;

  usuarioParaTodo: UsuarioModel = new UsuarioModel();
  adminToken: string;

  //Crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]



  constructor( private http: HttpClient) {
    this.leerToken();
   }

  logout(){
    localStorage.removeItem('token');
  }

  //Sevicio para iniciar sesión
  login( usuario: UsuarioModel ){

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

  return this.http.post(
    `${ this.url }:signInWithPassword?key=${ this.apikey }`,
    authData
  ).pipe(
    map( resp=> {
        this.guardarToken(resp['idToken']);
        this.idTemporal = resp.localId;
        return resp;
      })
    
    );


  }

  
  //Sevicio para registrar un nuevo administrador
  nuevoUsuario( usuario: UsuarioModel ){

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

  return this.http.post(
    `${ this.url }:signUp?key=${ this.apikey }`,
    authData
  ).pipe(
    map( resp=> {
        this.guardarToken(resp['idToken']);
        this.idTemporal = resp.localId;
        return resp;
      })
    
    );
  }

  /**
   * Método que agrega los demás datos que no queradon registrados
   * @author Kevin Caicedo
   * @param usuario 
   */
  nuevoUsuarioResto( usuario: UsuarioModel ){

    const usuarioEnvio = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      celular: usuario.celular,
      direccion: usuario.direccion,
      fechaNacimiento: usuario.fechaNacimiento
    };

    return this.http.post(`${ this.urlDatabase }/Usuario/${this.idTemporal}.json`, usuarioEnvio);

  }


  getDatosUsuario( ){
    return this.http.get(`${ this.url }/Usuario/${ this.idTemporal }.json`);

  }
  
  private guardarToken(idToken: string){
    this.adminToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString());


  }

  leerToken(){
    if( localStorage.getItem('token')){
      this.adminToken = localStorage.getItem('token');
    }else{
      this.adminToken = '';
    }

    return this.adminToken;
  }

  estaAutenticado(): boolean{
    
    if(this.adminToken.length < 2){
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira)

    if(expiraDate > new Date()){
      return true;
    }else{
      return false
    }
    
  }
}
