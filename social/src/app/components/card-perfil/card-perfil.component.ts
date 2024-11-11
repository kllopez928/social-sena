import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';

@Component({
  selector: 'app-card-perfil',
  templateUrl: './card-perfil.component.html',
  styleUrls: ['./card-perfil.component.css']
})
export class CardPerfilComponent implements OnInit {

  public user : any = JSON.parse(localStorage.getItem('user')!);
  public avatar = '';
  public portada = '';
  public url = GLOBAL.url;

  constructor() { }

  ngOnInit(): void {
    if(this.user.avatar == 'defecto.png') this.avatar = 'assets/images/usuario.png';
    else if(this.user.avatar != 'defecto.png') this.avatar = this.url + 'obtener_portada_img/'+this.user.avatar;
     
    if(!this.user.portada) this.portada = 'assets/images/portada.jpg';
    else if(this.user.portada) this.portada = this.url + 'obtener_portada_img/'+this.user.portada;
  }

}
