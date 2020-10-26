import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Enseignant} from "../assets/classes/enseignant";
import { Etudiant } from "../assets/classes/etudiant";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  activedb: string = "mongo";
  constructor(private http: HttpClient) { }

  public setActivedb(db: string) {
    this.activedb = db;
  }

  getAllEnseignant() {
    return this.http.get(
      environment.nodeApiUrl + "/api/enseignants"
    );
  }

}
