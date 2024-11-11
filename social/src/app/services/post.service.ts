import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { GLOBAL } from './GLOBAL';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  public url = GLOBAL.url;

  constructor(
    private _http:HttpClient
  ) { }

  create_post(data:any,token:any):Observable<any>{
    let headers;
    let body;
    if(data.tipo == 'Texto'){
      headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
      body = data;
    }else if(data.tipo == 'Media'){
      headers = new HttpHeaders({'Authorization':token});
      body = new FormData();
      body.append('media',data.media);
      body.append('contenido',data.contenido);
      body.append('extracto',data.extracto);
      body.append('tipo',data.tipo);
      body.append('privacidad',data.privacidad);
    }
    return this._http.post(this.url+'create_post',body,{headers:headers})
  }

  get_post_amigos(limit:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'get_post_amigos/'+limit,{headers:headers})
  }

  set_like_post(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'set_like_post',data,{headers:headers})
  }

  set_comentario_post(data:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.post(this.url+'set_comentario_post',data,{headers:headers})
  }

  get_comentarios_post(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'set_like_post/'+id,{headers:headers})
  }

  get_post(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'get_post/'+id,{headers:headers})
  }

  get_post_usuario(username:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'get_post_usuario/'+username,{headers:headers})
  }

  get_photos(username:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'get_photos/'+username,{headers:headers})
  }

  get_widgets_perfil(username:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'get_widgets_perfil/'+username,{headers:headers})
  }

  get_notificaciones(token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'get_notificaciones',{headers:headers})
  }

  set_estado_notificacion(id:any,token:any):Observable<any>{
    let headers = new HttpHeaders({'Content-Type':'application/json','Authorization':token});
    return this._http.get(this.url+'set_estado_notificacion/'+id,{headers:headers})
  }
}
