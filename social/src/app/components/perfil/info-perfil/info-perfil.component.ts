import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-info-perfil',
  templateUrl: './info-perfil.component.html',
  styleUrls: ['./info-perfil.component.css']
})
export class InfoPerfilComponent implements OnInit {

  public load_data = true;
  public data = false;
  public token = localStorage.getItem('token');
  public username = '';
  public cuenta : any = {};
  public user: any = {};
  public msm_error_portada = '';
  public portada = '';
  public avatar = '';
  public n_amigos = 0;
  public url = GLOBAL.url;
  
  constructor(

    private _userService:UsuarioService,
    private _route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);

    console.log(this.user);
    
    this._route.params.subscribe(
      params=>{
        this.username = params['username'];
        this.init_user();
      }
    );
  }

  init_user(){
    this.load_data = true;
    this._userService.obtener_usuario_username(this.username,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.data = true;
          this.n_amigos = response.n_amigos;
          this.cuenta = response.data; //la cuenta que estamos viendo
          console.log(this.cuenta);
          
          if(!this.cuenta.portada) this.portada = 'assets/images/portada.jpg';
          else if(this.cuenta.portada) this.portada = this.url + 'obtener_portada_img/'+this.cuenta.portada;

          if(this.cuenta.avatar == 'defecto.png') this.avatar = 'assets/images/usuario.png';
          else if(this.cuenta.avatar != 'defecto.png') this.avatar = this.url + 'obtener_portada_img/'+this.cuenta.avatar;


          this.load_data = false;
        }else{
          this.data = false;
          this.load_data = false;
        }
      }
    );
  }

  uploadImage(event:any,tipo:any){
    var file = event.target.files[0];

    if(file){
      if(file.type == 'image/webp'||file.type == 'image/png'||file.type == 'image/jpg'||file.type == 'image/gif'||file.type == 'image/jpeg'){
        if(file.size <= 2000000){
          if(tipo == 'Portada'){
            this.msm_error_portada = '';
            console.log(file);
            this._userService.actualizar_portada_usuario({portada:file},this.token).subscribe(
              response=>{
                console.log(response);
                this.init_user();
              }
            );
          }else if(tipo == 'Avatar'){
            this.msm_error_portada = '';
            this._userService.actualizar_avatar_usuario({avatar:file},this.token).subscribe(
              response=>{
                console.log(response);
                this.init_user();
              }
            );
          }
        }else{
          this.msm_error_portada = 'El tamaño supero el limite';
        }
      }else{
        this.msm_error_portada = 'El formato no es valido';
      }
      console.log(this.msm_error_portada);
      
    }
    
  }
}
