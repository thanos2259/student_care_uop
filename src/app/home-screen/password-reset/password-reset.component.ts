import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  @ViewChild('email') emailInput!: ElementRef;
  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  onResetSuccess() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Σας έχει σταλθεί νέος κωδικός πρόσβασης στο email σας!',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  onResetFail() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Λάθος email χρήστη',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    })
  }

  submitResetPassword() {

  }
}
