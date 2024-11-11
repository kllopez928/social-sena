import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { PostService } from 'src/app/services/post.service';
import { io } from "socket.io-client";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {

  public post : any = {};
  public url = GLOBAL.url;
  public token = localStorage.getItem('token');
  public id = '';
  public load_data = true;
  public socket = io("http://localhost:4201",{transports: ['websocket']});

  constructor(
    private _postService:PostService,
    private _route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data();
      }
    );
  }

  init_data(){
    this.load_data = true;
    this._postService.get_post(this.id,this.token).subscribe(
      response=>{
        this.post = response.data;

        this.post.comentario = '';

        if(this.post.post.usuario.avatar == 'defecto.png') this.post.post.usuario.avatar = 'assets/images/usuario.png';
        else if(this.post.post.usuario.avatar != 'defecto.png') this.post.post.usuario.avatar = this.url + 'obtener_portada_img/'+this.post.post.usuario.avatar;

        for(var subitem of this.post.comentarios){
          subitem.box_reply = false;
          subitem.respuesta = '';
          if(subitem.comentario.usuario.avatar == 'defecto.png') subitem.comentario.usuario.avatar = 'assets/images/usuario.png';
          else if(subitem.comentario.usuario.avatar != 'defecto.png') subitem.comentario.usuario.avatar = this.url + 'obtener_portada_img/'+subitem.comentario.usuario.avatar;

          for(var replay of subitem.respuestas){
            if(replay.usuario.avatar == 'defecto.png') replay.usuario.avatar = 'assets/images/usuario.png';
            else if(replay.usuario.avatar != 'defecto.png') replay.usuario.avatar = this.url + 'obtener_portada_img/'+replay.usuario.avatar;
          }
        }

        this.load_data = false;
        console.log(this.post);
        
      }
    );
  }

  set_liked(id:any){
    this._postService.set_like_post({post:id},this.token).subscribe(
      response=>{
        console.log(response);
        this.init_data();
      }
    );
  } 

  set_comentario(){
    let comentario : any = {
      post:this.post.post._id,
      comentario: this.post.comentario,
      tipo: 'Comentario',
    };

    console.log(comentario);
    
    if(comentario.comentario){
      this._postService.set_comentario_post(comentario,this.token).subscribe(
        response=>{
          console.log(response);
          this.socket.emit('on-notifacion',response.amigos);
          this.init_data();
        }
      );
    }
  }

  openRespuesta(idxcomentario:any){
    let state = this.post.comentarios[idxcomentario].box_reply;

    if(state) this.post.comentarios[idxcomentario].box_reply = false;
    else this.post.comentarios[idxcomentario].box_reply = true;

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
          this.init_data();
        }
      );
    }
  }
}
