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
  lkBaseUrl = 'http://sanoranx.xyz:8080/lab4-1.0/lk/';
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
    if(this.username.length > 16 && (this.password.length > 16)){
      this.lastError = "Поле для ввода содержит больше 16 знаков.";
      return;
    }else if(this.username.indexOf(" ") >= 0 || this.password.indexOf(" ") >= 0){
      this.lastError = "Поля не должны содержать пробелы.";
      return;
    }else if(this.username === this.password){
      this.lastError = "В целях безопасности, пароль и логин не должны быть одинаковые.";
      return;
    }else if(this.username.indexOf(";") >= 0 || this.password.indexOf(";") >= 0){
      this.lastError = "В полях не должен быть знак \";\"";
      return;
    }else if(this.username.indexOf("@") >= 0 || this.password.indexOf("@") >= 0){
      this.lastError = "В полях не должны быть знаки на подобии \"@\"";
      return;
    }else{
      this.http.post(this.lkLoginUrl, {
        username: this.username,
        password: this.password
      }).subscribe(data => {
        const response: any = data;
  
        if (response.status !== this.errorResponse) {
          localStorage.setItem('key', response.key);
          localStorage.setItem('username', this.username);
          this.router.navigate(['admin']);
        } else {
          this.lastError = 'Произошла ошибка:\n1)Возможно, что вы ввели неправильный логин/пароль\n2)Возможно, пользователя не существует\n3)Возможно, что у вас включен Caps-Lock.';
        }
      });
    }
  }

  register(): void {
    if(this.username.length > 16 && (this.password.length > 16)){
      this.lastError = "Поле для ввода содержит больше 16 знаков.";
      return;
    }else if(this.username.indexOf(" ") >= 0 || this.password.indexOf(" ") >= 0){
      this.lastError = "Поля не должны содержать пробелы.";
      return;
    }else if(this.username === this.password){
      this.lastError = "В целях безопасности, пароль и логин не должны быть одинаковые.";
      return;
    }else if(this.username.indexOf(";") >= 0 || this.password.indexOf(";") >= 0){
      this.lastError = "В полях не должен быть знак \";\"";
      return;
    }else if(this.username.indexOf("@") >= 0 || this.password.indexOf("@") >= 0){
      this.lastError = "В полях не должны быть знаки на подобии \"@\"";
      return;
    }
    else{
      this.http.post(this.lkRegisterUrl, {
        username: this.username,
        password: this.password
      }).subscribe((data) => {
        const response: any = data;
  
        if (response.status !== 'exists' && response.status !== this.errorResponse) {
          localStorage.setItem('key', response.key);
          localStorage.setItem('username', this.username);
          this.router.navigate(['admin']);
        } else if (response.status == this.errorResponse) {
          this.lastError = 'Произошла неожиданная ошибка во время регистрации. Обратитесь к администрации.';
        } else if (response.status == 'exists') {
          this.lastError = 'Аккаунт уже существует.';
        }
      });
    }
  }
}
