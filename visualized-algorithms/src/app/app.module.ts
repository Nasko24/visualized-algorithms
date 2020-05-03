import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule, MatDividerModule, MatGridListModule, MatIconModule, MatMenuModule, MatToolbarModule} from '@angular/material';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { KeyComponent } from './key/key.component';
import { GridComponent } from './grid/grid.component';
import { GridTileComponent } from './grid/grid-tile/grid-tile.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    KeyComponent,
    GridComponent,
    GridTileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
