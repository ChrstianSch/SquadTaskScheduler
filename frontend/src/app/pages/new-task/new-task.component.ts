import { TaskService } from 'src/app/task.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  
  
  ngOnInit() {
    
  }

  createTask(title: string, description: string, completeBy: Date, priority: number, completed: boolean, author: string) {
    this.taskService.createTask(title, description, completeBy, priority, completed, author).subscribe((newTask: Task) => {
      this.router.navigate(['../tasks'], { relativeTo: this.route });
    })
  }

}