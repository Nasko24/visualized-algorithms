import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GridService {
  private grid: string[][];
  private gridCellCount = 1488;

  constructor() { }

  getGridCellCount() {
    return this.gridCellCount;
  }
}
