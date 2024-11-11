import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { io } from "socket.io-client";
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token = localStorage.getItem('token');
  public invitaciones : Array<any> = [];
  public notificaciones : Array<any> = [];
  public socket = io("http://localhost:4201",{transports: ['websocket']});
  public user: any = {};
  public load_invitacion = false;
  public load_notificacion = false;
  public search = '';
  public avatar = '';
  public url = GLOBAL.url;

  constructor(
    private _usuarioService:UsuarioService,
    private _router:Router,
    private _route:ActivatedRoute,
    private _postService:PostService
  ) { 
    this.user = JSON.parse(localStorage.getItem('user')!);
    if(this.user.avatar == 'defecto.png') this.avatar = 'assets/images/usuario.png';
    else if(this.user.avatar != 'defecto.png') this.avatar = this.url + 'obtener_portada_img/'+this.user.avatar;
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(
      (params:any)=>{
        this.search = params['search'];
      }
    );

    this.init_invitaciones();
    this.init_notifaciones();
    this.socket.on('new-invitacion',(data:any)=>{
      console.log(data);
      if(data._id == this.user._id){
        this.init_invitaciones();
      }
    });

    this.socket.on('emit-notifacion',(data:any)=>{
      console.log(data);
      let user_noticion = data.filter((item:any)=> item.usuario_amigo._id == this.user._id);
      
      if(user_noticion.length >= 1){
        //ACTUALIZAR NOTIFICACION
        this.init_notifaciones();
        
      }

    });
  }

  init_notifaciones(){
    this.load_notificacion = true;
    this._postService.get_notificaciones(this.token).subscribe(
      response=>{
        this.notificaciones = response.data;

        for(var item of this.notificaciones){
          if(item.usuario_interaccion.avatar == 'defecto.png') item.usuario_interaccion.avatar = 'assets/images/usuario_interaccion.png';
          else if(item.usuario_interaccion.avatar != 'defecto.png') item.usuario_interaccion.avatar = this.url + 'obtener_portada_img/'+item.usuario_interaccion.avatar;
        }
        console.log(this.notificaciones);
        
        this.load_notificacion = false;
      }
    );
  }

  logout(){
    localStorage.clear();
    window.location.reload();
  }

  emit_event(){
    this.socket.emit('test-event',{data: 'Hola'});
  }

  init_invitaciones(){
    this.load_invitacion = true;
    this._usuarioService.get_invitaciones_usuario('Limite',this.token).subscribe(
      response=>{
        this.invitaciones = response.data;
        this.load_invitacion = false;
      }
    );
  }

  set_invitacion(tipo:any,id:any,item:any){
    this._usuarioService.aceptar_denegar_invitacion(tipo,id,this.token).subscribe(
      response=>{
        console.log(response);
        this.socket.emit('set-invitacion',{
          origen: item.usuario_origen._id,
          destinario: item.usuario_destinatario
        });
        this.init_invitaciones();

      }
    );
  }

  search_usuario(){
    this._router.navigate(['/search'],{queryParams: { search: this.search }});
  }

  open_notificacion(item:any){
    this._postService.set_estado_notificacion(item._id,this.token).subscribe(
      response=>{
        console.log(response);
        this.init_notifaciones();
        this._router.navigate(['/post/'+item.post]);
        
      }
    );
  }
}
