import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from "../services/utilisateur.service";
import { Etudiant } from "../../assets/models/etudiant";
import { Seance } from "../../assets/models/seance";
import { Enseignant} from "../../assets/models/enseignant";
import { AuthenticationService } from "../services/authentication.service";
import {observable} from "rxjs";

@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.css']
})
export class FicheComponent implements OnInit {
  etudiantsListValid: Etudiant[] = [];
  etudiantsList$: Etudiant[] = [];
  headers = ["Prenom", "Nom"];
  etudiants: Etudiant;
  seancesList$: Seance[] = [];
  enseignantCo: Enseignant;


  constructor(private utilisateurService: UtilisateurService, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getEtudiants()
    this.getSeances();
    const test = this.authenticationService.getJwtDecode().
    console.log(test);
    this.etudiants = {
      nom: '',
      prenom: '',
      presence: false
    }
  }



  getSeances(): void {
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        this.seancesList$ = s;
      }, error => {
        console.log(error);
        }
      )
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

  getEtudiantsListValid(){
    return this.etudiantsListValid;
  }

  validForm(): void {
  }

  logOut() {
    this.authenticationService.logout();
  }

}
