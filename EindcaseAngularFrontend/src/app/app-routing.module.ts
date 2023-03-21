import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseCreatePageComponent } from './pages/course-create-page/course-create-page.component';
import { CourseDetailsPageComponent } from './pages/course-details-page/course-details-page.component';
import { CourseViewPageComponent } from './pages/course-view-page/course-view-page.component';

const routes: Routes = [
  { path: '', component: CourseViewPageComponent },
  { path: 'create', component: CourseCreatePageComponent },
  { path: 'course/:id', component: CourseDetailsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }