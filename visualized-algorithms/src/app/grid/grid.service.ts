import {EventEmitter, Injectable} from '@angular/core';
import {gridSize} from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class GridService {
  private gridCellCount = gridSize;
  private stateChangeEvent: EventEmitter<number[]> = new EventEmitter();

  constructor() { }

  getGridCellCount() {
    return this.gridCellCount;
  }

  private emitStateChangeForLocation(data: number[]) {
    this.stateChangeEvent.emit(data);
  }

  getStateChangeEventEmitter(): EventEmitter<number[]> {
    return this.stateChangeEvent;
  }
}
