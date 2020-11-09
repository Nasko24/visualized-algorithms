import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';

export class SidewinderMaze {
  private gridStack: TileLocationAndState[];
  private carveUp: boolean;
  private carveRight: boolean;
  private runSet: CoordinateSet[];

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.carveUp = false;
    this.carveRight = true;
    this.runSet = [];
  }

  generateSidewinderMaze(startingTile: CoordinateSet, rowsToProcess: number) {
    for (let row = 0; row < rowsToProcess; row++) {
      let currentTile: CoordinateSet = this.gridService.createCoordinateSet(startingTile.x, (startingTile.y - (row * 2)));
      this.addTileToGridStack(currentTile);
      this.addTileToRunSet(currentTile);

      while (true) {
        // figure out which way we can carve from current tile
        this.setCarveUpOption(this.runSet);
        this.setCarveRightOption(currentTile);

        if (!this.carveUp && this.carveRight) { // if we cant carve up but can carve out
          currentTile = this.carveGridRight(currentTile);
        } else if (this.carveUp && this.carveRight) { // if we can carve up and carve out
          if ((Math.random()) > 0.8) {
            currentTile = this.carveGridUp(currentTile, this.runSet);
          } else {
            currentTile = this.carveGridRight(currentTile);
          }
        } else if (this.carveUp && !this.carveRight) { // if we can carve up but cant carve right
          currentTile = this.carveGridUp(currentTile, this.runSet);
        } else { // if we cant carve up or carve out
          this.addRunSetToGridStack();
          this.resetRunSet();
          break;
        }
      }
    }

    return this.gridStack;
  }

  private addTileToGridStack(tile: CoordinateSet) {
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(tile));
  }

  // this method looks at all tiles in the runSet and checks if it can carve up from any one of them
  private setCarveUpOption(runSet: CoordinateSet[]) {
    for (const setTile of runSet) {
      if (this.checkForTilesAbove(setTile)) {
        this.carveUp = true;
        return;
      }
    }
    this.carveUp = false;
  }

  // this method check if we can carve right from the passed in tile
  private setCarveRightOption(tile: CoordinateSet) {
    if (tile === null || tile === undefined) { this.carveRight = false; return; }
    if (this.gridService.withinMazeLimit(this.gridService.getTileNeighbor(tile, 1, 0))) {
      this.carveRight = true;
    } else {
      this.carveRight = false;
    }
  }

  private checkForTilesAbove(tile: CoordinateSet) {
    for (const gridTile of this.gridStack) {
      const tileAbove: CoordinateSet = this.gridService.getTileNeighbor(tile, 0, 2);
      if (tileAbove === null) { return false; }
      if (this.gridService.coordinateSetsAreTheSame(tileAbove, { x: gridTile.coordinateX, y: gridTile.coordinateY })) {
        return true;
      }
    }
    return false;
  }

  // this method will carve upwards from the tile passed in
  private carveGridUp(currentTile: CoordinateSet, runSet: CoordinateSet[]) {
    // get connections points for the current run stack
    const tilesAbove: CoordinateSet[] = this.getTilesAbove(runSet);

    // randomly choose a connection point
    const connectingTile: CoordinateSet = tilesAbove[Math.floor(Math.random() * tilesAbove.length)];

    // carve upwards by adding the tile between to the gridStack
    this.addTileToGridStack(this.gridService.getTileBetween(this.gridService.getTileNeighbor(connectingTile, 0, -2), connectingTile));

    // add everything in runSet to gridStack
    this.addRunSetToGridStack();

    // reset the runSet
    this.resetRunSet();

    // return new tile to carve from or return null
    const newTile: CoordinateSet = this.gridService.getTileNeighbor(currentTile, 2, 0);
    if (newTile === null) { return null; }
    if (this.gridService.withinMazeLimit(newTile)) { this.addTileToRunSet(newTile); return newTile; }
  }

  // this method will carve right by adding the next tile over to the runSet and returning it
  private carveGridRight(currentTile: CoordinateSet) {
    const rightTile: CoordinateSet = this.gridService.getTileNeighbor(currentTile, 1, 0);
    this.addTileToRunSet(rightTile);
    return rightTile;
  }

  private getTilesAbove(runSet: CoordinateSet[]): CoordinateSet[] {
    const tilesAbove: CoordinateSet[] = [];
    for (const runSetTile of runSet) {
      for (const gridTile of this.gridStack) {
        const tileAbove: CoordinateSet = this.gridService.getTileNeighbor(runSetTile, 0, 2);
        if (this.gridService.coordinateSetsAreTheSame(tileAbove, { x: gridTile.coordinateX, y: gridTile.coordinateY })) {
          tilesAbove.push({ x: gridTile.coordinateX, y: gridTile.coordinateY });
        }
      }
    }
    return tilesAbove;
  }

  private resetRunSet() {
    this.runSet = [];
  }

  private addTileToRunSet(newTile: CoordinateSet) {
    this.runSet.push(newTile);
  }

  private addRunSetToGridStack() {
    for (const tile of this.runSet) {
      this.addTileToGridStack(tile);
    }
  }
}
