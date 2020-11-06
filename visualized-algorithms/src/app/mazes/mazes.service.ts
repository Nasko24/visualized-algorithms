import {Injectable} from '@angular/core';
import {Maze} from '../constants/interfaces';
import {mazes} from '../constants/constants';
import {RecursiveBacktrackerMaze} from './recursive-backtracker.maze';
import {GridService} from '../grid/grid.service';
import {PrimsAlgorithmMaze} from './prims-algorithm.maze';

@Injectable({ providedIn: 'root' })
export class MazesService {
  constructor(public gridService: GridService) { }

  applyMaze(maze: Maze) {
    switch (maze.name) {
      case mazes[0].name: { // recursive-backtracker maze
        console.log('Executing maze ' + maze.name);
        const mazeObj = new RecursiveBacktrackerMaze(this.gridService);
        this.gridService.setGridToAllWalls();

        // sleep to let the animation finish
        this.gridService.sleep(1500).then(() => {
          this.gridService.setGridStateData(mazeObj.generateRecursiveBacktrackerMaze(
            this.gridService.createCoordinateSet(maze.startingLocation[0], maze.startingLocation[1])));

          this.gridService.applyStackMaze();
        });
        break;
      }
      case mazes[1].name: {
        console.log('Executing maze ' + maze.name);
        const mazeObj = new PrimsAlgorithmMaze(this.gridService);
        this.gridService.setGridToAllWalls();

        // sleep to let the animation finish
        this.gridService.sleep(1500).then(() => {
          this.gridService.setGridStateData(mazeObj.generatePrimsAlgorithmMaze(
            this.gridService.createCoordinateSet(maze.startingLocation[0], maze.startingLocation[1])));

          this.gridService.applyStackMaze();
        });
        break;
      }
      default:
        console.log('Unable to find a maze');
    }
  }
}
