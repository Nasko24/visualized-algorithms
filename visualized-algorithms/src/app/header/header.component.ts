import {Component, OnInit} from '@angular/core';

import {
  algorithms,
  gridXSize,
  gridYSize,
  mazes,
  speeds,
  StateChange,
  tileStateNormal,
  tileStateVisited
} from '../constants/constants';
import {GridService} from '../grid/grid.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private algorithms: string[];
  private mazes: string[];
  private speeds: any[];
  private currentAlgorithm: string;
  private currentSpeed: any[];
  private algorithmButtonToggle: boolean;

  constructor(public gridService: GridService) { }

  ngOnInit() {
    this.algorithms = algorithms;
    this.currentAlgorithm = this.algorithms[0];
    this.algorithmButtonToggle = false;

    this.mazes = mazes;

    this.speeds = speeds;
    this.currentSpeed = this.speeds[2];
  }

  getCurrentSpeedMS(): number {
    return this.currentSpeed[1];
  }

  onSpeedChosen(speed: any[]) {
    this.currentSpeed = speed;
  }

  onAlgorithmChosen(algorithm: string) {
    this.currentAlgorithm = algorithm;
  }

  onMazeChosen(maze: string) {
    // TODO: apply the maze to the grid, also keep the state from changing until the maze has applied
  }

  async onClickVisualize() {
    this.algorithmButtonToggle = !this.algorithmButtonToggle; // toggle logic for sample
    // TODO: this will launch the visualize state

    // test code here, this is not going to be final
    for (let i = 0; i < 200; i++) {
      const randomNumberX = this.randomNumber(0, 61);
      const randomNumberY = this.randomNumber(0, 23);
      const stateData: StateChange = {
        coordinateX: randomNumberX,
        coordinateY: randomNumberY,
        tileState: tileStateVisited};
      this.gridService.emitStateChangeForLocation(stateData);
      await this.sleep(this.getCurrentSpeedMS());
    }
  }

  randomNumber(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onClickBoardClear() {
    for (let x = 0; x < gridXSize; x++) {
      for (let y = 0; y < gridYSize; y++) {
        const stateData: StateChange = {
          coordinateX: x,
          coordinateY: y,
          tileState: tileStateNormal};
        this.gridService.emitStateChangeForLocation(stateData);
      }
    }
  }
}
