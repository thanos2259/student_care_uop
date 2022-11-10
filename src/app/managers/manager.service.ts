import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Manager } from "./manager.model";

@Injectable({ providedIn: 'root' })
export class ManagerService {
    public manager: Manager[] = [];

    constructor(private http: HttpClient, public authService: AuthService) { }

    getManager(): Observable<Array<Manager>> {
        let id = this.authService.getSessionId();
        const fetchedManager = this.http.get<Array<Manager>>('http://localhost:3000/api/managers/getmanager/' + id);
        return fetchedManager;
    }

}