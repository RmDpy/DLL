import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthenticationService } from "./authentication.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authenticationService.currentUserValue;
    let newRequest = req;
    const headerSettings: {[name: string]: string | string[]; } = {};
    for (const key of req.headers.keys()) {
      headerSettings[key] = req.headers.getAll(key);
    }
    if (token) {
      headerSettings['Authorization'] = 'Bearer ' + token;
    }
    const newHeader = new HttpHeaders(headerSettings);
    newRequest = req.clone({
      headers: newHeader
    });
    return next.handle(newRequest);
  }
}
