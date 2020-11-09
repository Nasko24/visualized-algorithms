import {Injectable} from '@angular/core';
import {
  defaultEndNode,
  defaultStartNode, emptyString,
  gridSize,
  gridXSize,
  gridYSize,
  speedFast,
  tileStateNormal, tileStatePath, tileStateRevisited, tileStateVisited, tileStateWall
} from '../constants/constants';
import {Subject} from 'rxjs';
import {CoordinateSet, Speed, TileLocationAndState} from '../constants/interfaces';

@Injectable({ providedIn: 'root' })
export class GridService {
  private gridState: TileLocationAndState[] = new Array(gridXSize * gridYSize);
  private gridCellCount = gridSize;

  private stateChangeSource = new Subject<TileLocationAndState>();
  private directStateChangeSource = new Subject<TileLocationAndState>();

  private currentSpeed: Speed = speedFast;
  private tileStack: TileLocationAndState[];
  private foundPathStack: TileLocationAndState[];

  stateChange$ = this.stateChangeSource.asObservable();
  directStateChange$ = this.directStateChangeSource.asObservable();

  private mousePressed: boolean;
  private movingNode = emptyString;

  private startNodeLocation: CoordinateSet;
  private endNodeLocation: CoordinateSet;

  constructor() {
    this.tileStack = [];
    this.foundPathStack = [];
    this.mousePressed = false;
    this.startNodeLocation = this.createCoordinateSet(defaultStartNode[0], defaultStartNode[1]);
    this.endNodeLocation = this.createCoordinateSet(defaultEndNode[0], defaultEndNode[1]);
  }

  getGridState() {
    return this.gridState;
  }

  getAllTilesOfState(state: string): CoordinateSet[] {
    const tiles: CoordinateSet[] = [];
    for (const tile of this.gridState) {
      if (this.coordinateSetsAreTheSame(this.createCoordinateSet(tile.coordinateX, tile.coordinateY), this.getStartNodeLocation()) ||
          this.coordinateSetsAreTheSame(this.createCoordinateSet(tile.coordinateX, tile.coordinateY), this.getEndNodeLocation())) {
        continue;
      }
      if (tile.tileState === state) {
        const coordinateSetTile: CoordinateSet = {
          x: tile.coordinateX,
          y: tile.coordinateY
        };
        tiles.push(coordinateSetTile);
      }
    }

    return tiles;
  }

  getGridCellCount() {
    return this.gridCellCount;
  }

  emitStateChangeForLocation(data: TileLocationAndState) {
    this.stateChangeSource.next(data);
  }

  emitDirectStateChange(data: TileLocationAndState) {
    this.directStateChangeSource.next(data);
  }

  setCurrentSpeed(speed: Speed) {
    this.currentSpeed = speed;
    console.log('Current speed is set to: ' + speed.speedMS);
  }

  getCurrentSpeed(): Speed {
    return this.currentSpeed;
  }

  clearPath() {
    this.resetStartAndEndNodes();
    this.getAllTilesOfState(tileStatePath).forEach((tile) => {
      this.emitStateChangeForLocation(this.createTileLocationAndStateObject(tile));
    });
    this.getAllTilesOfState(tileStateVisited).forEach((tile) => {
      this.emitStateChangeForLocation(this.createTileLocationAndStateObject(tile));
    });
    this.getAllTilesOfState(tileStateRevisited).forEach((tile) => {
      this.emitStateChangeForLocation(this.createTileLocationAndStateObject(tile));
    });
    this.clearPathStack();
    this.clearTileStack();
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
    this.resetStartAndEndNodes();

    this.clearTileStack();
    this.clearPathStack();
  }

  private clearTileStack() {
    this.tileStack = [];
  }

  private clearPathStack() {
    this.foundPathStack = [];
  }

  private resetStartAndEndNodes() {
    this.emitDirectStateChange(this.getStartNodeLocationAndState(tileStateNormal));
    this.emitDirectStateChange(this.getEndNodeLocationAndState(tileStateNormal));
  }

  setStartNodeLocation(startNodeCoordinates: number[]) {
    this.startNodeLocation = { x: startNodeCoordinates[0], y: startNodeCoordinates[1] };
  }

  getStartNodeLocation(): CoordinateSet {
    return this.startNodeLocation;
  }

  getStartNodeLocationArray(): number[] {
    return [this.startNodeLocation.x, this.startNodeLocation.y];
  }

  getStartNodeLocationAndState(state: string = null): TileLocationAndState {
    for (const tile of this.gridState) {
      if (this.coordinateSetsAreTheSame(this.createCoordinateSet(tile.coordinateX, tile.coordinateY), this.getStartNodeLocation())) {
        if (state === null) { return tile; } else { tile.tileState = state; return tile; }
      }
    }
    console.log('%cCould not find START node in grid %O', 'color: red');
    throw new Error('Could not find START node in grid...');
  }

  setEndNodeLocation(endNodeCoordinates: number[]) {
    this.endNodeLocation = { x: endNodeCoordinates[0], y: endNodeCoordinates[1] };
  }

  getEndNodeLocation(): CoordinateSet {
    return this.endNodeLocation;
  }

  getEndNodeLocationArray(): number[] {
    return [this.endNodeLocation.x, this.endNodeLocation.y];
  }

