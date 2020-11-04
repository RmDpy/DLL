import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable} from "rxjs";
import { map } from "rxjs/operators";
import { Enseignant } from "../assets/classes/enseignant";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<string>;
  private currentUser: Observable<string>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<string>(localStorage.getItem('currentUser'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): String {
    return this.currentUserSubject.value;
  }

  login(email: string, mdp: string) {
    return this.http.post<any>(
      environment.nodeApiUrl + '/api/login', {email, mdp}
    ).subscribe(res => {
      let tk = JSON.stringify(res).split('"')[3];
      localStorage.setItem('currentUser', tk);
      this.currentUserSubject.next(tk);
    })
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
