import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public search = '';
  public token = localStorage.getItem('token');
  public load_data = true;
  public usuarios : Array<any> = [];
  public url = GLOBAL.url;

  constructor(
    private _route:ActivatedRoute,
    private _usuarioService:UsuarioService
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(
      (params:any)=>{
       
        this.search = params['search'];
        this.init_data();
      }
    );
  }

  init_data(){
    this.load_data = true;
    this._usuarioService.obtener_usuarios(this.search,this.token).subscribe(
      response=>{
        this.usuarios = response.data;
        for(var item of this.usuarios){
          if(item.avatar == 'defecto.png') item.avatar = 'assets/images/usuario.png';
          else if(item.avatar != 'defecto.png') item.avatar = this.url + 'obtener_portada_img/'+item.avatar;
        }
        console.log(this.usuarios);
        
        this.load_data = false;
      }
    );
  }

}
