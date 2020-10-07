import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  endNodeName,
  startNodeName,
  tileStateNormal, tileStatePath, tileStateRevisited,
  tileStateVisited, tileStateWall
} from '../../constants/constants';
import {GridService} from '../grid.service';
import {Subscription} from 'rxjs';
import {TileLocationAndState} from '../../constants/interfaces';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-grid-tile',
  templateUrl: './grid-tile.component.html',
  styleUrls: ['./grid-tile.component.css'],
  animations: [
    trigger('tileState', [
      state(tileStateNormal, style({
        'background-color': 'white'
      })),
      state(tileStateWall, style({
        'background-color': '#03213c'
      })),
      state(tileStateVisited, style({
        'background-color': 'cyan'
      })),
      state(tileStateRevisited, style({
        'background-color': 'mediumpurple'
      })),
      state(tileStatePath, style({
        'background-color': 'orangered'
      })),
      transition(tileStateNormal + ' <=> ' + tileStateWall, animate(400)),
      transition(tileStateNormal + ' => ' + tileStateVisited, animate(300)),
      transition(tileStateVisited + ' <=> ' + tileStateRevisited, animate(300)),
      transition(tileStateVisited + ' => ' + tileStatePath, animate(200)),
      transition(tileStateRevisited + ' => ' + tileStatePath, animate(200))
    ])
  ]
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

  private mouseDown() {
    this.gridService.mouseDown();
    if (this.tileIsStartNode) {
      this.gridService.moveNode(startNodeName);
    } else if (this.tileIsEndNode) {
      this.gridService.moveNode(endNodeName);
    } else {
      this.toggleTileWall();
    }
  }

  private mouseUp() {
    if (this.gridService.isNodeMoving()) {
      if (this.gridService.getMovingNode() === startNodeName) {
        this.gridService.setStartNodeLocation(this.gridLocation);
      } else if (this.gridService.getMovingNode() === endNodeName) {
        this.gridService.setEndNodeLocation(this.gridLocation);
      }
    }
    this.gridService.mouseUp();
  }

  private mouseOver() {
    if (this.gridService.getMouseState() && !this.gridService.isNodeMoving()) { this.toggleTileWall(); } else { return; }
  }

  mouseLeave() {
    if (this.gridService.getMouseState()) {
      if (this.gridService.getMovingNode() === startNodeName) {
        this.tileIsStartNode = false;
      } else if (this.gridService.getMovingNode() === endNodeName) {
        this.tileIsEndNode = false;
      }
    }
  }

  mouseEnter() {
    if (this.gridService.getMouseState()) {
      if (this.gridService.getMovingNode() === startNodeName) {
        this.tileIsStartNode = true;
      } else if (this.gridService.getMovingNode() === endNodeName) {
        this.tileIsEndNode = true;
      }
    }
  }
}
