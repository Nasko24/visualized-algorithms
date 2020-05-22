import {Component, Input, OnInit} from '@angular/core';
import {tileStateNormal, tileStatePath, tileStateRevisited,
  tileStateVisited, tileStateWall, gridYSize} from '../../constants/constants';
import {GridService} from '../grid.service';

@Component({
  selector: 'app-grid-tile',
  templateUrl: './grid-tile.component.html',
  styleUrls: ['./grid-tile.component.css']
})
export class GridTileComponent implements OnInit {
  @Input() location: number;

  private gridLocation: number[];
  private currentTileState;

  constructor(public gridService: GridService) { }

  ngOnInit() {
    this.setCurrentTileState(tileStateNormal);
    this.calculateGridLocation();
  }

  private calculateGridLocation() {
    const xCoordinate = this.location % 62;
    const yCoordinate = this.flipY(Math.floor(this.location / 62));

    this.gridLocation = [xCoordinate, yCoordinate];
  }

  private flipY(yCoordinate: number): number {
    return (gridYSize - 1) - yCoordinate;
  }

  private toggleTileWall() {
    if (this.getCurrentTileState() === tileStateWall) {
      this.setCurrentTileState(tileStateNormal);
    } else {
      this.setCurrentTileState(tileStateWall);
    }
  }

  private setCurrentTileState(tileState: string) {
    this.currentTileState = tileState;
  }

  private getCurrentTileState(): string {
    return this.currentTileState;
  }

  private ifTileStateNormal(): boolean {
    if (this.getCurrentTileState() === tileStateNormal) {
      return true;
    } else {
      return false;
    }
  }

  private ifTileStateVisited(): boolean {
    if (this.getCurrentTileState() === tileStateVisited) {
      return true;
    } else {
      return false;
    }
  }

  private ifTileStateRevisited(): boolean {
    if (this.getCurrentTileState() === tileStateRevisited) {
      return true;
    } else {
      return false;
    }
  }

  private ifTileStateWall(): boolean {
    if (this.getCurrentTileState() === tileStateWall) {
      return true;
    } else {
      return false;
    }
  }

  private ifTileStatePath(): boolean {
    if (this.getCurrentTileState() === tileStatePath) {
      return true;
    } else {
      return false;
    }
  }
}
