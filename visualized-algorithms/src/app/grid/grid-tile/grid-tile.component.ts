import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  tileStateNormal, tileStatePath, tileStateRevisited,
  tileStateVisited, tileStateWall, gridYSize, StateChange
} from '../../constants/constants';
import {GridService} from '../grid.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-grid-tile',
  templateUrl: './grid-tile.component.html',
  styleUrls: ['./grid-tile.component.css']
})
export class GridTileComponent implements OnInit, OnDestroy {
  @Input() location: number;

  private gridLocation: number[];
  private currentTileState;
  subscription: Subscription;

  constructor(public gridService: GridService) {
    this.subscription = this.gridService.stateChange$.subscribe((data) => {
      this.checkLocationAndState(data);
    });
  }

  ngOnInit() {
    this.setCurrentTileState(tileStateNormal);
    this.calculateGridLocation();
  }

  private checkLocationAndState(data: StateChange) {
    if (this.arraysAreEqual(this.gridLocation, [data.coordinateX, data.coordinateY])) {
      this.setCurrentTileState(data.tileState);
    }
  }

  private arraysAreEqual(array1: number[], array2: number[])  {
    if (array1 === array2) { return true; }
    if (array1.length !== array2.length) { return false; }
    if (array1 == null || array2 == null) { return false; }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) { return false; }
    }
    return true;
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
    if (this.currentTileState === tileStateVisited && tileState === tileStateVisited) {
      this.currentTileState = tileStateRevisited;
    } else {
      this.currentTileState = tileState;
    }
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
