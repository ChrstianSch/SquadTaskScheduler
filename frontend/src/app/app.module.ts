import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginComponent } from './pages/login/login.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { RegisterComponent } from './pages/register/register.component';
import { ViewTaskComponent } from './pages/view-task/view-task.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewTaskComponent,
    LoginComponent,
    HomepageComponent,
    RegisterComponent,
    ViewTaskComponent,
    EditTaskComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
