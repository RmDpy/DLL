import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from "../services/utilisateur.service";
import { Etudiant } from "../../assets/models/etudiant";
import { Seance } from "../../assets/models/seance";
import { Enseignant} from "../../assets/models/enseignant";
import { AuthenticationService } from "../services/authentication.service";
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ErrorHandlerService } from '../services/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PDFHandlerService } from '../services/pdf-handler.service';

@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.css']
})

export class FicheComponent implements OnInit {
  todayDate: Date;
  formatedDate: String;
  etudiantsList$: Etudiant[] = [];
  seancesList$: Seance[] = [];
  seanceActuelle: Seance;
  seanceHoraire: String;
  enseignantCo: Enseignant;
  alert: object;
  isAlertTriggered: boolean;

  constructor(
    private utilisateurService: UtilisateurService, 
    private authenticationService: AuthenticationService, 
    private datepipe: DatePipe, 
    private error: ErrorHandlerService,
    private pdf: PDFHandlerService
  ) {}

  ngOnInit(): void {
    const test = this.authenticationService.getJwtDecode();
    this.todayDate = new Date();
    this.formatedDate = this.datepipe.transform(this.todayDate, 'dd-MM-yyyy');
    // @ts-ignore
    this.enseignantCo = test.docs;
    this.getSeanceActuelle(this.enseignantCo, this.todayDate);
    this.seanceActuelle = { prof: "-", summary: "-", dtStart: "-", dtEnd: "-", location: "-", matiere: "-", type: "-", duree: "-" }
    this.seanceHoraire = "-";
  }

  getSeances(): void {
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        this.seancesList$ = s;
      },(err: HttpErrorResponse) => {
        this.isAlertTriggered = true;                             
        this.alert = this.error.errorHandler(err.status, "GET SEANCE : " + err.statusText);
      });
  }

  getSeancesByProf(prof: Enseignant) {
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        s.forEach( (se: Seance) => {
          if(se.prof === prof.nom)
            this.seancesList$.push(se);
        })
      },(err: HttpErrorResponse) => {
        this.isAlertTriggered = true;                             
        this.alert = this.error.errorHandler(err.status, "GET SEANCE BY PROF : " + err.statusText);
      });
  }

  getSeanceActuelle(prof: Enseignant, date: Date){
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        s.forEach( (se: Seance) => {
          if(se.prof === prof.nom){
            var dateDeb = new Date();
            dateDeb.setFullYear(parseInt(se.dtStart.substr(0,4)));
            dateDeb.setMonth(parseInt(se.dtStart.substr(5,2))-1);
            dateDeb.setDate(parseInt(se.dtStart.substr(8,2)));
            dateDeb.setHours(parseInt(se.dtStart.substr(11,2)));
            dateDeb.setMinutes(parseInt(se.dtStart.substr(14,2)));
            var dateEnd = new Date();
            dateEnd.setFullYear(parseInt(se.dtEnd.substr(0,4)));
            dateEnd.setMonth(parseInt(se.dtEnd.substr(5,2))-1);
            dateEnd.setDate(parseInt(se.dtEnd.substr(8,2)));
            dateEnd.setHours(parseInt(se.dtEnd.substr(11,2)));
            dateEnd.setMinutes(parseInt(se.dtEnd.substr(14,2)));
            if(dateDeb < date && date < dateEnd) { //CETTE FONCTION EST CALL 48 FOIS EN 1 REQUETE Y A PEUT-ETRE MOYEN DE L'OPTIMISER UN PEU LMAO
              this.seanceActuelle = se;
              this.seanceHoraire = this.setHoraire(dateDeb.getHours(), dateDeb.getMinutes()) + "-" + this.setHoraire(dateEnd.getHours(), dateEnd.getMinutes());
              this.getEtudiants();
            } else {
              this.isAlertTriggered = true;                             
              this.alert = this.error.errorHandler(418, "AUCUNE SEANCE POUR CE JOUR OU CET HORAIRE");
            }
          } else {
            this.isAlertTriggered = true;                             
            this.alert = this.error.errorHandler(418, "AUCUNE SEANCE N'EXISTE POUR CET ENSEIGNANT");
          }
        })
      },(err: HttpErrorResponse) => {
        this.isAlertTriggered = true;                             
        this.alert = this.error.errorHandler(err.status, "GET SEANCE ACTUELLE : " + err.statusText);
      });
  }

  getEtudiants(): void {
    this.utilisateurService.getAllEtudiants()
      .subscribe((e: Etudiant[]) => {
        this.etudiantsList$ = e;
      },(err: HttpErrorResponse) => {
        this.isAlertTriggered = true;                             
        this.alert = this.error.errorHandler(err.status, "GET ETUDIANTS : " + err.statusText);
      });
  }

  setHoraire(hour: Number, minu:Number): String {
    var properHour = String(hour);
    var properMinute = String(minu);
    if(properHour === "0")
      properHour = properHour + "0";
    if(properMinute === "0")
      properMinute = properMinute + "0";
    return properHour + "h" + properMinute;
  }

  onSubmit(fichePresences: NgForm) {
    var presences = fichePresences.value;
    var matiere = this.seanceActuelle.summary;
    var enseignant = this.seanceActuelle.prof;
    var dateJour = this.formatedDate;
    var lieu = this.seanceActuelle.location;
    var horaire = this.seanceHoraire;
    this.pdf.generateFichePresence(presences, matiere, enseignant, dateJour, lieu, horaire);
  }

  logOut(): void {
    this.authenticationService.logout();
  }

}