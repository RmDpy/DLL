import { Injectable } from '@angular/core';
import { HttpClient} from "@angular/common/http";
import { HttpHeaders } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {

  }

  getSeanceFromVT(){
    this.http.get(
      'http://146.59.195.214:8006/api/v1/calendar/events-by-group/m2miaa')
      .subscribe(res => {
        const listSeance = res;
        return listSeance;
      }, error => {
        console.log(error);
      })
  }

  getAllSeances() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authenticationService.currentUserValue
      })
    };
    return this.http.get(
      environment.nodeApiUrl + '/api/getSeance', httpOptions
    )
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

}



