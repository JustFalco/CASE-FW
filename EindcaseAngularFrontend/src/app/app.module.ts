import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CourseViewPageComponent } from './pages/course-view-page/course-view-page.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { CourseListComponent } from './components/course-list/course-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { CourseCreatePageComponent } from './pages/course-create-page/course-create-page.component';
import { CreateCourseComponent } from './components/create-course/create-course.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CourseDetailsPageComponent } from './pages/course-details-page/course-details-page.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { PreviousPageButtonComponent } from './components/previous-page-button/previous-page-button.component';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [
    AppComponent,
    CourseViewPageComponent,
    DateSelectorComponent,
    CourseListComponent,
    NavMenuComponent,
    CourseCreatePageComponent,
    CreateCourseComponent,
    CourseDetailsPageComponent,
    CourseCardComponent,
    AddStudentComponent,
    PreviousPageButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    NoopAnimationsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
