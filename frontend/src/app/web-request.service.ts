import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  readonly ROOT_URL = 'http://localhost:5000'

  constructor(private http: HttpClient) { }

  get(uri: string) {
    return this.http.get(`${this.ROOT_URL}/${uri}`)
  }

  post(uri: string, payload: Object) {
    return this.http.post(`${this.ROOT_URL}/${uri}`, payload)
  }

  patch(uri: string, payload: Object) {
    return this.http.patch(`${this.ROOT_URL}/${uri}`, payload)
  }

  delete(uri: string){
    return this.http.delete(`${this.ROOT_URL}/${uri}`) 
  }
  login(email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/login`, {
      email,
      password
    }, {
        observe: 'response'
      });
  }

  signup(username: string, email: string, password: string) {
    return this.http.post(`${this.ROOT_URL}/register`, {
      username,
      email,
      password
    }, {
        observe: 'response'
      });
  }
}
