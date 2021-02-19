import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from "../services/utilisateur.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from "../services/authentication.service";
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  alert: object;
  isAlertTriggered: boolean;

  constructor(private utilisateurService: UtilisateurService, private authenticationService: AuthenticationService, private error: ErrorHandlerService) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {}

  isValid(controlName) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  login() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password);
      if(this.authenticationService.isAuthenticated()){
        this.authenticationService.routing_to_fiche();
      } else {
        this.isAlertTriggered = true;                             
        this.alert = this.error.errorHandler(418, "IDENTIFIANTS INVALIDES");
      }
    } else {
      this.isAlertTriggered = true;                             
      this.alert = this.error.errorHandler(418, "FORMULAIRE INVALIDE");
    }
  }
}
