import { Component, OnInit } from '@angular/core';
import { HistoriaService } from 'src/app/services/historia.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var e:any;
import { io } from "socket.io-client";
import { GLOBAL } from 'src/app/services/GLOBAL';
declare var $:any;
declare var tns:any;

@Component({
  selector: 'app-card-historias',
  templateUrl: './card-historias.component.html',
  styleUrls: ['./card-historias.component.css']
})
export class CardHistoriasComponent implements OnInit {

  public token = localStorage.getItem('token');
  public user : any = {};
  public msm_story_error = '';
  public str_image : any = '';
  public image : any = undefined;
  public socket = io("http://localhost:4201",{transports: ['websocket']});
  public historias : Array<any> = [];
  public url = GLOBAL.url;
  public load_historias = true;

  constructor(
    private _historiaService:HistoriaService,
    private _usuarioService:UsuarioService
  ) { 

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.init_historias();
  }

  init_historias(){
    this.load_historias = true;
    this._usuarioService.obtener_historias_usuario(this.token).subscribe(
      response=>{
        this.historias = response.data;
        setTimeout(() => {
          e.tinySlider();
        }, 50);
        this.load_historias = false;
      }
    );
  }

  uploadImage(event:any){
    var file;
    if(event.target.files && event.target.files[0]){
      file = event.target.files[0];
    }

    console.log(file);
    
    if(file.size <= 200000){
      //
      if(file.type == 'image/webp'||file.type == 'image/png'||file.type == 'image/jpg'||file.type == 'image/jpeg'||file.type == 'image/gif'){
        const reader = new FileReader();
        reader.onload = e => this.str_image = reader.result;
        reader.readAsDataURL(file);
        
        this.image = file;
      }else{
        this.msm_story_error = 'El formato es incorrecto.';
        this.image = undefined;
      }
    }else{
      this.msm_story_error = 'Se superó el tamaño máximo.';
      this.image = undefined;
    }
  }

  save(){
    let data = {
      usuario: this.user._id,
      imagen: this.image
    };
    this._historiaService.createStory(data,this.token).subscribe(
      response=>{
        console.log(response);
        $('#openStory').modal('hide')
      }
    );
    console.log(data);
    
  }

  removeImage(){
    this.str_image = '';
    this.image = undefined;
  }

}