  getEndNodeLocationAndState(state: string = null): TileLocationAndState {
    for (const tile of this.gridState) {
      if (this.coordinateSetsAreTheSame(this.createCoordinateSet(tile.coordinateX, tile.coordinateY), this.getEndNodeLocation())) {
        if (state === null) { return tile; } else { tile.tileState = state; return tile; }
      }
    }
    console.log('%cCould not find END node in grid %O', 'color: red');
    throw new Error('Could not find END node in grid...');
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async applyFoundPath(speedOverride: number = null) {
    this.emitDirectStateChange(this.getStartNodeLocationAndState(tileStatePath));
    await this.sleep(speedOverride == null ? 25 : speedOverride);

    for (const tile of this.foundPathStack) {
      this.emitStateChangeForLocation(tile);
      await this.sleep(speedOverride == null ? 25 : speedOverride);
    }

    this.emitDirectStateChange(this.getEndNodeLocationAndState(tileStatePath));
    this.clearPathStack();
  }

  async applyStackAlgorithm(speedOverride: number = null) {
    this.emitDirectStateChange(this.getStartNodeLocationAndState(tileStateVisited));
    await this.sleep(speedOverride == null ? this.getCurrentSpeed().speedMS : speedOverride);

    for (const tile of this.tileStack) {
      this.emitStateChangeForLocation(tile);
      await this.sleep(speedOverride == null ? this.getCurrentSpeed().speedMS : speedOverride);
    }

    this.emitDirectStateChange(this.getEndNodeLocationAndState(tileStateVisited));

    this.applyFoundPath();
    this.clearTileStack();
  }

  async applyStackMaze(speedOverride: number = null) {
    for (const tile of this.tileStack) {
      this.emitStateChangeForLocation(tile);
      await this.sleep(speedOverride == null ? 25 : speedOverride);
    }
    this.clearTileStack();
  }

  public setGridStateData(tileStack: TileLocationAndState[]) {
    this.tileStack = tileStack;
  }

  public setShortestPathStateData(path: TileLocationAndState[]) {
    this.foundPathStack = path;
  }

  public getGridStateData(): TileLocationAndState[] {
    return this.tileStack;
  }

  public pushStateData(stateData: TileLocationAndState) {
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
    if (neighbor == null || array == null) { return false; }
    for (const tile of array) {
      if (this.coordinateSetsAreTheSame(neighbor, tile)) {
        return true;
      }
    }
    return false;
  }

  createTileLocationAndStateObject(currentTile: CoordinateSet, state: string = tileStateNormal, weight: number = 1): TileLocationAndState {
    return { coordinateX: currentTile.x, coordinateY: currentTile.y, tileState: state, tileWeight: weight};
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
    const neighbors: CoordinateSet[] = [];
    const neighborsWithinLimit: CoordinateSet[] = [];

    neighbors.push(this.getTileAbove(tile));
    neighbors.push(this.getTileBelow(tile));
    neighbors.push(this.getTileLeft(tile));
    neighbors.push(this.getTileRight(tile));

    for (const neighbor of neighbors) {
      if (this.withinGridLimit(neighbor)) { neighborsWithinLimit.push(neighbor); }
    }
    return neighborsWithinLimit;
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

  getTileCoordinates(index: number): CoordinateSet {
    for (const tile of this.gridState) {
      if (index === tile.tileIndex) {
        const tileCoordinates: CoordinateSet = { x: tile.coordinateX, y: tile.coordinateY };
        return tileCoordinates;
      }
    }
    return null;
  }

  private generateFreshGrid() {
    for (let i = 0; i < (gridXSize * gridYSize); i++) {
      const location = this.calculateGridLocation(i);
      const newTileStateObject: TileLocationAndState = { coordinateX: location[0],
                                                        coordinateY: location[1],
                                                        tileState: tileStateNormal,
                                                        tileWeight: 1,
                                                        tileIndex: i };
      this.gridState[i] = newTileStateObject;
    }
  }

  withinGridLimit(tile: CoordinateSet): boolean {
    if (tile.x < gridXSize && tile.x > -1 && tile.y < gridYSize && tile.y > -1) {
      return true;
    } else {
      return false;
    }
  }

  withinMazeLimit(tile: CoordinateSet): boolean {
    if (tile.x < gridXSize - 1 && tile.x > 0 && tile.y < gridYSize - 1 && tile.y > 0) {
      return true;
    } else {
      return false;
    }
  }

  mouseDown() {
    this.mousePressed = true;
  }

  mouseUp() {
    this.mousePressed = false;
    this.movingNode = emptyString;
  }

  getMouseState(): boolean {
    return this.mousePressed;
  }

  moveNode(movingNode: string) {
    this.movingNode = movingNode;
  }

  getMovingNode(): string {
    return this.movingNode;
  }

  isNodeMoving(): boolean {
    if (this.movingNode === emptyString) { return false; } else { return true; }
  }

  getTileNeighbor(tile: CoordinateSet, x: number, y: number): CoordinateSet {
    const neighbor: CoordinateSet = { x: tile.x + x, y: tile.y + y};
    if (this.withinGridLimit(neighbor)) {
      return neighbor;
    } else { return null; }
  }

  getTileBetween(tile1: CoordinateSet, tile2: CoordinateSet): CoordinateSet {
    return { x: (tile1.x + tile2.x) / 2, y: (tile1.y + tile2.y) / 2 };
  }
}
