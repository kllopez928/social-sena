import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { routing } from "./app.routing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { SidebarUsuarioComponent } from './components/cuenta/sidebar-usuario/sidebar-usuario.component';
import { ConfiguracionUsuarioComponent } from './components/cuenta/configuracion-usuario/configuracion-usuario.component';
import { PasswordUsuarioComponent } from './components/cuenta/password-usuario/password-usuario.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { InvitacionesUsuarioComponent } from './components/cuenta/invitaciones-usuario/invitaciones-usuario.component';
import { CardPerfilComponent } from './components/card-perfil/card-perfil.component';
import { CardHistoriasComponent } from './components/card-historias/card-historias.component';
import { CardUsuariosComponent } from './components/card-usuarios/card-usuarios.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';

import {AutosizeModule} from 'ngx-autosize';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { InfoPerfilComponent } from './components/perfil/info-perfil/info-perfil.component';
import { PostsPerfilComponent } from './components/perfil/posts-perfil/posts-perfil.component';
import { FotosPerfilComponent } from './components/perfil/fotos-perfil/fotos-perfil.component';
import { WidgetsPerfilComponent } from './components/perfil/widgets-perfil/widgets-perfil.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    RegistroComponent,
    LoginComponent,
    SidebarUsuarioComponent,
    ConfiguracionUsuarioComponent,
    PasswordUsuarioComponent,
    ResetPasswordComponent,
    DateAgoPipe,
    InvitacionesUsuarioComponent,
    CardPerfilComponent,
    CardHistoriasComponent,
    CardUsuariosComponent,
    UsuariosComponent,
    PostDetailComponent,
    InfoPerfilComponent,
    PostsPerfilComponent,
    FotosPerfilComponent,
    WidgetsPerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    routing,
    FormsModule,
    HttpClientModule,
    AutosizeModule,
    InfiniteScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
