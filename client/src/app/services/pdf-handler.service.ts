import { Injectable } from '@angular/core';
const { jsPDF } = require("jspdf"); // will automatically load the node version
import 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})

export class PDFHandlerService {

  generateFichePresence(presences: Object, absences: Number, matiere: String, enseignant: String, jour: String, location: String, horaire: String){
    const doc = new jsPDF();
    //Remplir les lignes de la fiche
    var fichePresenceRows = [];
    for (let [etudiant,presence] of Object.entries(presences)) {
      if(presence === true)
        presence = "P";
      else
        presence = "";
      fichePresenceRows.push([etudiant,presence]);
    }
    fichePresenceRows.push(["TOTAL DES ABSENCES", absences]);
    //Generer le titre de la feuille
    doc.autoTable({
      startY: 7,
      styles: { halign: 'center', fillColor: '#E5E5E5', textColor: '#000000' },
      head: [["FICHE DE PRESENCE DU " + jour]],
    })
    //Generer le tableau des infos generales sur la seance actuelle
    doc.autoTable({
      styles: { halign: 'center' },
      theme: 'grid',
      head: [['Matiere', 'Enseignant', 'Lieu', 'Horaire']],
      body: [[matiere, enseignant, location, horaire], ],
    })
    //Generer le tableau correspond à la fiche de présence elle-même
    doc.autoTable({
      didParseCell: data => {  
        if (data.cell.raw === "P"){
          data.cell.styles.fillColor = '#8CD45C';
          data.cell.styles.fontStyle = 'bold';
        }
        if(data.cell.raw === "TOTAL DES ABSENCES" || Number.isInteger(data.cell.raw)){
          data.cell.styles.fillColor = '#900C3F';
          data.cell.styles.textColor = '#FFFFFF';
        }
      },
      styles: { halign: 'center' },
      theme: 'grid',
      head: [['Etudiant', 'Presence']],
      body: fichePresenceRows,
    })
    //Sauvegarder le pdf dans le dossier courant à la racine
    doc.save("table.pdf");
  }
  
}