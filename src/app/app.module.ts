import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentComponent } from './students/student/student.component';
import { HomeComponent } from './home-screen/home/home.component';
import { StudentProfileComponent } from './students/student-profile/student-profile.component';
import { ManualsComponent } from './generic-components/manuals/manuals.component';
import { AboutComponent } from './generic-components/about/about.component';
import { StudentHomeComponent } from './students/student-home/student-home.component';
import { StudentLoginTermsComponent } from './home-screen/student-login-terms/student-login-terms.component';
import { HomeButtonsComponent } from './home-screen/home-buttons/home-buttons.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyLoginTermsComponent } from './home-screen/company-login-terms/company-login-terms.component';
import { CredentialsGenericLoginComponent } from './home-screen/credentials-generic-login/credentials-generic-login.component';
import { DataTablesModule } from 'angular-datatables';
import { ContactComponent } from './generic-components/contact/contact.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { accommodationComponent } from './students/accommodation/accommodation.component';
import { CredentialsGenericSignupComponent } from './home-screen/credentials-generic-signup/credentials-generic-signup.component';
import { HomeHeaderComponent } from './home-screen/home-header/home-header.component';
import { UopLoadingScreenComponent } from './generic-components/uop-loading-screen/uop-loading-screen.component';
import { PasswordResetComponent } from './home-screen/password-reset/password-reset.component';
import { UsersFooterComponent } from './generic-components/users-footer/users-footer.component';
import { MealsComponent } from './students/meals/meals.component';
import { ApplicationsComponent } from './students/applications/applications.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    HomeComponent,
    StudentProfileComponent,
    ManualsComponent,
    AboutComponent,
    StudentHomeComponent,
    StudentLoginTermsComponent,
    HomeButtonsComponent,
    CompanyLoginTermsComponent,
    CredentialsGenericLoginComponent,
    ContactComponent,
    accommodationComponent,
    CredentialsGenericSignupComponent,
    HomeHeaderComponent,
    UopLoadingScreenComponent,
    PasswordResetComponent,
    UsersFooterComponent,
    MealsComponent,
    ApplicationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MaterialFileInputModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    MatStepperModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
