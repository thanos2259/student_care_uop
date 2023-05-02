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
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { ContactComponent } from './generic-components/contact/contact.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { accommodationComponent } from './students/accommodation/accommodation.component';
import { HomeHeaderComponent } from './home-screen/home-header/home-header.component';
import { UopLoadingScreenComponent } from './generic-components/uop-loading-screen/uop-loading-screen.component';
import { UsersFooterComponent } from './generic-components/users-footer/users-footer.component';
import { MealsComponent } from './students/meals/meals.component';
import { ApplicationsComponent } from './students/applications/applications.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { StudentLoginTermsDialogComponent } from './home-screen/student-login-terms-dialog/student-login-terms-dialog.component';
import { ManagerComponent } from './managers/manager/manager.component';
import { ManagerHomeComponent } from './managers/manager-home/manager-home.component';
import { AccommodationComponent } from './managers/manager-accommodation/manager-accommodation.component';
import { ManagerMealsComponent } from './managers/manager-meals/manager-meals.component';
import { CommentsDialogComponent } from './managers/comments-dialog/comments-dialog.component';
import { StudentCommentsDialogComponent } from './students/student-comments-dialog/student-comments-dialog.component';
import { EditNotesDialogComponent } from './managers/edit-notes-dialog/edit-notes-dialog.component';
import { AppViewDialogComponent } from './managers/app-view-dialog/app-view-dialog.component';
import { StudentViewDialogComponent } from './managers/student-view-dialog/student-view-dialog.component';
import { AppViewDialogAccommodationComponent } from './managers/app-view-dialog-accommodation/app-view-dialog-accommodation.component';
import { AdminPanelComponent } from './admin-panels/admin-panel/admin-panel.component';
import { AdminPanelLoginComponent } from './admin-panels/admin-panel-login/admin-panel-login.component';
import { QnaComponent } from './generic-components/qna/qna.component';
import { StudentQuestionsComponent } from './students/student-questions/student-questions.component';
import { QuestionsAnswersComponent } from './managers/questions-answers/questions-answers.component';
import { QuestionAnswerDialogComponent } from './managers/question-answer-dialog/question-answer-dialog.component';
import { StudentViewMinimalInfoDialogComponent } from './managers/student-view-minimal-info-dialog/student-view-minimal-info-dialog.component';

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
    ContactComponent,
    accommodationComponent,
    HomeHeaderComponent,
    UopLoadingScreenComponent,
    UsersFooterComponent,
    MealsComponent,
    ApplicationsComponent,
    StudentLoginTermsDialogComponent,
    ManagerComponent,
    ManagerHomeComponent,
    AccommodationComponent,
    ManagerMealsComponent,
    CommentsDialogComponent,
    StudentCommentsDialogComponent,
    EditNotesDialogComponent,
    AppViewDialogComponent,
    StudentViewDialogComponent,
    AppViewDialogAccommodationComponent,
    AdminPanelComponent,
    AdminPanelLoginComponent,
    QnaComponent,
    StudentQuestionsComponent,
    QuestionsAnswersComponent,
    QuestionAnswerDialogComponent,
    StudentViewMinimalInfoDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatRadioModule,
    MatExpansionModule,
    MatInputModule,
    MaterialFileInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    MatStepperModule,
    MatDialogModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    DataTablesModule,
    MatTableModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
