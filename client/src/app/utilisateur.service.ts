import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { AuthenticationService} from "./authentication.service";
import { Enseignant} from "../assets/classes/enseignant";
import { Etudiant } from "../assets/classes/etudiant";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  constructor(private http: HttpClient,
              private authenticationService : AuthenticationService) { }


  getAllEnseignant() {
    return this.http.get(
      environment.nodeApiUrl + "/api/enseignants"
    );
  }



}
