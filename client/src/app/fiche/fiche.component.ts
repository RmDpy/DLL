import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from "../services/utilisateur.service";
import { Etudiant } from "../../assets/models/etudiant";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.css']
})
export class FicheComponent implements OnInit {
  etudiantsList$: Etudiant[] = [];
  headers = ["Prenom", "Nom"];
  etudiants: Etudiant;

  constructor(private utilisateurService: UtilisateurService, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    console.log(this.utilisateurService.getSeanceFromVT());
    this.getEtudiants();
    this.etudiants = {
      nom: '',
      prenom: ''
    }
  }

  getEtudiants(): void {
    this.utilisateurService.getAllEtudiants()
      .subscribe((e: Etudiant[]) => {
        this.etudiantsList$ = e;
        //this.etudiants = [ ...e] pour paginer les resultats
      },error => {
          console.log(error);
        }
      )
  }

  logOut() {
    this.authenticationService.logout();
  }

}
