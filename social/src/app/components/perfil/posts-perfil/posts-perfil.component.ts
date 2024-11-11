import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { PostService } from 'src/app/services/post.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { io } from "socket.io-client";

@Component({
  selector: 'app-posts-perfil',
  templateUrl: './posts-perfil.component.html',
  styleUrls: ['./posts-perfil.component.css']
})
export class PostsPerfilComponent implements OnInit {

  public load_data = false;
  public data = false;
  public token = localStorage.getItem('token');
  public username = '';
  public cuenta : any = {};
  public user: any = {};
  public n_amigos = 0;
  public url = GLOBAL.url;
  public socket = io("http://localhost:4201",{transports: ['websocket']});
  public posts : Array<any> = [];

  constructor(
    private _userService:UsuarioService,
    private _postService:PostService,
    private _route:ActivatedRoute,
    private _router:Router
  ) { 
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.username = params['username'];
        this.init_posts();
      }
    );
  }

  init_posts(){
    this.load_data = true;
    this._postService.get_post_usuario(this.username,this.token).subscribe(
      response=>{
        if(response.data != undefined){
          this.posts = response.data;
          for(var item of this.posts){
            item.comentario = '';
            if(item.post.usuario.avatar == 'defecto.png') item.post.usuario.avatar = 'assets/images/usuario.png';
            else if(item.post.usuario.avatar != 'defecto.png') item.post.usuario.avatar = this.url + 'obtener_portada_img/'+item.post.usuario.avatar;
            for(var subitem of item.comentarios){
              subitem.box_reply = false;
              subitem.respuesta = '';
              if(subitem.comentario.usuario.avatar == 'defecto.png') subitem.comentario.usuario.avatar = 'assets/images/usuario.png';
              else if(subitem.comentario.usuario.avatar != 'defecto.png') subitem.comentario.usuario.avatar = this.url + 'obtener_portada_img/'+subitem.comentario.usuario.avatar;

              for(var replay of subitem.respuestas){
                if(replay.usuario.avatar == 'defecto.png') replay.usuario.avatar = 'assets/images/usuario.png';
                else if(replay.usuario.avatar != 'defecto.png') replay.usuario.avatar = this.url + 'obtener_portada_img/'+replay.usuario.avatar;
              }
            }
          }
          this.data = true;
        }else{
          this.data = false;
        }
        this.load_data = false;
      }
    );
  }

  redirect_post(id:any){
    this._router.navigate(['/post',id]);
  }

  set_liked(id:any){
      this._postService.set_like_post({post:id},this.token).subscribe(
        response=>{
          console.log(response);
          this.init_posts();
        }
      );
  } 

  openRespuesta(idxpost:any,idxcomentario:any){
    let state = this.posts[idxpost].comentarios[idxcomentario].box_reply;

    if(state) this.posts[idxpost].comentarios[idxcomentario].box_reply = false;
    else this.posts[idxpost].comentarios[idxcomentario].box_reply = true;

  }

  set_comentario(item:any){
    console.log(item);
    let comentario : any = {
      post:item.post._id,
      comentario: item.comentario,
      tipo: 'Comentario',
    };
    if(comentario.comentario){
      this._postService.set_comentario_post(comentario,this.token).subscribe(
        response=>{
          console.log(response);
          this.socket.emit('on-notifacion',response.amigos);
          this.init_posts();
        }
      );
    }
  }

  set_respuesta(item:any){
    console.log(item);
    
    let respuesta : any = {
      post:item.comentario.post,
      comentario: item.respuesta,
      reply_id: item.comentario._id,
      tipo: 'Respuesta',
    };
    console.log(respuesta);
    
    if(respuesta.comentario){
      this._postService.set_comentario_post(respuesta,this.token).subscribe(
        response=>{
          console.log(response);
          this.socket.emit('on-notifacion',response.amigos);
          this.init_posts();
        }
      );
    }
  }
}
