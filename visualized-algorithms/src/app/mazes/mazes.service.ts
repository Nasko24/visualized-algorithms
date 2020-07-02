import {Injectable} from '@angular/core';
import {Maze} from '../constants/interfaces';
import {mazes} from '../constants/constants';
import {RecursiveBacktrackerMaze} from './recursive-backtracker.maze';
import {GridService} from '../grid/grid.service';

@Injectable({ providedIn: 'root' })
export class MazesService {
  constructor(public gridService: GridService) { }

  applyMaze(maze: Maze) {
    switch (maze.name) {
      case mazes[0].name: { // recursive-backtracker maze
        console.log('Executing maze ' + maze.name);
        const mazeObj = new RecursiveBacktrackerMaze(this.gridService);
        this.gridService.setGridToAllWalls();

        this.gridService.setGridStateData(mazeObj.generateMaze(this.gridService.createCoordinateSet(1, 1)));

        this.gridService.applyStackMaze();
        break;
      }
      default:
        console.log('Unable to find a maze');
    }
  }
}
