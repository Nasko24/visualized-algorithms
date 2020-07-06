import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  tileStateNormal, tileStatePath, tileStateRevisited,
  tileStateVisited, tileStateWall, gridYSize, defaultStartNode, defaultEndNode
} from '../../constants/constants';
import {GridService} from '../grid.service';
import {Subscription} from 'rxjs';
import {TileLocationAndState} from '../../constants/interfaces';

@Component({
  selector: 'app-grid-tile',
  templateUrl: './grid-tile.component.html',
  styleUrls: ['./grid-tile.component.css']
})
export class GridTileComponent implements OnInit, OnDestroy {
  @Input() location: number;
  tileIsNode: boolean;

  private gridLocation: number[];
  private currentTileState: string;
  private currentTileWeight;
  subscription: Subscription;

  constructor(public gridService: GridService) {
    this.subscription = this.gridService.stateChange$.subscribe((data) => {
      this.checkLocationAndState(data);
    });
  }

  ngOnInit() {
    this.currentTileWeight = 1;
    this.tileIsNode = false;

    this.setCurrentTileState(tileStateNormal);
    this.gridLocation = this.gridService.calculateGridLocation(this.location);
    this.applyDefaultLocationAndState();
    this.updateGrid();
  }

  private checkLocationAndState(data: TileLocationAndState) {
    if (this.arraysAreEqual(this.gridLocation, [data.coordinateX, data.coordinateY])) {
      this.setCurrentTileState(data.tileState);
    }
    this.updateGrid();
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

  private toggleTileWall() {
    if (this.getCurrentTileState() === tileStateWall) {
      this.setCurrentTileState(tileStateNormal);
    } else {
      this.setCurrentTileState(tileStateWall);
    }
  }

  private setCurrentTileState(tileState: string) {
    if (this.tileIsNode) {
      return;
    }
    if (this.currentTileState === tileStateVisited && tileState === tileStateVisited) {
      this.currentTileState = tileStateRevisited;
    } else {
      this.currentTileState = tileState;
    }
  }

  private getCurrentTileState(): string {
    return this.currentTileState;
  }

  private setCurrentTileWeight(tileWeight: number) {

  }

  private getCurrentTileWeight(): number {
    return this.currentTileWeight;
  }

  private isTileStateNormal(): boolean {
    if (this.getCurrentTileState() === tileStateNormal) {
      return true;
    } else {
      return false;
    }
  }

  private isTileStateVisited(): boolean {
    if (this.getCurrentTileState() === tileStateVisited) {
      return true;
    } else {
      return false;
    }
  }

  private isTileStateRevisited(): boolean {
    if (this.getCurrentTileState() === tileStateRevisited) {
      return true;
    } else {
      return false;
    }
  }

  private isTileStateWall(): boolean {
    if (this.getCurrentTileState() === tileStateWall) {
      return true;
    } else {
      return false;
    }
  }

  private isTileStatePath(): boolean {
    if (this.getCurrentTileState() === tileStatePath) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // this method is called to check if the current tile is a starting node or ending node
  // if either of those conditions are true, the grid service will dispatch an event
  // to that grid location to change the state of the tile
  private applyDefaultLocationAndState() {
    if (this.arraysAreEqual(this.gridLocation, defaultStartNode) ||
        this.arraysAreEqual(this.gridLocation, defaultEndNode)) {
      // TODO: apply the start and end node icons to the tile
      // current solution is temporary
      this.setCurrentTileState(tileStatePath);
      this.tileIsNode = true;
    }
  }

  private updateGrid() {
    const tileStateObject: TileLocationAndState = {coordinateX: this.gridLocation[0],
                                                   coordinateY: this.gridLocation[1],
                                                   tileState: this.currentTileState,
                                                   tileWeight: this.currentTileWeight};
    this.gridService.getGridState()[this.location] = tileStateObject;
  }
}
