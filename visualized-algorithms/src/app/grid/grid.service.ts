import {EventEmitter, Injectable} from '@angular/core';
import {gridSize, StateChange} from '../constants/constants';
import {Subject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GridService {
  private gridCellCount = gridSize;
  private stateChangeSource = new Subject<StateChange>();

  stateChange$ = this.stateChangeSource.asObservable();

  constructor() { }

  getGridCellCount() {
    return this.gridCellCount;
  }

  emitStateChangeForLocation(data: StateChange) {
    this.stateChangeSource.next(data);
  }
}
