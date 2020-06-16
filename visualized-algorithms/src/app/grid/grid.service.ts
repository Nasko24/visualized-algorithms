import {Injectable} from '@angular/core';
import {
  defaultEndNode,
  defaultStartNode,
  gridSize,
  gridXSize,
  gridYSize,
  speedFast,
  tileStateNormal,
  tileStateVisited
} from '../constants/constants';
import {Subject} from 'rxjs';
import {Speed, TileLocationAndState} from '../constants/interfaces';
import Stack from 'ts-data.stack';
import {count} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GridService {
  private gridCellCount = gridSize;
  private stateChangeSource = new Subject<TileLocationAndState>();
  private currentSpeed: Speed = speedFast;
  private testStack: Stack<TileLocationAndState>;

  stateChange$ = this.stateChangeSource.asObservable();

  constructor() {
    this.testStack = new Stack<TileLocationAndState>();
  }

  getGridCellCount() {
    return this.gridCellCount;
  }

  emitStateChangeForLocation(data: TileLocationAndState) {
    this.stateChangeSource.next(data);
  }

  setCurrentSpeed(speed: Speed) {
    this.currentSpeed = speed;
    console.log('Current speed is set to: ' + speed.speedMS);
  }

  getCurrentSpeed(): Speed {
    return this.currentSpeed;
  }

  clearGrid() {
    for (let x = 0; x < gridXSize; x++) {
      for (let y = 0; y < gridYSize; y++) {
        const stateData: TileLocationAndState = {
          coordinateX: x,
          coordinateY: y,
          tileState: tileStateNormal};
        this.emitStateChangeForLocation(stateData);
      }
    }
  }

  getStartNodeLocation(): number[] {
    // TODO: service needs to know the actual start node location if its been moved
    return defaultStartNode;
  }

  getEndNodeLocation(): number[] {
    // TODO: service needs to know the actual end node location
    return defaultEndNode;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async applyStack() {
    // tslint:disable-next-line:no-shadowed-variable
    const count = this.testStack.count();
    for (let i = 0; i < count; i++) {
      this.emitStateChangeForLocation(this.testStack.pop());
      await this.sleep(this.getCurrentSpeed().speedMS);
    }
  }

  pushStateData(stateData: TileLocationAndState) {
    this.testStack.push(stateData);
  }
}
