import {Injectable} from '@angular/core';
import {GridService} from '../grid/grid.service';
import {algorithms} from '../constants/constants';
import {DijkstrasAlgorithm} from './dijkstras.algorithm';
import {AstarAlgorithm} from './astar.algorithm';

@Injectable({ providedIn: 'root' })
export class AlgorithmsService {
  constructor(public gridService: GridService) { }

  applyAlgorithm(algorithm: Algorithm) {
    switch (algorithm.name) {
      case algorithms[0].name: { // dijkstra's algorithm
        console.log('Executing pathfinding algorithm ' + algorithm.name);
        const algorithmObj = new DijkstrasAlgorithm(this.gridService);

        this.gridService.setGridStateData(algorithmObj.applyDijkstrasAlgorithm(
          this.gridService.getStartNodeLocation(),
          this.gridService.getEndNodeLocation()));

        this.gridService.applyStackAlgorithm();
        break;
      }
      case algorithms[1].name: {
        console.log('Executing pathfinding algorithm ' + algorithm.name);
        const algorithmObj = new AstarAlgorithm(this.gridService);

        this.gridService.setGridStateData(algorithmObj.applyAstarAlgorithm(
          this.gridService.getStartNodeLocation(),
          this.gridService.getEndNodeLocation()));

        this.gridService.applyStackAlgorithm();
        break;
      }
      default:
        console.log('Unable to find a maze');
    }
  }
}
