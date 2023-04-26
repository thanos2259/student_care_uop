import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { RoleModel } from './role.model';
import {AuthService} from '../auth/auth.service';

const API_URL = environment.apiUrl + "/admin/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, public authService: AuthService) { }

  insertRoles(roles: any) {
    const form: RoleModel = roles;
    this.http
      .post<{ message: string }>(API_URL + "insertRoles/", form)
      .subscribe(responseData => {
        console.log(responseData.message);
        location.reload();
      });
  }

  getRoles() {
    return this.http.get(API_URL + '/admin/');
  }

  getUsersWithRoles() {
    return this.http.get(API_URL + 'getUsers/');
  }

  getDepartmentsOfUserByUserID() {
    const userID: number = this.authService.getSessionId();
    return this.http.get(API_URL + 'getDepartmentsOfUserByUserID/' + userID);
  }

  deleteRolesByUserId(userId: number) {
    this.http
      .delete<{ message: string }>(API_URL + 'deleteRolesByUserId/' + userId)
      .subscribe(responseData => {
        console.log(responseData.message);
        location.reload();
      });
  }
}
