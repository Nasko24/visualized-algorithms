import {EventEmitter, Injectable} from '@angular/core';
import {gridSize, speedFast} from '../constants/constants';
import {Subject} from 'rxjs';
import {Speed, TileLocationAndState} from '../constants/interfaces';

@Injectable({ providedIn: 'root' })
export class GridService {
  private gridCellCount = gridSize;
  private stateChangeSource = new Subject<TileLocationAndState>();
  private currentSpeed: Speed = speedFast;

  stateChange$ = this.stateChangeSource.asObservable();

  constructor() { }

  getGridCellCount() {
    return this.gridCellCount;
  }

  emitStateChangeForLocation(data: TileLocationAndState) {
    this.stateChangeSource.next(data);
  }

  setCurrentSpeed(speed: Speed) {
    this.currentSpeed = speed;
  }

  getCurrentSpeed(): Speed {
    return this.currentSpeed;
  }
}
