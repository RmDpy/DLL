import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Observable} from "rxjs";
import { environment } from "../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import jwtDecode, {JwtDecodeOptions} from "jwt-decode";
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string>;
  private currentUser: Observable<string>;
  alert: object;
  isAlertTriggered: boolean;

  constructor(private http: HttpClient, public router: Router, private error: ErrorHandlerService) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): String {
    return this.currentUserSubject.value;
  }

  public getJwtDecode() {
    return jwtDecode(localStorage.getItem('currentUser'));
  }

  public isAuthenticated(): boolean {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('currentUser');
    return !jwtHelper.isTokenExpired(token);
  }

  login(email: string, mdp: string) {
    return this.http.post<any>(environment.nodeApiUrl + '/api/login', {email, mdp})
      .subscribe(res => {
        let tk = JSON.stringify(res).split('"')[3];
        localStorage.setItem('currentUser', tk);
        this.currentUserSubject.next(tk);
        if(this.isAuthenticated() == true){
          this.routing_to_fiche();
        }
      },(err: HttpErrorResponse) => {
        this.isAlertTriggered = true;
        this.alert = this.error.errorHandler(err.status, "GET SEANCE : " + err.statusText); //COMMENT J'UTILISE CETTE SAUCE DANS LE COMPONENT CHEF ALED
      });
  }

  public routing_to_fiche(): void {
    this.router.navigate(['fiche']);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }

  afficherAlerte(text: string){
    this.isAlertTriggered = true;
    return this.alert = this.error.errorHandler(418, text);
  }

}
