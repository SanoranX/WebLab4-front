import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Title} from "@angular/platform-browser";

interface Choice {
  value: number;
  strValue: string;
}

interface Point {
  x: number;
  y: number;
  r: number;
  result: boolean;
  creator: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: 'work.component.html',
})
export class WorkComponent implements OnInit {
  xChoices: Choice[];
  rChoices: Choice[];
  username: string;
  currX: number;

  currY: number;
  strY: string;

  currR: number;

  baseApiUrl = 'http://sanoranx.xyz:8080/lab4-1.0/api/points/';
  baseLkUrl = 'http://sanoranx.xyz:8080/lab4-1.0/lk/';

  logoutUrl = this.baseLkUrl + 'logout';
  addPointUrl = this.baseApiUrl + 'add';
  resultsUrl = this.baseApiUrl + 'get';
  clearUrl = this.baseApiUrl + 'clear';

  errorResponse = 'failed';
  okResponse = 'ok';
  lastError = 'Нет ошибок.';

  points: { [key: number]: Point[]; } = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };
  pointsForTable: Point[] = [];
  pointsForVisual: Point[] = [];

  constructor(private router: Router, private http: HttpClient, private titleService:Title) {
    this.currX = 0;
    this.currY = 0;
    this.strY = '0';
    this.currR = 1;
    this.rChoices = [
      {value: -3, strValue: '-3'},
      {value: -2, strValue: '-2'},
      {value: -1, strValue: '-1'},
      {value: 0, strValue: '0'},
      {value: 1, strValue: '1'},
      {value: 2, strValue: '2'},
      {value: 3, strValue: '3'},
      {value: 4, strValue: '4'},
    ];
    if (localStorage.getItem('key') == null) {
      router.navigate(['']);
    }
    this.fetchPoints();
    this.titleService.setTitle("Working page Lab4");
    this.username = localStorage.getItem('username');
  }


  onCanvasClick(event: MouseEvent): void {

    setTimeout(() => 
    {
      if (this.currR < 1) {
        this.lastError = 'Значение R должно быть больше 0.';
        return;
      }
  
      const elem = document.getElementById('canvas');
      const br = elem.getBoundingClientRect();
      const left = br.left;
      const top = br.top;
  
      const mouseX: number = event.clientX - left;
      const mouseY: number = event.clientY - top;
  
      const transferX = this.currR * (mouseX - 150) / 130;
      const transferY = this.currR * (150 - mouseY) / 130;
  
      this.http.post(this.addPointUrl, {
          key: localStorage.getItem('key'),
          username: localStorage.getItem('username'),
          x: transferX,
          y: transferY,
          r: this.currR
        }
      ).subscribe(data => {
        const response: any = data;
        if (response.status === this.errorResponse) {
          this.lastError = 'Добавить точку не получилось, или возможно ваша сессия устарела, попробуйте перезайти.';
        }
        else if(response.status === "outdated"){
          this.http.post(this.logoutUrl, {key: localStorage.getItem('key')});
          localStorage.removeItem('key');
          this.router.navigate(['']);
        }else if(response.status === "delay"){
          this.lastError = 'Вы отправляете слишком много запросов на сервер. Попробуйте чуть медленнее.';
        }
        else {
          const lastPt: Point = response.last_point;
          this.points[lastPt.r].push(lastPt);
          this.pointsForTable.push(lastPt);
        }
      });
    },
    0);
  }

  fetchPoints(): void {
    this.http.post(this.resultsUrl, {
      key: localStorage.getItem('key')
    }).toPromise()
      .then(response => response as any)
      .then(response => response.data as Point[])
      .then(data => {
        data.forEach(val => this.points[val.r].push(val));

        this.pointsForTable = data;
        this.pointsForVisual = this.points[this.currR];
      });
  }

  onSubmit(): void {

    if (this.currR < 1) {
      return;
    } else if(!(Number(this.strY) > -5 && Number(this.strY) < 5)){
      this.lastError = "Невозможно отправить точку, проверьте ввод Y.";
      return;
    }

    this.http.post(this.addPointUrl, {
        key: localStorage.getItem('key'),
        username: localStorage.getItem('username'),
        x: this.currX,
        y: this.currY,
        r: this.currR
      }
    ).subscribe(data => {
      const response: any = data;

      if (response.status === this.errorResponse) {
        this.lastError = 'Добавить точку не получилось.';
      }else if(response.status === "outdated"){
        this.http.post(this.logoutUrl, {key: localStorage.getItem('key')});
        localStorage.removeItem('key');
        this.router.navigate(['']);
      } 
      else {
        const lastPt: Point = response.last_point;

        this.points[lastPt.r].push(lastPt);
        this.pointsForTable.push(lastPt);
        this.lastError = "Нет ошибок."
      }
    });
  }

  logout(): void {
    this.http.post(this.logoutUrl, {key: localStorage.getItem('key')});
    localStorage.removeItem('key');
    this.router.navigate(['']);
  }

  onClear(): void {
    this.http.post(this.clearUrl, {key: localStorage.getItem('key')}).subscribe(data => {
      const resp: any = data;
      if (resp.status === this.errorResponse) {
        this.lastError = 'Очистить не вышло, проверьте соединение.';
      } else if(resp.status === "outdated"){
          this.http.post(this.logoutUrl, {key: localStorage.getItem('key')});
          localStorage.removeItem('key');
          this.router.navigate(['']);
      }
      else {
        location.reload(true);
      }
    });
  }

  rChanged(): void {
    this.pointsForVisual = this.points[this.currR];
  }

  rChangedParam(value: number){
    this.currR = value;
    this.pointsForVisual = this.points[this.currR];
  }

  validateY(): void {
    while (!(new RegExp('^(-|-?[0-9]+(.[0-9]+)?)$')).test(this.strY) && this.strY.length > 0) {
      this.strY = this.strY.substring(0, this.strY.length - 1);
    }
    if (this.strY[0] === '-') {
      this.strY = this.strY.substring(0, 5);
    } else {
      this.strY = this.strY.substring(0, 4);
    }
    if (Number(this.strY) > -5 && Number(this.strY) < 5) {
      this.currY = Number(this.strY);
    } else {
      this.lastError = 'Значение Y должно быть в интервале (-5; 5) и не содержать букв.';
    }
  }

  ngOnInit(): void {
  }
}
