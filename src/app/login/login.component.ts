import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  lkBaseUrl = 'http://localhost:8080/lab4-1.0/lk/';
  lkLoginUrl = this.lkBaseUrl + 'login';
  lkRegisterUrl = this.lkBaseUrl + 'register';

  errorResponse = 'failed';
  lastError = '';

  constructor(private router: Router, private http: HttpClient, private titleService:Title) {
    if (localStorage.getItem('key') !== null) {
      window.location.href = '/admin';
    }
    titleService.setTitle("Войти в систему [Lab4]")
  }

  ngOnInit(): void {
  }

  login(): void {
    if(!(this.username.length > 16) && !(this.password.length > 16)){
      this.http.post(this.lkLoginUrl, {
        username: this.username,
        password: this.password
      }).subscribe(data => {
        const response: any = data;
  
        if (response.status !== this.errorResponse) {
          localStorage.setItem('key', response.key);
          this.router.navigate(['admin']);
        } else {
          this.lastError = 'Неправильный логин или пароль.';
        }
      });
    }else {
      this.lastError = "Поле для ввода содержит больше 16 знаков.";
    }
  
  }

  register(): void {
    if(!(this.username.length > 16) && !(this.password.length > 16)){
      this.http.post(this.lkRegisterUrl, {
        username: this.username,
        password: this.password
      }).subscribe((data) => {
        const response: any = data;
  
        if (response.status !== 'exists' && response.status !== this.errorResponse) {
          localStorage.setItem('key', response.key);
          this.router.navigate(['admin']);
        } else if (response.status == this.errorResponse) {
          this.lastError = 'Зарегистрироваться не получилось.';
        } else if (response.status == 'exists') {
          this.lastError = 'Аккаунт уже существует.';
        }
      });
    }else{
      this.lastError = "Поле для ввода содержит больше 16 знаков."
    }
    
  }
}
