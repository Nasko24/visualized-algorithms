import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {

  private gridCells: number[];

  constructor() { }

  ngOnInit() {
    this.gridCells = Array(1536);
  }
}
