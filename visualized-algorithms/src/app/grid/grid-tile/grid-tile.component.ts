import {Component, Input, OnInit} from '@angular/core';
import {tileStateNormal, tileStatePath, tileStateRevisited, tileStateVisited, tileStateWall} from '../../constants/constants';

@Component({
  selector: 'app-grid-tile',
  templateUrl: './grid-tile.component.html',
  styleUrls: ['./grid-tile.component.css']
})
export class GridTileComponent implements OnInit {
  @Input() location: number;

  private gridLocation: number[];
  private tileStates = [
    [tileStateNormal, true],
    [tileStateVisited, false],
    [tileStateRevisited, false],
    [tileStateWall, false],
    [tileStatePath, false],
  ];

  constructor() { }

  ngOnInit() {
    this.calculateGridLocation();
    this.resetAllOtherTileStates(tileStateVisited);
  }

  calculateGridLocation() {
    const xCoordinate = this.location % 62;
    const yCoordinate = Math.floor(this.location / 62);
    this.gridLocation = [xCoordinate, yCoordinate];
  }

  toggleTileWall() {
    this.resetAllOtherTileStates(tileStateWall);
  }

  resetAllOtherTileStates(tileState: string) {
    for (let i = 0; i < tileState.length; i++) {
      if (this.tileStates[i][0] === tileState) {
        this.tileStates[i][1] = true;
      } else {
        this.tileStates[i][1] = false;
      }
    }
  }
}
