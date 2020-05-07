
export class ServicioModel {

    id: string; 
    nombreServicio: string;
    imagen: string;
    descripcion: string;
    precioMinuto: number;

    constructor(){
        this.precioMinuto = 0;
    }

    idPeticion: string;
}
