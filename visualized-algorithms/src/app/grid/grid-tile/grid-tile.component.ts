import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  tileStateNormal, tileStatePath, tileStateRevisited,
  tileStateVisited, tileStateWall
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
  tileIsStartNode: boolean;
  tileIsEndNode: boolean;

  private gridLocation: number[];
  private tileState: string;
  private tileWeight;
  stateChangeSubscription: Subscription;
  directStateChangeSubscription: Subscription;

  constructor(public gridService: GridService) {
    this.stateChangeSubscription = this.gridService.stateChange$.subscribe((data) => {
      this.checkLocationAndState(data);
    });
    this.directStateChangeSubscription = this.gridService.directStateChange$.subscribe((data) => {
      this.applyLocationAndState(data);
    });
  }

  ngOnInit() {
    this.tileIsStartNode = false;
    this.tileIsEndNode = false;
    this.gridLocation = this.gridService.calculateGridLocation(this.location);

    this.setCurrentTileWeight(1);
    this.setStartAndEndTiles();
    this.setCurrentTileState(tileStateNormal);
  }

  private checkLocationAndState(data: TileLocationAndState) {
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

  private toggleTileWall() {
    if (this.getCurrentTileState() === tileStateWall) {
      this.setCurrentTileState(tileStateNormal);
      console.log('Toggle tile ' + this.gridLocation + ' to state: ' + tileStateNormal);
    } else {
      this.setCurrentTileState(tileStateWall);
      console.log('Toggle tile ' + this.gridLocation + ' to state: ' + tileStateWall);
    }
    this.updateGrid();
  }

  private setCurrentTileState(tileState: string) {
    if (this.tileIsStartNode || this.tileIsEndNode) {
      return;
    }
    if (this.tileState === tileStateVisited && tileState === tileStateVisited) {
      this.tileState = tileStateRevisited;
    } else {
      this.tileState = tileState;
    }
    this.updateGrid();
  }

  private getCurrentTileState(): string {
    return this.tileState;
  }

  private setCurrentTileWeight(tileWeight: number) {
    this.tileWeight = tileWeight;
  }

  private getCurrentTileWeight(): number {
    return this.tileWeight;
  }

  private isTileStateNormal(): boolean {
    if (this.getCurrentTileState() === tileStateNormal) {
      return true;
    } else {
      return false;
    }
  }

  private isTileStateVisited(): boolean {
    if (this.getCurrentTileState() === tileStateVisited) { return true; } else { return false; }
  }

  private isTileStateRevisited(): boolean {
    if (this.getCurrentTileState() === tileStateRevisited) { return true; } else { return false; }
  }

  private isTileStateWall(): boolean {
    if (this.getCurrentTileState() === tileStateWall) { return true; } else { return false; }
  }

  private isTileStatePath(): boolean {
    if (this.getCurrentTileState() === tileStatePath) { return true; } else { return false; }
  }

  private isTileNode(): boolean {
    if (this.tileIsStartNode || this.tileIsEndNode) { return true; } else { return false; }
  }

  ngOnDestroy() {
    this.stateChangeSubscription.unsubscribe();
    this.directStateChangeSubscription.unsubscribe();
  }

  // this method is called to check if the current tile is a starting node or ending node
  // if either of those conditions are true, the grid service will dispatch an event
  // to that grid location to change the state of the tile
  private setStartAndEndTiles() {
    if (this.arraysAreEqual(this.gridLocation, this.gridService.getStartNodeLocationArray())) {
      // TODO: apply the start and end node icons to the tile
      this.setCurrentTileState(tileStateNormal);
      this.tileIsStartNode = true;
    } else if (this.arraysAreEqual(this.gridLocation, this.gridService.getEndNodeLocationArray())) {
      // TODO: apply the start and end node icons to the tile
      this.setCurrentTileState(tileStateNormal);
      this.tileIsEndNode = true;
    }
  }

  private updateGrid() {
    const newTileStateObject: TileLocationAndState = { coordinateX: this.gridLocation[0],
                                                       coordinateY: this.gridLocation[1],
                                                       tileState: this.tileState,
                                                       tileWeight: this.tileWeight,
                                                       tileIndex: this.location };
    this.gridService.getGridState()[this.location] = newTileStateObject;
  }

  private applyLocationAndState(data: TileLocationAndState) {
    if (this.arraysAreEqual(this.gridLocation, [data.coordinateX, data.coordinateY])) {
      this.tileState = data.tileState;
      this.updateGrid();
    }
  }
}
