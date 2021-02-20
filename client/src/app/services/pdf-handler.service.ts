import { Injectable } from '@angular/core';
const { jsPDF } = require("jspdf"); // will automatically load the node version
import 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})

export class PDFHandlerService {

  generateFichePresence(presences: Object, matiere: String, enseignant: String, jour: String, location: String, horaire: String){
    const doc = new jsPDF();
    //Remplir les lignes de la fiche
    var fichePresenceRows = [];
    for (let [etudiant,presence] of Object.entries(presences)) {
      if(presence === true)
        presence = "P";
      fichePresenceRows.push([etudiant,presence]);
    }
    //Generer le titre de la feuille
    doc.text("FICHE DE PRESENCE DU " + jour + "\n", 10, 10);
    //Generer le tableau des infos generales sur la seance actuelle
    doc.autoTable({
      styles: { halign: 'center' },
      theme: 'grid',
      head: [['Matiere', 'Enseignant', 'Lieu', 'Horaire']],
      body: [[matiere, enseignant, location, horaire], ],
    })
    //Generer le tableau correspond à la fiche de présence elle-même
    doc.autoTable({
      styles: { halign: 'center' },
      theme: 'grid',
      head: [['Etudiant', 'Presence']],
      body: fichePresenceRows,
    })
    //Sauvegarder le pdf dans le dossier courant à la racine
    doc.save("table.pdf");
  }
  
}