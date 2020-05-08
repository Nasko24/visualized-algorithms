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
  private currentTileState;

  constructor() { }

  ngOnInit() {
    this.setCurrentTileState(tileStateNormal);
    this.calculateGridLocation();
  }

  calculateGridLocation() {
    const xCoordinate = this.location % 62;
    const yCoordinate = Math.floor(this.location / 62);
    this.gridLocation = [xCoordinate, yCoordinate];
  }

  toggleTileWall() {
    if (this.getCurrentTileState() === tileStateWall) {
      this.setCurrentTileState(tileStateNormal);
    } else {
      this.setCurrentTileState(tileStateWall);
    }
  }

  setCurrentTileState(tileState: string) {
    this.currentTileState = tileState;
  }

  getCurrentTileState(): string {
    return this.currentTileState;
  }

  ifTileStateNormal(): boolean {
    if (this.getCurrentTileState() === tileStateNormal) {
      return true;
    } else {
      return false;
    }
  }

  ifTileStateVisited(): boolean {
    if (this.getCurrentTileState() === tileStateVisited) {
      return true;
    } else {
      return false;
    }
  }

  ifTileStateRevisited(): boolean {
    if (this.getCurrentTileState() === tileStateRevisited) {
      return true;
    } else {
      return false;
    }
  }

  ifTileStateWall(): boolean {
    if (this.getCurrentTileState() === tileStateWall) {
      return true;
    } else {
      return false;
    }
  }

  ifTileStatePath(): boolean {
    if (this.getCurrentTileState() === tileStatePath) {
      return true;
    } else {
      return false;
    }
  }
}
