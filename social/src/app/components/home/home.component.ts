import { Component, OnInit } from '@angular/core';
import { HistoriaService } from 'src/app/services/historia.service';
import { UsuarioService } from 'src/app/services/usuario.service';
declare var e:any;
import { io } from "socket.io-client";
import { GLOBAL } from 'src/app/services/GLOBAL';
import { PostService } from 'src/app/services/post.service';
import { Router } from '@angular/router';
declare var $:any;
declare var tns:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public load_data = true;
  public avatar = '';
  public token = localStorage.getItem('token');
  public user : any = {};
  public socket = io("http://localhost:4201",{transports: ['websocket']});
  public url = GLOBAL.url;

  public msm_story_error = '';
  public str_image : any = '';
  public image : any = undefined;

  public post : any = {
    tipo: 'Texto',
    privacidad: 'Solo yo' //Solo yo, Amigos
  };

  public posts :Array<any> = [];
  public limit = 2;

  constructor(
    private _historiaService:HistoriaService,
    private _usuarioService:UsuarioService,
    private _postService:PostService,
    private _router:Router
  ) { 

  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user')!);

    if(this.user.avatar == 'defecto.png') this.avatar = 'assets/images/usuario.png';
    else if(this.user.avatar != 'defecto.png') this.avatar = this.url + 'obtener_portada_img/'+this.user.avatar;
  
    this.init_post(true);
  }


  openModalPost(){
    $('#createPost').modal('show');
  }
  
  removeImage(){
    this.str_image = '';
    this.image = undefined;
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
        console.log(this.str_image);
        
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

  init_post(load:any){
    if(load)this.load_data = true;
    this._postService.get_post_amigos(this.limit,this.token).subscribe(
      response=>{

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

        /* this.posts.sort((a:any, b:any) => {
          const nameA = new Date(a.post.createdAt).getTime(); 
          const nameB = new Date(b.post.createdAt).getTime(); 
          console.log(nameA);
          

          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
        
          return 0;
        }); */
        if(load)this.load_data = false;
        console.log(this.posts);
        
      }
    );
  }

  createPost(){
    if(!this.post.contenido){
      //
    }else{
      this.post.media = this.image;

      if(this.post.media != undefined) this.post.tipo = 'Media'
      else this.post.tipo = 'Texto';

      this.post.extracto = this.post.contenido.substring(0,130);
      console.log(this.post);
      this._postService.create_post(this.post,this.token).subscribe(
        response=>{
          if(response.data != undefined){
              this.post.contenido = '';

              this.socket.emit('on-notifacion',response.amigos);

              $('#createPost').modal('hide');
              this.init_post(true);
          }else{
            console.log(response.message);
            
          }
        }
      );
    }
  }

  set_liked(id:any){
      this._postService.set_like_post({post:id},this.token).subscribe(
        response=>{
          console.log(response);
          this.init_post(true);
        }
      );
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
          this.init_post(true);
        }
      );
    }
  }

  openRespuesta(idxpost:any,idxcomentario:any){
    let state = this.posts[idxpost].comentarios[idxcomentario].box_reply;

    if(state) this.posts[idxpost].comentarios[idxcomentario].box_reply = false;
    else this.posts[idxpost].comentarios[idxcomentario].box_reply = true;

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
          this.init_post(true);
        }
      );
    }
  }

  redirect_post(id:any){
    this._router.navigate(['/post',id]);
  }

  more(){
    this.limit = this.limit + 2;
    this.init_post(false);
  }
}
