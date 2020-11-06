import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {JwtHelperService} from "@auth0/angular-jwt";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string>;
  private currentUser: Observable<string>;

  constructor(private http: HttpClient,
              public router: Router) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): String {
    return this.currentUserSubject.value;
  }

  public isAuthenticated(): boolean {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('currentUser');
    return !jwtHelper.isTokenExpired(token);
  }

  login(email: string, mdp: string) {
    return this.http.post<any>(
      environment.nodeApiUrl + '/api/login', {email, mdp}
    ).subscribe(res => {
      let tk = JSON.stringify(res).split('"')[3];
      localStorage.setItem('currentUser', tk);
      this.currentUserSubject.next(tk);
      this.router.navigate(['fiche']);
    })
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }
}
