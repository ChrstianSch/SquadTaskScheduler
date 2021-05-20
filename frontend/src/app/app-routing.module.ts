import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { LoginComponent } from './pages/login/login.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { RegisterComponent } from './pages/register/register.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';

const routes: Routes = [
  { path: 'start', component: HomepageComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'tasks', component: TaskViewComponent},
  { path: 'new', component: NewTaskComponent},
  { path: 'edit', component: EditTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
