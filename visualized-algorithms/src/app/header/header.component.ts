import {Component, OnInit} from '@angular/core';

import {
  algorithms,
  gridXSize,
  gridYSize,
  mazes, Speed, speedFast,
  speeds,
  TileLocationAndState,
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
  private algorithms: Algorithm[];
  private currentAlgorithm: Algorithm;

  private mazes: string[];
  private speeds: Speed[];
  private algorithmButtonToggle: boolean;

  constructor(public gridService: GridService) { }

  ngOnInit() {
    this.algorithms = algorithms;
    this.currentAlgorithm = this.algorithms[0];
    this.algorithmButtonToggle = false;

    this.mazes = mazes;

    this.speeds = speeds;
  }

  onSpeedChosen(speed: Speed) {
    this.gridService.setCurrentSpeed(speed);
  }

  onAlgorithmChosen(algorithm: Algorithm) {
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
      const stateData: TileLocationAndState = {
        coordinateX: randomNumberX,
        coordinateY: randomNumberY,
        tileState: tileStateVisited};
      this.gridService.emitStateChangeForLocation(stateData);
      await this.sleep(this.gridService.getCurrentSpeed().speedMS);
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
        const stateData: TileLocationAndState = {
          coordinateX: x,
          coordinateY: y,
          tileState: tileStateNormal};
        this.gridService.emitStateChangeForLocation(stateData);
      }
    }
  }
}
