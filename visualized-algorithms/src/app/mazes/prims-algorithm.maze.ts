import {GridService} from '../grid/grid.service';
import {CoordinateSet, TileLocationAndState} from '../constants/interfaces';

export class PrimsAlgorithmMaze {
  private gridStack: TileLocationAndState[];
  private frontierTiles: Set<number>;
  private unavailableTiles: Set<number>;

  constructor(public gridService: GridService) {
    this.gridStack = [];
    this.frontierTiles = new Set<number>();
    this.unavailableTiles = new Set<number>();
  }

  generatePrimsAlgorithmMaze(startingTile: CoordinateSet): TileLocationAndState[] {
    // ALGORITHM START
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(startingTile));
    this.getAvailableFrontierTiles(startingTile).forEach((item) => {
      this.frontierTiles.add(item);
    });
    this.unavailableTiles.add(this.gridService.getTileIndex(startingTile));

    // while we still have frontier tiles
    while (this.frontierTiles.size !== 0) {
      // keep looping

      // choose random frontier tile
      const arrayItems = Array.from(this.frontierTiles);
      const randomFrontierTile: number = arrayItems[Math.floor(Math.random() * arrayItems.length)];

      // connect frontier tile to other discovered tiles
      this.connectFrontierTile(randomFrontierTile);

      // remove connected frontier tile
      this.frontierTiles.delete(randomFrontierTile);

      // add frontier tiles
      if (this.gridService.withinMazeLimit(this.gridService.getTileCoordinates(randomFrontierTile))) {
        this.getAvailableFrontierTiles(this.gridService.getTileCoordinates(randomFrontierTile)).forEach((item) => {
          this.frontierTiles.add(item);
        });
      }
    }

    return this.gridStack;
  }

  private getAvailableFrontierTiles(tile: CoordinateSet): number[] {
    const frontiers: CoordinateSet[] = [this.gridService.getTileNeighbor(tile, 2, 0),
                        this.gridService.getTileNeighbor(tile, -2, 0),
                        this.gridService.getTileNeighbor(tile, 0, 2),
                        this.gridService.getTileNeighbor(tile, 0, -2)]
      .filter((neighbor) => {
          if (neighbor === null) { return false; } else { return true; }
      }).filter((neighbor) => {
        if (this.unavailableTiles.has(this.gridService.getTileIndex(neighbor))) { return false; } else { return true; }
      });
    return frontiers.map((value) => {
      return this.gridService.getTileIndex(value);
    });
  }

  private connectFrontierTile(frontierTile: number) {
    const availableConnections: CoordinateSet[] = [
      this.gridService.getTileNeighbor(this.gridService.getTileCoordinates(frontierTile), 2, 0),
      this.gridService.getTileNeighbor(this.gridService.getTileCoordinates(frontierTile), -2, 0),
      this.gridService.getTileNeighbor(this.gridService.getTileCoordinates(frontierTile), 0, 2),
      this.gridService.getTileNeighbor(this.gridService.getTileCoordinates(frontierTile), 0, -2)
    ].filter((connection) => {
      if (connection === null) { return false; } else { return true; }
    }).filter((connection) => {
      if (this.unavailableTiles.has(this.gridService.getTileIndex(connection))) { return true; } else { return false; }
    });

    const arrayItems = Array.from(availableConnections);
    const randomlyChosenConnection: CoordinateSet = arrayItems[Math.floor(Math.random() * arrayItems.length)];

    // add frontier tile and connecting tile to stacks
    if (this.gridService.withinMazeLimit(this.gridService.getTileCoordinates(frontierTile))) {
      this.addTileToGridStack(this.gridService.getTileCoordinates(frontierTile));
      this.addTileToUnavailableTiles(frontierTile);
    }
    const tileInBetween: CoordinateSet = this.gridService.getTileBetween(
      this.gridService.getTileCoordinates(frontierTile), randomlyChosenConnection
    );
    this.addTileToGridStack(tileInBetween);
    this.addTileToUnavailableTiles(this.gridService.getTileIndex(tileInBetween));
  }

  private addTileToGridStack(tile: CoordinateSet) {
    this.gridStack.push(this.gridService.createTileLocationAndStateObject(tile));
  }

  private addTileToUnavailableTiles(tile: number) {
    this.unavailableTiles.add(tile);
  }
}
