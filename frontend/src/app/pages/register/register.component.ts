import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  ButtonRegister(username: string, email: string, password: string) {
    this.authService.signup(username, email, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
      this.router.navigate(['/tasks']);
    });
  }

}