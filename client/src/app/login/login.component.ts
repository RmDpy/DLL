import { Component, OnInit } from '@angular/core';
import {Enseignant} from "../../assets/classes/enseignant";
import {UtilisateurService} from "../utilisateur.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  enseignants: Object;

  constructor(private utilisateurService: UtilisateurService) { }

  ngOnInit(): void {
    this.getEnseignants();
  }

  getEnseignants(): void {
    this.utilisateurService.getAllEnseignant()
      .subscribe(e => this.enseignants = e);
  }

}
