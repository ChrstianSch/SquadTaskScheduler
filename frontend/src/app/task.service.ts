import { Injectable } from '@angular/core'
import { WebRequestService } from './web-request.service'
import { Task } from './models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webRequestService: WebRequestService) { }

  // send web request to create a task
  createTask(title: string, description: string, completeBy: Date, priority: number, completed: boolean, author: string) {
    return this.webRequestService.post('/tasks', { title, description, completeBy, priority, completed, author })
  }
}
