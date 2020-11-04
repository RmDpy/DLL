import { Component, OnInit } from '@angular/core';
import { Enseignant } from "../../assets/classes/enseignant";
import {UtilisateurService} from "../utilisateur.service";
import { AuthenticationService } from "../authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  enseignantsList$: Enseignant[] = [];
  enseignant: Enseignant;

  constructor(private utilisateurService: UtilisateurService,
              private authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {

    //this.getEnseignants();
    this.enseignant = {
      nom: '',
      prenom: '',
      mail: '',
      password: '',
    }
  }

  /*getEnseignants(): void {
    this.utilisateurService.getAllEnseignant()
      .subscribe((e: Enseignant[]) => {
        this.enseignantsList$ = e;
        //this.enseignants = [ ...e] pour paginer
      },
        error => {
        console.log(error)
        });
  }*/


  submit() {
    this.authenticationService.login(this.enseignant.mail, this.enseignant.password);
  }

  testGet() {
    console.log(this.utilisateurService.getAllEnseignant());
  }
}
