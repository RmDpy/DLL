import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from "../services/utilisateur.service";
import { Etudiant } from "../../assets/models/etudiant";
import { Seance } from "../../assets/models/seance";
import { Enseignant} from "../../assets/models/enseignant";
import { AuthenticationService } from "../services/authentication.service";
import jspdf from "jspdf";
import {FormsModule} from "@angular/forms";
import * as jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {observable} from "rxjs";
import DateTimeFormat = Intl.DateTimeFormat;
import {getLocaleDateTimeFormat} from "@angular/common";


@Component({
  selector: 'app-fiche',
  templateUrl: './fiche.component.html',
  styleUrls: ['./fiche.component.css']
})

export class FicheComponent implements OnInit {
  etudiantsListValid: Etudiant[] = [];
  etudiantsList$: Etudiant[] = [];
  headers = ["Prenom", "Nom"];
  etudiants: Etudiant;
  seancesList$: Seance[] = [];
  enseignantCo: Enseignant;
  seanceActuelle: Seance;
  date = new Date();

  constructor(private utilisateurService: UtilisateurService, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.getEtudiants()
    const test = this.authenticationService.getJwtDecode();
    // @ts-ignore
    this.enseignantCo = test.docs;
    this.getSeanceActuelle(this.enseignantCo, this.date);
    this.etudiants = {
      nom: '',
      prenom: '',
      presence: false
    }
  }



  getSeances(): void {
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        this.seancesList$ = s;
      }, error => {
        console.log(error);
        }
      )
  }

  getSeancesByProf(prof: Enseignant) {
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        s.forEach( (se: Seance) => {
          if(se.prof == prof.nom){
            this.seancesList$.push(se);
          }
        })
      })
  }
  getSeanceActuelle(prof: Enseignant, date: Date){
    this.utilisateurService.getAllSeances()
      .subscribe( (s: Seance[]) => {
        s.forEach( (se: Seance) => {
          if(se.prof == prof.nom){
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
            if(dateDeb < date && date < dateEnd) {
              this.seanceActuelle = se;
              console.log(se);
            }
          }else{
          }
        })
      })
  }

  getEtudiants(): void {
    this.utilisateurService.getAllEtudiants()
      .subscribe((e: Etudiant[]) => {
        this.etudiantsList$ = e;
        //this.etudiants = [ ...e] pour paginer les resultats
      },error => {
          console.log(error);
        }
      )
  }

  formatEtudiantList(etudiantsList$){
    var etudiantsnames = [];
    this.etudiantsList$.forEach(function(etudiant){
      etudiantsnames.push({text : etudiant.nom+'\n',margin : [0,0,0,10]});
    })
    return etudiantsnames;
  }


  getEtudiantsListValid(){
    return this.etudiantsListValid;
  }

  validForm(): void {
  }

  logOut() {
    this.authenticationService.logout();
  }
/*
  generatePDF() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas =>{
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      let position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF
    })


  }

*/




/*
  generatePdf(){
    // @ts-ignore
    const documentDefinition = {content :[
      {
        text: 'fiche appel',
        bold: true,
        fontsize: 20,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      },
      {
        text: this.date,
        bold: true,
        fontsize: 15,
        alignment: 'Right',
        margin: [0, 0, 0, 20]
      },
        {
          columns: [
            [{
              text : 'ETUDIANTS',
              style: 'title',
              margin:[0, 0, 0, 20]
            },
              {text : this.formatEtudiantList(this.etudiantsList$)



              },
              {




              }
              ],
              [{
              text : 'H1-H2',
                style: 'name'
              }],
              [{
                text : 'H2-H3',
                style: 'name'
              }],
              [{
                text : 'H3-H4',
                style: 'name'
              }],
              [{
                text : 'H4-H4',
                style: 'name'
              }
            ],
           ]
        }],
    };
    pdfMake.createPdf(documentDefinition).open();
  }
*/



}
