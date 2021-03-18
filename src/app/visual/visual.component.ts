import {Component, Input, OnInit} from '@angular/core';

interface Point {
  x: number;
  y: number;
  r: number;
  result: boolean;
}

@Component({
  selector: 'app-visual',
  templateUrl: './visual.component.svg',
})
export class VisualComponent implements OnInit {

  @Input() rValue = 1;
  @Input() simplePoints: Point[] = [];



  constructor() { }

  ngOnInit(): void {
  }



}
