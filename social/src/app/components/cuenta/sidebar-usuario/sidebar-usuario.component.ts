import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-usuario',
  templateUrl: './sidebar-usuario.component.html',
  styleUrls: ['./sidebar-usuario.component.css']
})
export class SidebarUsuarioComponent implements OnInit {

  public user: any = {};

  constructor() { 
    this.user = JSON.parse(localStorage.getItem('user')!);
  }

  ngOnInit(): void {
  }

}
