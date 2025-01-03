import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./_guards/auth.guard";
import { LoginGuard } from "./_guards/login.guard";
import { ResetPassowrdComponent } from "./components/reset-passowrd/reset-passowrd.component";
import { UpdatePassowrdComponent } from "./components/update-passowrd/update-passowrd.component";
import { InscriptionComponent } from "./components/inscription/inscription.component";
import { HomeComponent } from "./components/home/home.component";
import { RoleGuard } from "./_guards/role.guard";


const routes: Routes = [
  // Redirection initiale vers la page de connexion
  { path: "", redirectTo: "/connexion", pathMatch: "full" },

  // Connexion et gestion des mots de passe
  {path: "connexion", component: LoginComponent, canActivate: [LoginGuard] },
  {path: "inscription", component: InscriptionComponent },
  {path: "mot-de-passe-oublie",component: ResetPassowrdComponent,canActivate: [LoginGuard],},
  {path: "reinitialisation/:token", component: UpdatePassowrdComponent },
  { path: "home", component: HomeComponent, canActivate: [RoleGuard] },





  // Route 404 pour gérer les pages non existantes
  { path: "**", redirectTo: "/connexion" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
