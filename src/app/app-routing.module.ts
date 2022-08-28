import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home-screen/home/home.component';
import { StudentComponent } from './students/student/student.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
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
  path: 'credentials-generic-signup',
  component: HomeComponent
},
{
  path: 'password-reset',
  component: HomeComponent
},
{
  path: 'student',
  children: [{
    path: ':id',
    component: StudentComponent
  },
  {
    path: 'profile/:id',
    component: StudentComponent
  },
  {
    path: 'enable_intern/:id',
    component: StudentComponent
  },
  {
    path: 'myinternship/:id',
    component: StudentComponent
  },
  {
    path: 'positions/:id',
    component: StudentComponent
  },
  {
    path: 'about',
    component: StudentComponent
  },
  {
    path: 'manuals',
    component: StudentComponent
  },
  {
    path: 'calendar',
    component: StudentComponent
  },
  {
    path: 'sheets',
    component: StudentComponent,
    children: [
      {
        path: ':id',
        component: StudentComponent
      },
      {
        path: 'input-sheet/:id',
        component: StudentComponent
      },
      {
        path: 'output-sheet/:id',
        component: StudentComponent
      },
      {
        path: 'input-sheet-preview/:id',
        component: StudentComponent
      },
      {
        path: 'evaluation-form/:id',
        component: StudentComponent
      }]
  },
  {
    path: 'student-contract',
    component: StudentComponent
  },
  {
    path: 'contact',
    component: StudentComponent
  }
  ]
},

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
