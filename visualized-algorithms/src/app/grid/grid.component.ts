import { Component, OnInit } from '@angular/core';
import { GridService } from './grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private gridCells: number[];

  constructor(public gridService: GridService) { }

  ngOnInit() {
    this.gridCells = Array(this.gridService.getGridCellCount());
  }
}
