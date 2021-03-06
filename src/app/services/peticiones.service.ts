import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeticionModel } from '../models/peticion.model';
import { map } from 'rxjs/operators';
import { AfiliadoModel } from '../models/afiliado.model';

@Injectable({
  providedIn: 'root'
})
export class PeticionesService {

  constructor( private http: HttpClient ) { }

  private urlDatabase = 'https://proyecto-serviciojusto.firebaseio.com';

  /**
   * Método para agregar la petición que solicita cada usuario
   * @author Kevin Caicedo
   * @param peticion 
   */
  agregarPeticion( peticion: PeticionModel ){
    
    const peticionData = {
      codigo: peticion.codigo,
      direccion: peticion.direccion,
      estado: 'solicitado',
      idServicio: peticion.idServicio,
      typeIdAfiliado: 'Buscando',
      typeIdUsuario: peticion.typeIdUsuario,
      ubicacion: peticion.ubicacion,
      pago: peticion.pago
    }

    return this.http.post(`${ this.urlDatabase }/Peticiones.json`, peticionData)
            .pipe( map((resp:any)=>{
              peticion.id = resp.name;
              return peticion;
            }));    
  }

  cancelarPeticion( id: string ){
    return this.http.delete(`${ this.urlDatabase }/Peticiones/${ id }.json`);
  }

  getPeticion( id: string ){
    return this.http.get(`${ this.urlDatabase }/Peticiones/${ id }.json`)
  }

  getAfiliados(  ){
    return this.http.get(`${ this.urlDatabase }/Afiliado.json`)
      .pipe(
        map( this.crearArregloServicio )
        );

  }

  //Método para calificar afiliado
  calificaAfiliado( peticion: PeticionModel ){

    const peticionTemp = {
      ...peticion
    }

    delete peticionTemp.id;
    
    return this.http.put(`${ this.urlDatabase }/Peticiones/${ peticion.id }.json`, peticionTemp);

  }

  private crearArregloServicio( servicioObj: object){
    
    const usuarioArray: AfiliadoModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: AfiliadoModel = servicioObj[key];
      servicio.id = key;

      usuarioArray.push( servicio );
    });

    return usuarioArray;
  }

  getPeticiones(){
    return this.http.get(`${ this.urlDatabase }/Peticiones.json`)
      .pipe(
        map( this.crearArregloPeticion )
      ); 
  }

  private crearArregloPeticion( servicioObj: object){
    
    const servicioArray: PeticionModel[] = [];

    if( servicioObj === null ){
      return [];
    }

    Object.keys( servicioObj ).forEach( key =>{

      const servicio: PeticionModel = servicioObj[key];
      servicio.id = key;

      servicioArray.push( servicio );
    });

    return servicioArray;
  }




}
