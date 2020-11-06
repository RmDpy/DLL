import { Component, OnInit } from '@angular/core';
import { Enseignant } from "../../assets/models/enseignant";
import {UtilisateurService} from "../services/utilisateur.service";
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  enseignant: Enseignant;

  constructor(private utilisateurService: UtilisateurService,
              private authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.enseignant = {
      nom: '',
      prenom: '',
      mail: '',
      password: '',
    }
  }

  submit() {
    this.authenticationService.login(this.enseignant.mail, this.enseignant.password);
  }
}
