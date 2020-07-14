import {Injectable} from '@angular/core';
import {
  defaultEndNode,
  defaultStartNode,
  gridSize,
  gridXSize,
  gridYSize,
  speedFast,
  tileStateNormal, tileStateWall
} from '../constants/constants';
import {Subject} from 'rxjs';
import {CoordinateSet, Speed, TileLocationAndState} from '../constants/interfaces';

@Injectable({ providedIn: 'root' })
export class GridService {
  private gridState: TileLocationAndState[] = new Array(gridXSize * gridYSize);
  private gridCellCount = gridSize;
  private stateChangeSource = new Subject<TileLocationAndState>();
  private currentSpeed: Speed = speedFast;
  private tileStack: TileLocationAndState[];
  private foundPathStack: TileLocationAndState[];

  stateChange$ = this.stateChangeSource.asObservable();

  constructor() {
    this.tileStack = [];
  }

  getGridState() {
    return this.gridState;
  }

  getAllTilesOfState(state: string): CoordinateSet[] {
    const tiles: CoordinateSet[] = [];
    for (const tile of this.gridState) {
      if (tile.tileState === state) {
        const coordinateSetTile: CoordinateSet = {
          x: tile.coordinateX,
          y: tile.coordinateY
        };
        tiles.push(coordinateSetTile);
      }
    }

    if (tiles.length === 0) { return null; } else { return tiles; }
  }

  getGridCellCount() {
    return this.gridCellCount;
  }

  emitStateChangeForLocation(data: TileLocationAndState) {
    this.stateChangeSource.next(data);
  }

  setCurrentSpeed(speed: Speed) {
    this.currentSpeed = speed;
    console.log('Current speed is set to: ' + speed.speedMS);
  }

  getCurrentSpeed(): Speed {
    return this.currentSpeed;
  }

  clearGrid() {
    for (let x = 0; x < gridXSize; x++) {
      for (let y = 0; y < gridYSize; y++) {
        const stateData: TileLocationAndState = {
          coordinateX: x,
          coordinateY: y,
          tileState: tileStateNormal};
        this.emitStateChangeForLocation(stateData);
      }
    }
    this.clearTileStack();
  }

  private clearTileStack() {
    this.tileStack = [];
  }

  getStartNodeLocation(): CoordinateSet {
    // TODO: service needs to know the actual start node location if its been moved
    return this.createCoordinateSet(defaultStartNode[0], defaultStartNode[1]);
  }

