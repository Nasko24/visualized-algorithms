import {Component, OnInit} from '@angular/core';

import {
  algorithms,
  mazes,
  speeds,
  tileStateVisited
} from '../constants/constants';
import {GridService} from '../grid/grid.service';
import {Maze, Speed, TileLocationAndState} from '../constants/interfaces';
import {MazesService} from '../mazes/mazes.service';
import {AlgorithmsService} from '../algorithms/algorithms.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private algorithms: Algorithm[];
  private currentAlgorithm: Algorithm;

  private mazes: Maze[];
  private speeds: Speed[];
  private algorithmButtonToggle: boolean;

  constructor(public gridService: GridService,
              public mazesService: MazesService,
              public algorithmsService: AlgorithmsService) { }

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
    // TODO: set all tiles with VISITED and REVISITED state to NORMAL
    this.currentAlgorithm = algorithm;
  }

  onMazeChosen(maze: Maze) {
    // clear grid before applying maze
    this.gridService.clearGrid();
    this.mazesService.applyMaze(maze);
  }

  onClickVisualize() {
    this.algorithmButtonToggle = !this.algorithmButtonToggle; // toggle logic for sample
    this.algorithmsService.applyAlgorithm(this.currentAlgorithm);
    // TODO: this will launch the visualize state
  }

  randomNumber(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  onClickBoardClear() {
    this.gridService.clearGrid();
  }
}
