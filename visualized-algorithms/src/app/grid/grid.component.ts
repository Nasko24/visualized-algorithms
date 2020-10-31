import {Component, OnInit} from '@angular/core';
import { GridService } from './grid.service';
import {gridXSize, gridYSize} from '../constants/constants';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private gridCells: number[];

  public sizes: boolean[] = [false, false, false, false, false,
                              false, false, false, false, false,
                              false, false, false, false, false];

  private currentSelectedSizeIndex: number = null;

  constructor(public gridService: GridService) { }

  ngOnInit() {
    this.gridCells = Array(this.gridService.getGridCellCount());
    this.calculateGridSize();
  }

  onResize() {
    console.log('Window resized to: ' + window.innerWidth + ' x ' + window.innerHeight);
    this.calculateGridSize();
  }

  calculateGridSize() {
    for (let i = 28; i >= 14; i--) {
      const gridWidth = (i * gridXSize) + (gridXSize + 1);
      const gridHeight = (i * gridYSize) + (gridYSize + 1);

      if (window.innerWidth >= gridWidth && window.innerHeight >= gridHeight) {
        this.resetSizes();
        this.setGridSize(i - 14);
        this.setCurrentSizeIndex(i - 14);
        break;
      }
    }
  }

  getGridSize(sizeIndex: number) {
    return this.sizes[sizeIndex];
  }

  setGridSize(sizeIndex: number) {
    this.sizes[sizeIndex] = true;
  }

  private resetSizes() {
    this.sizes[this.currentSelectedSizeIndex] = false;
    this.setCurrentSizeIndex(null);
  }

  private setCurrentSizeIndex(value: any) {
    this.currentSelectedSizeIndex = value;
  }
}
