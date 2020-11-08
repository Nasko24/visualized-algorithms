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
    this.runSet.push(startingTile);
    this.addTileToGridStack(startingTile);

    let currentTile: CoordinateSet = startingTile;
    for (let row = 0; row < rowsToProcess; row++) {
      while (true) {
        // figure out which way we can carve from current tile
        this.setCarveUpOption(currentTile);
        this.setCarveRightOption(currentTile);

        if (!this.carveUp && this.carveRight) { // if we cant carve up but can carve out
        } else if (this.carveUp && this.carveRight) { // if we can carve up and carve out
        } else if (!this.carveUp && !this.carveRight) { // if we cant carve up or carve out
        } else { // if we can carve up but cant carve right
        }
      }
    }

    return this.gridStack;
  }

  private addTileToGridStack(tile: CoordinateSet) {
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(tile));
  }

  // this method looks at all tiles in the runSet and checks if it can carve up from any one of them
  private setCarveUpOption(currentTile: CoordinateSet) {
    // check if upper tile is within maze limits
    for (const setTile of this.runSet) {
      for (const gridTile of this.gridStack) {
        if (this.gridService.coordinateSetsAreTheSame(setTile, { x: gridTile.coordinateX, y: gridTile.coordinateY })) {
          this.carveUp = true;
          return;
        }
      }
    }
    this.carveUp = false;
  }

  // this method check if we can carve right from the passed in tile
  private setCarveRightOption(tile: CoordinateSet) {
    if (this.gridService.withinMazeLimit(this.gridService.getTileNeighbor(tile, 1, 0))) {
      this.carveRight = true;
    } else {
      this.carveRight = false;
    }
  }
}
