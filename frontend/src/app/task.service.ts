import { Injectable } from '@angular/core'
import { WebRequestService } from './web-request.service'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webRequestService: WebRequestService) { }

  // send web request to create a task
  createTask(title: string) {
    this.webRequestService.post('/tasks', { title })
  }
}
