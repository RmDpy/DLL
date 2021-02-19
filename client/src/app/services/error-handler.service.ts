import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

 onTriggeringAlert(problemMessage): object {
    var alert = { text: problemMessage };
    return alert;
  }

  errorHandler(type: Number, message: String): object {
    switch(type) { 
      case 400: { 
        return this.onTriggeringAlert('Erreur '+type+' ('+message+')');
      } 
      case 401: { 
        return this.onTriggeringAlert('Erreur '+type+' ('+message+')');
      }
      case 403: { 
        return this.onTriggeringAlert('Erreur '+type+' ('+message+')');
      }
      case 404: { 
        return this.onTriggeringAlert('Erreur '+type+' ('+message+')');
      }
      case 500: { 
        return this.onTriggeringAlert('Erreur '+type+' ('+message+')');
      }
      case 418: { 
        return this.onTriggeringAlert('Erreur '+type+' (Custom) - ' + message); //Les alertes customs hors HTTP res de l'application
      }         
      default: { 
        return this.onTriggeringAlert('Erreur '+type+' ('+message+' | API ou APP inactive ?)');
      } 
    } 
  }
}