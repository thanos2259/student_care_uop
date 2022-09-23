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
  }
  ]
},

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
