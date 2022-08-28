import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-credentials-generic-signup',
  templateUrl: './credentials-generic-signup.component.html',
  styleUrls: ['./credentials-generic-signup.component.css']
})
export class CredentialsGenericSignupComponent implements OnInit {
  @ViewChild('AFMInput') afmInput!: ElementRef;
  @ViewChild('password') password!: ElementRef;
  @ViewChild('repeatPassword') repeatPassword!: ElementRef;

  isLoading: boolean = false;
  passwordsNotMatch: string = "";

  constructor(public dialog: MatDialog, public authService: AuthService) { }

  ngOnInit(): void { }

  rememberMe() { }

  passwordToggle(state: string, id: string) {
    const inputPassword = document.getElementById(id);
    const togglePasswordBtn = document.getElementById(state)!;
    let passwordType = inputPassword?.getAttribute('type');

    const type = passwordType === 'password' ? 'text' : 'password';
    inputPassword?.setAttribute('type', type);
    // toggle the eye / eye slash icon
    togglePasswordBtn.classList?.toggle('fa-eye-slash');
  }

  onBlur(): void {

  }

  validate(vat: string) {
    if (!Utils.isEmptyOrWhiteSpace(vat) && !Utils.TaxNumRule(vat)) this.onErrorVatRule();
  }

  onSubmitCompanyDetails(data: any) {
  }

  //check if passwords are the same
  checkIfPasswordsMatch() {
    if (this.password?.nativeElement.value == this.repeatPassword?.nativeElement.value) {
      this.passwordsNotMatch = "";
    } else {
      this.passwordsNotMatch = "GENERIC.PASSWORDS-NOT-MATCH";
    }
  }

  validatePasswords() {
    if (this.passwordsNotMatch != null && this.passwordsNotMatch != "") {
      alert("Passwords do not match");
      return false;
    }
    return true;
  }

  onError() {
    Swal.fire({
      title: 'Σφάλμα',
      text: 'Το username χρησιμοποείται ήδη',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  onErrorVatRule() {
    Swal.fire({
      title: 'Σφάλμα',
      text: 'Το ΑΦΜ δεν είναι έγκυρο',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  openDialog(data: any[]) {

  }

}
