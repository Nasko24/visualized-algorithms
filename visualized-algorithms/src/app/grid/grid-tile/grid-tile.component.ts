import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-grid-tile',
  templateUrl: './grid-tile.component.html',
  styleUrls: ['./grid-tile.component.css']
})
export class GridTileComponent implements OnInit {
  @Input() location: number;

  private gridLocation: number[];

  constructor() { }

  ngOnInit() {
    this.calculateGridLocation();
  }

  calculateGridLocation() {
    const xCoordinate = this.location % 62;
    const yCoordinate = Math.floor(this.location / 62);
    this.gridLocation = [xCoordinate, yCoordinate];
  }

}
