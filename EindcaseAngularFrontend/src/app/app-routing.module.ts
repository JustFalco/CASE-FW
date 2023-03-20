import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCreatePageComponent } from './pages/course-create-page/course-create-page.component';
import { CourseViewPageComponent } from './pages/course-view-page/course-view-page.component';

const routes: Routes = [
  { path: '', component: CourseViewPageComponent },
  { path: 'create', component: CourseCreatePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }