import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { PostService } from 'src/app/services/post.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-fotos-perfil',
  templateUrl: './fotos-perfil.component.html',
  styleUrls: ['./fotos-perfil.component.css']
})
export class FotosPerfilComponent implements OnInit {

  public load_data = false;
  public data = false;
  public token = localStorage.getItem('token');
  public username = '';
  public user: any = {};
  public url = GLOBAL.url;

  public fotos : Array<any> = [];

  constructor(
    private _userService:UsuarioService,
    private _route:ActivatedRoute,
    private _postService:PostService
  ) { 
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params=>{
        this.username = params['username'];
        this.init_data();
      }
    );
  }


  init_data(){
    this.load_data = true;
    this._postService.get_photos(this.username,this.token).subscribe(
      response=>{
        
        if(response.data != undefined){
          console.log(response);
          this.fotos = response.data;
          this.data = true;
        }else{
          this.data = false;
        }

        this.load_data = false;
      }
    );
  }


}
