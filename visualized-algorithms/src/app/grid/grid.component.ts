import {Component, OnInit} from '@angular/core';
import { GridService } from './grid.service';
import {defaultGridHeight, defaultGridWidth, defaultTileSize, gridXSize, gridYSize} from '../constants/constants';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private gridCells: number[];

  public windowWidth: number = defaultGridWidth;
  public windowHeight: number = defaultGridHeight;
  public tileSize: number = defaultTileSize;

  largeGrid = false;

  constructor(public gridService: GridService) {
    // for (let i = 28; i >= 14; i--) {
    //   const gridWidth = (i * gridXSize) + (gridXSize + 1);
    //   const gridHeight = (i * gridYSize) + (gridYSize + 1);
    //
    //   console.log('Grid dimensions: ' + gridWidth + ' x ' + gridHeight + ' | Tile Size: ' + i);
    //
    //   if (window.innerWidth >= gridWidth && window.innerHeight >= gridHeight) {
    //     this.windowWidth = gridWidth;
    //     this.windowHeight = gridHeight;
    //     this.tileSize = i;
    //     break;
    //   }
    // }
  }

  ngOnInit() {
    this.gridCells = Array(this.gridService.getGridCellCount());
    this.largeGrid = true;
  }

  onResize() {
    console.log('Window resized to: ' + window.innerWidth + ' x ' + window.innerHeight);
  }
}
