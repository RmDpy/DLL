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

  etudiantsList$: Etudiant[] = [];
  listeSeance: Seance[] = [];

  enseignantCo: Enseignant;

  dateActuelle: Date;
  formatedDateActuelle: String;
  seanceActuelle: Seance;
  horaireActuel: String;

  prochaineDate: Date;
  formatedProchaineDate: String;
  seanceProchaine: Seance;
  prochainHoraire: String;

  alert: object;
  isAlertTriggered: boolean;
  isDocGeneratedOnce : boolean;

  constructor(
    private utilisateurService: UtilisateurService,
    private authenticationService: AuthenticationService,
    private datepipe: DatePipe,
    private error: ErrorHandlerService,
    private pdf: PDFHandlerService
  ) {}

  ngOnInit(): void {
    const test = this.authenticationService.getJwtDecode();
    this.dateActuelle = new Date();
    this.formatedDateActuelle = this.datepipe.transform(this.dateActuelle, 'dd-MM-yyyy');
    // @ts-ignore
    this.enseignantCo = test.docs;
    this.getSeancesByProf(this.enseignantCo);
    this.seanceActuelle = { prof: "-", summary: "-", dtStart: "-", dtEnd: "-", location: "-", matiere: "-", type: "-", duree: "-" }
    this.seanceProchaine = { prof: "-", summary: "-", dtStart: "-", dtEnd: "-", location: "-", matiere: "-", type: "-", duree: "-" }
    this.horaireActuel = "-";
    this.prochainHoraire = "-";
    this.formatedProchaineDate = "-";
    this.isDocGeneratedOnce = false;
  }

  getSeances(): void {
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        this.listeSeance = s;
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
            this.listeSeance.push(se);
        })
        this.listeSeance.sort(function(a,b){
          if (a.dtStart<b.dtEnd){
            return -1;
          }
          if (a.dtStart>b.dtEnd) {
            return 1;
          }
          return 0;
        })
        this.getSeanceActuelle(prof, this.dateActuelle);
      },(err: HttpErrorResponse) => {
        this.isAlertTriggered = true;
        this.alert = this.error.errorHandler(err.status, "GET SEANCE BY PROF : " + err.statusText);
      });
  }

  getSeanceActuelle(prof: Enseignant, date: Date){
    if(this.listeSeance.length == 0){
      this.isAlertTriggered = true;
      this.alert = this.error.errorHandler(418, "AUCUNE SEANCE N'EXISTE POUR CET ENSEIGNANT");
    } else {
      this.listeSeance.some((se: Seance) => {
        var dateDebActuelle = this.setDateDeb(se);
        var dateEndActuelle = this.setDateEnd(se);
        if(dateEndActuelle < date){
          this.listeSeance.slice(0,1);
        } else {
            this.seanceProchaine = this.listeSeance[0]; //cette variable donne la séance prochaine
            var prochaineDateDeb = this.setDateDeb(this.seanceProchaine);
            var prochaineDateEnd = this.setDateEnd(this.seanceProchaine);
            this.formatedProchaineDate = this.datepipe.transform(prochaineDateDeb, 'dd-MM-yyyy');
            this.prochainHoraire = this.setHoraire(prochaineDateDeb.getHours(), prochaineDateDeb.getMinutes()) + "-" + this.setHoraire(prochaineDateEnd.getHours(), prochaineDateEnd.getMinutes());
          if(dateDebActuelle < date && date < dateEndActuelle) { //CETTE FONCTION EST CALL 48 FOIS EN 1 REQUETE Y A PEUT-ETRE MOYEN DE L'OPTIMISER UN PEU
            this.seanceActuelle = se;
            this.horaireActuel = this.setHoraire(dateDebActuelle.getHours(), dateDebActuelle.getMinutes()) + "-" + this.setHoraire(dateEndActuelle.getHours(), dateEndActuelle.getMinutes());
            this.getEtudiants();
            return true; //sert a stoper le some
          } else {
            this.isAlertTriggered = true;
            this.alert = this.error.errorHandler(418, "AUCUNE SEANCE POUR CE JOUR OU CET HORAIRE");
            return true; //sert à stoper le some
          }
        }
      })
    }
  }
  
  getEtudiants(): void {
    this.utilisateurService.getAllEtudiants()
      .subscribe((e: Etudiant[]) => {
        this.etudiantsList$ = e.sort(function(a,b) {
          if (a.nom<b.nom){
            return -1;
          }
          if (a.nom>b.nom) {
            return 1;
          }
          return 0;
        });
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

  setDateDeb(se: Seance): Date{
    var dateDebSeance = new Date();
    dateDebSeance.setFullYear(parseInt(se.dtStart.substr(0,4)));
    dateDebSeance.setMonth(parseInt(se.dtStart.substr(5,2))-1);
    dateDebSeance.setDate(parseInt(se.dtStart.substr(8,2)));
    dateDebSeance.setHours(parseInt(se.dtStart.substr(11,2)));
    dateDebSeance.setMinutes(parseInt(se.dtStart.substr(14,2)));
    return dateDebSeance;
  }

  setDateEnd(se: Seance): Date{
    var dateEndSeance = new Date();
    dateEndSeance.setFullYear(parseInt(se.dtEnd.substr(0,4)));
    dateEndSeance.setMonth(parseInt(se.dtEnd.substr(5,2))-1);
    dateEndSeance.setDate(parseInt(se.dtEnd.substr(8,2)));
    dateEndSeance.setHours(parseInt(se.dtEnd.substr(11,2)));
    dateEndSeance.setMinutes(parseInt(se.dtEnd.substr(14,2)));
    return dateEndSeance;
  }

  onSubmit(fichePresences: NgForm) {
    var nombreAbsences = 0;
    var presences = fichePresences.value;
    for (let [etudiant,presence] of Object.entries(presences)) {
      if(presence === false || presence === "")
        nombreAbsences++;
    }
    var matiere = this.seanceActuelle.summary;
    var enseignant = this.seanceActuelle.prof;
    var dateJour = this.formatedDateActuelle;
    var lieu = this.seanceActuelle.location;
    var horaire = this.horaireActuel;

    if(nombreAbsences === 29){
      if (confirm ("Aucune case de la fiche n'est cochée. Souhaitez-vous continuer ?")){
        this.pdf.generateFichePresence(presences, nombreAbsences, matiere, enseignant, dateJour, lieu, horaire);
        this.isDocGeneratedOnce = true;
      }
    } else {
      this.pdf.generateFichePresence(presences, nombreAbsences, matiere, enseignant, dateJour, lieu, horaire);
      this.isDocGeneratedOnce = true;
    }
  }

  logOut(): void {
    this.authenticationService.logout();
  }

}
