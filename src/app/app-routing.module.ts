import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-screen/home/home.component';
import { ManagerComponent } from './managers/manager/manager.component';
import { StudentComponent } from './students/student/student.component';
import { StudentLoginTermsComponent } from './home-screen/student-login-terms/student-login-terms.component';
import { AdminPanelComponent } from './admin-panels/admin-panel/admin-panel.component';
import { AdminPanelLoginComponent } from './admin-panels/admin-panel-login/admin-panel-login.component';
import { ContactComponent } from './generic-components/contact/contact.component';
import { ManualsComponent } from './generic-components/manuals/manuals.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
},
{
  path: 'contact',
  component: ContactComponent
},
{
  path: 'manuals',
  component: ManualsComponent
},
{
  path: 'terms',
  component: HomeComponent
},
{
  path: 'company-terms',
  component: HomeComponent
},
{
  path: 'credentials-generic',
  component: HomeComponent
},
{
  path: 'student',
  children: [{
    path: ':id',
    component: StudentComponent
  },
  {
    path: 'login/:token/:uuid',
    component: StudentComponent
  },
  {
    path: 'terms/:id',
    component: StudentLoginTermsComponent
  },
  {
    path: 'profile/:id',
    component: StudentComponent
  },
  {
    path: 'accommodation/:id',
    component: StudentComponent
  },
  {
    path: 'meals/:id',
    component: StudentComponent
  },
  {
    path: 'applications/:id',
    component: StudentComponent
  },
  {
    path: 'manuals',
    component: StudentComponent
  },
  {
    path: 'about',
    component: StudentComponent
  },
  {
    path: 'contact',
    component: StudentComponent
  },
  {
    path: 'questions/:id',
    component: StudentComponent
  },
  {
    path: 'qna',
    component: StudentComponent
  }
  ]
},
{
  path: 'manager',
  children: [{
    path: ':id',
    component: ManagerComponent
  },
  {
    path: 'accommodation/:id',
    component: ManagerComponent
  },
  {
    path: 'meals/:id',
    component: ManagerComponent
  },
  {
    path: 'manuals',
    component: StudentComponent
  },
  {
    path: 'about',
    component: StudentComponent
  },
  {
    path: 'contact',
    component: StudentComponent
  },
  {
    path: 'questions/:id',
    component: ManagerComponent
  },
  {
    path: 'qna',
    component: ManagerComponent
  },
  {
    path: 'stats/:id',
    component: ManagerComponent
  }
  ]
},
{
  path: 'admin',
  children: [{
    path: ':id',
    component: AdminPanelComponent
  },
  {
    path: '',
    component: AdminPanelLoginComponent
  },
  {
    path: 'login/:token/:uuid',
    component: AdminPanelComponent
  }]
}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
