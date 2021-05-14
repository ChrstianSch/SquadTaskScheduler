import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NewListComponent } from './pages/new-list/new-list.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { TaskPageComponent } from './pages/task-page/task-page.component';
import { EditListComponent } from './pages/edit-list/edit-list.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    HomePageComponent,
    LoginPageComponent,
    NewListComponent,
    NewTaskComponent,
    RegisterPageComponent,
    TaskPageComponent,
    EditListComponent,
    EditTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
