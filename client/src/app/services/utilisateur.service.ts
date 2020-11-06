import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {

  }


  getAllEtudiants() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authenticationService.currentUserValue
      })
    };
    return this.http.get(
      environment.nodeApiUrl + '/api/getEtudiants', httpOptions
    );
  }

  getUser() {
    const httpOptions = {
      headers: new HttpHeaders(({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authenticationService.currentUserValue
      }))
    };
    return this.http.get(
      environment.nodeApiUrl + '/api/compteUser', httpOptions
    ).subscribe(res => {
      const test = "";
    })
  }
}



