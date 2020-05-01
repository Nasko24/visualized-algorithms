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
  private algorithmButtonToggle: boolean;

  // @ViewChild(MatMenuTrigger, {static: false} ) trigger: MatMenuTrigger;

  constructor() { }

  ngOnInit() {
    this.algorithms = algorithms;
    this.currentAlgorithm = this.algorithms[0];
    this.algorithmButtonToggle = false;

    this.mazes = mazes;

    this.speeds = speeds;
    this.currentSpeed = this.speeds[2];
  }

  onSpeedChosen(speed: string) {
    this.currentSpeed = speed;
  }

  onAlgorithmChosen(algorithm: string) {
    this.currentAlgorithm = algorithm;
  }

  onMazeChosen(maze: string) {
    // TODO: apply the maze to the grid, also keep the state from changing until the maze has applied
  }

  onClickVisualize() {
    this.algorithmButtonToggle = !this.algorithmButtonToggle; // toggle logic for sample
    // TODO: this will launch the visualize state
  }
}
