import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { PostService } from 'src/app/services/post.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-widgets-perfil',
  templateUrl: './widgets-perfil.component.html',
  styleUrls: ['./widgets-perfil.component.css']
})
export class WidgetsPerfilComponent implements OnInit {

  public username = '';
  public load_data = true;
  public data = false;
  public token = localStorage.getItem('token');
  public cuenta : any = {};
  public url = GLOBAL.url;

  public fotos : Array<any> = [];
  public amigos : Array<any> = [];

  constructor(
    private _route:ActivatedRoute,
    private _userService:UsuarioService,
    private _postService:PostService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.username = params['username'];
        this.init_user();
        this.init_widgets();
      }
    );
  }

  init_user(){
    this.load_data = true;
    this._userService.obtener_usuario_username(this.username,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.data = true;
          this.cuenta = response.data;
          this.load_data = false;
        }else{
          this.data = false;
          this.load_data = false;
        }
      }
    );
  }

  init_widgets(){
    this._postService.get_widgets_perfil(this.username,this.token).subscribe(
      response=>{
        this.fotos = response.posts;
        this.amigos = response.amigos;
        console.log(this.amigos);
        
        for(var item of this.amigos){
          if(item.usuario_amigo.avatar == 'defecto.png') item.usuario_amigo.avatar = 'assets/images/usuario.png';
          else if(item.usuario_amigo.avatar != 'defecto.png') item.usuario_amigo.avatar = this.url + 'obtener_portada_img/'+item.usuario_amigo.avatar;
        }

      }
    );
  }

}
