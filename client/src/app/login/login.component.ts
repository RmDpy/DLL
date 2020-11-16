import { Component, OnInit } from '@angular/core';
import { Enseignant } from "../../assets/models/enseignant";
import { UtilisateurService } from "../services/utilisateur.service";
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from "../services/authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private utilisateurService: UtilisateurService, private authenticationService: AuthenticationService) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void { }

  isValid(controlName) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  login() {
    if (this.loginForm.valid) {
      this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password);
    }
  }
}
