import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  author: string;
  
  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.author = params['author'];
      }
    )
  }

  createTask(title: string) {
    this.taskService.createTask(title, description, completeBy, priority, completed, this.author).subscribe((newTask: Task) => {
      this.router.navigate(['../tasks'], { relativeTo: this.route });
    })
  }

}