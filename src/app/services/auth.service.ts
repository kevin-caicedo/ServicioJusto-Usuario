import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UsuarioModel } from '../models/Usuario.model';
import { map } from 'rxjs/operators';
import { AfiliadoModel } from '../models/afiliado.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apikey = 'AIzaSyBar45be1zu0zqw5ZlznwH3qS9Dfcc2Cls';

  private urlDatabase = 'https://proyecto-serviciojusto.firebaseio.com';
  private idTemporal: any;

  adminToken: string;
  localId: string;

  constructor( private http: HttpClient) {
    this.leerToken();
    this.leerLocalId();
   }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('expira');
    localStorage.removeItem('localId');
    localStorage.removeItem('idUsuario');
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
        this.guardarLocalId(resp['localId']);
        return resp;
      })
    
    );


  }

  /**
   * Método para verificar si el correo fue verificado
   */
  verificarCorreo(){

    const verificaData = {
      requestType: "VERIFY_EMAIL",
      idToken: this.leerToken()
    };
    return this.http.post(`${ this.url }:sendOobCode?key=${ this.apikey }`, verificaData);

  }

   /**
   * Método para verificar traer los datos del usuario
   */
  obtenerDatosFirebase(){
    const token = {
      idToken: this.leerToken()
    };
    return this.http.post(`${ this.url }:lookup?key=${ this.apikey }`, token);
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
        this.nuevoUsuarioResto(usuario, resp).subscribe();
        return resp;
      })
    
    );
  }

  /**
   * Método que agrega los demás datos que no queradon registrados
   * @author Kevin Caicedo
   * @param usuario 
   */
  nuevoUsuarioResto( usuario: UsuarioModel, resp: any ){

    usuario.calificacion = {valor: 5, contador: 0};

    const usuarioEnvio = {
      typeId: resp.localId,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      celular: usuario.celular,
      direccion: usuario.direccion,
      fechaNacimiento: usuario.fechaNacimiento,
      calificacion: usuario.calificacion
    };

    this.guardarLocalId(usuarioEnvio.typeId);
    
    return this.http.post(`${ this.urlDatabase }/Usuario/.json`, usuarioEnvio)
        .pipe(
          map( (resp:any)=>{
            usuario.id = resp.name;
            localStorage.setItem('idUsuario', usuario.id);
            return usuario;
          } )
        ) ;
  }
  
  private guardarToken(idToken: string){
    this.adminToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString());


  }

  actualizarUsuario( usuario: UsuarioModel ){

    const usuarioTemp = {
      ...usuario
    };

    delete usuarioTemp.id;

    return this.http.put(`${ this.urlDatabase }/Usuario/${ usuario.id }.json`, usuarioTemp);

  }

  private guardarLocalId(localId: string){
    this.localId = localId;
    localStorage.setItem('localId', localId);
  }

  leerLocalId(){
    if( localStorage.getItem('localId')){
      this.localId = localStorage.getItem('localId');
    }else{
      this.localId = '';
    }

    return this.localId;
  }


  getTodosUsuario(){

    return this.http.get(`${ this.urlDatabase }/Usuario.json`)
      .pipe(
        map( this.crearArregloServicio )
      );

  }

  usuarioArrayTemporal: UsuarioModel[] = [];
  getUnUsuario(){
    this.getTodosUsuario().subscribe(resp=>{
      this.usuarioArrayTemporal = resp;

      for( let item of this.usuarioArrayTemporal){
        if(localStorage.getItem('localId') === item.typeId){
          localStorage.setItem('idUsuario', item.id);
        }
      }
    })
  }

  getUsuario( id: string ){
    return this.http.get(`${ this.urlDatabase }/Usuario/${ id }.json`);
  }

  private crearArregloServicio( servicioObj: object){
    
    const usuarioArray: UsuarioModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: UsuarioModel = servicioObj[key];
      servicio.id = key;

      usuarioArray.push( servicio );
    });

    return usuarioArray;
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

  /**
   * Método que se usa para que el usuario se re-autentique si está seguro de borrar su cuenta.
   * @author Kevin Caicedo
   * @param usuario 
   */
  eliminarCuentaCorreo( usuario: UsuarioModel ){

    const authData = {
      idToken: usuario.nombre
    };

    return this.http.post(`${ this.url }:delete?key=${ this.apikey }`, authData);
    
  }
  eliminarCuentaDatos( id: string ){
    return this.http.delete(`${ this.urlDatabase }/Usuario/${ id }.json`);
  }

  recuperarContrasena( correo: string ){

    const recupera = {
      requestType: 'PASSWORD_RESET',
      email: correo
    }

    return this.http.post(`${ this.url }:sendOobCode?key=${ this.apikey }`, recupera);
  }
  
  cambiaContrasena( usuario: UsuarioModel ){

    const usuarioTemp = {
      idToken: localStorage.getItem('token'),
      password: usuario.password,
      returnSecureToken: false
    }

    return this.http.post(`${ this.url }:update?key=${ this.apikey }`, usuarioTemp);
  }

  calificandoAfiliado( afiliado: AfiliadoModel ){

    const afiliadoTemporal = {
      ... afiliado
    }

    delete afiliadoTemporal.id

    return this.http.put(`${ this.urlDatabase }/Afiliado/${ afiliado.id }.json`, afiliadoTemporal);

  }

}
