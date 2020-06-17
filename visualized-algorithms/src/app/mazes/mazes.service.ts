import {Injectable} from '@angular/core';
import {Maze, TileLocationAndState} from '../constants/interfaces';
import {mazes} from '../constants/constants';
import {RecursiveBacktrackerMaze} from './recursive-backtracker.maze';
import Stack from 'ts-data.stack';
import {GridService} from '../grid/grid.service';

@Injectable({ providedIn: 'root' })
export class MazesService {
  private gridStack: Stack<TileLocationAndState>;

  constructor(public gridService: GridService) { }

  applyMaze(maze: Maze) {
    switch (maze.name) {
      case mazes[0].name: { // recursive-backtracker maze
        console.log('Executing maze ' + maze.name);
        const mazeObj = new RecursiveBacktrackerMaze(this.gridService.getStartNodeLocation(),
          this.gridService.getEndNodeLocation(), [0, 0]);
        this.gridStack = mazeObj.generateMaze();
        while (this.gridStack.count() !== 0) {
          this.gridService.pushStateData(this.gridStack.pop());
        }
        this.gridService.applyStackMaze();
        break;
      }
      default:
        console.log('Unable to find a maze');
    }
  }
}