  getEndNodeLocation(): CoordinateSet {
    // TODO: service needs to know the actual end node location
    return this.createCoordinateSet(defaultEndNode[0], defaultEndNode[1]);
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async applyFoundPath(speedOverride: number = null) {
    const count = this.foundPathStack.length;
    for (let i = 0; i < count; i++) {
      this.emitStateChangeForLocation(this.foundPathStack.pop());
      await this.sleep(speedOverride == null ? this.getCurrentSpeed().speedMS : speedFast.speedMS);
    }
  }

  async applyStackAlgorithm(speedOverride: number = null) {
    const count = this.tileStack.length;
    for (let i = 0; i < count; i++) {
      this.emitStateChangeForLocation(this.tileStack.pop());
      await this.sleep(speedOverride == null ? this.getCurrentSpeed().speedMS : speedFast.speedMS);
    }
  }

  async applyStackMaze(speedOverride: number = null) {
    for (const tile of this.tileStack) {
      this.emitStateChangeForLocation(tile);
      await this.sleep(speedOverride == null ? 25 : speedOverride);
    }
    console.log(JSON.stringify(this.gridState));
  }

  public setGridStateData(tileStack: TileLocationAndState[]) {
    this.tileStack = tileStack;
  }

  public getGridStateData(): TileLocationAndState[] {
    return this.tileStack;
  }

  pushStateData(stateData: TileLocationAndState) {
    this.tileStack.push(stateData);
  }

  public createCoordinateSet(x: number, y: number): CoordinateSet {
    const set: CoordinateSet = {x, y};
    return set;
  }

  coordinateSetsAreTheSame(set1: CoordinateSet, set2: CoordinateSet): boolean {
    if (set1.x === set2.x && set1.y === set2.y) { return true; } else { return false; }
  }

  existsInTileSetArray(neighbor: CoordinateSet, array: CoordinateSet[]): boolean {
    for (const tile of array) {
      if (this.coordinateSetsAreTheSame(neighbor, tile)) {
        return true;
      }
    }
    return false;
  }

  createTileLocationAndStateObject(currentTile: CoordinateSet, weight: number = 1): TileLocationAndState {
    return { coordinateX: currentTile.x, coordinateY: currentTile.y, tileState: tileStateNormal, tileWeight: weight};
  }

  getUpperNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y + 2),
      this.createCoordinateSet(currentTile.x, currentTile.y + 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y + 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y + 1)
    ];
  }

  getLowerNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y - 2),
      this.createCoordinateSet(currentTile.x, currentTile.y - 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y - 2),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y - 1)
    ];
  }

  getRightNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x + 1, currentTile.y),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x + 2, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x + 2, currentTile.y),
      this.createCoordinateSet(currentTile.x + 2, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x + 1, currentTile.y - 1)
    ];
  }

  getLeftNeighbors(currentTile: CoordinateSet): CoordinateSet[] {
    return [
      this.createCoordinateSet(currentTile.x - 1, currentTile.y),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 2, currentTile.y + 1),
      this.createCoordinateSet(currentTile.x - 2, currentTile.y),
      this.createCoordinateSet(currentTile.x - 2, currentTile.y - 1),
      this.createCoordinateSet(currentTile.x - 1, currentTile.y - 1)
    ];
  }

  getTileAbove(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x, tile.y + 1);
  }

  getTileBelow(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x, tile.y - 1);
  }

  getTileRight(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x + 1, tile.y);
  }

  getTileLeft(tile: CoordinateSet): CoordinateSet {
    return this.createCoordinateSet(tile.x - 1, tile.y);
  }

  getTileDirectNeighbors(tile: CoordinateSet): CoordinateSet[] {
    return [this.getTileAbove(tile), this.getTileLeft(tile), this.getTileRight(tile), this.getTileBelow(tile)];
  }

  setGridToAllWalls() {
    for (let x = 0; x < gridXSize; x++) {
      for (let y = 0; y < gridYSize; y++) {
        const stateData: TileLocationAndState = {
          coordinateX: x,
          coordinateY: y,
          tileState: tileStateWall};
        this.emitStateChangeForLocation(stateData);
      }
    }
  }

  // this method will calculate the grid location in [x,y] format
  // from the index provided by the grid component
  calculateGridLocation(location: number): number[] {
    const xCoordinate = location % gridXSize;
    const yCoordinate = this.flipY(Math.floor(location / gridXSize));

    return [xCoordinate, yCoordinate];
  }

  private flipY(yCoordinate: number): number {
    return (gridYSize - 1) - yCoordinate;
  }

  getTileWeight(inputTile: CoordinateSet): number {
    for (const tile of this.gridState) {
      if (inputTile.x === tile.coordinateX && inputTile.y === tile.coordinateY) { return tile.tileWeight; }
    }
    console.log('%cCould not find the weight for tile %O', 'color: red', inputTile);
    throw new Error('Could not find the weight for tile [' + inputTile.x + ', ' + inputTile.y + ']');
  }

  getTileIndex(inputTile: CoordinateSet): number {
    for (const tile of this.gridState) {
      if (inputTile.x === tile.coordinateX && inputTile.y === tile.coordinateY) { return tile.tileIndex; }
    }
    console.log('%cCount not find the index for tile %O', 'color: red', inputTile);
    throw new Error('Count not find the index for tile [' + inputTile.x + ', ' + inputTile.y + ']');
  }
}
