import {Component, OnInit, ViewChild} from '@angular/core';

import {algorithms, mazes, speeds} from '../constants/constants';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private algorithms: string[];
  private mazes: string[];
  private speeds: string[];
  private currentAlgorithm: string;
  private currentSpeed: string;

  // @ViewChild(MatMenuTrigger, {static: false} ) trigger: MatMenuTrigger;

  constructor() { }

  ngOnInit() {
    this.algorithms = algorithms;
    this.currentAlgorithm = this.algorithms[0];

    this.mazes = mazes;

    this.speeds = speeds;
    this.currentSpeed = this.speeds[2];
  }

  onSpeedChosen(speed: string) {
    this.currentSpeed = speed;
  }
}
