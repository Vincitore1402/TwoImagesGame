import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor() { }
  // UI Elements
  heading:string = "Find 2 same images";
  score:string = "Score: ";

  // URLs with resources
  SIZE_URL:string = "https://kde.link/test/get_field_size.php";
  IMAGES_URL:string = "https://kde.link/test/";

  // Rows of field
  rows = [];
  // All cells
  cells = [];

  // Gotten data from script
  data;

  ngOnInit() {
    this.start();
  }

  start() {
    $.ajax({
      type: "GET",
      url: this.SIZE_URL,
      dataType: "json",
      success:  (data) => {
        this.data = data;
        this.clearField();
        this.createField(data.width, data.height);
        this.getAndFillImages(data.width, data.height);
        this.changeScore();
      }
    });
  }

  restartField() {
    // Start game with old sizes of field
    this.clearField();
    this.createField(this.data.width, this.data.height);
    this.getAndFillImages(this.data.width, this.data.height);
    this.changeScore();
  }

  // Clear field
  clearField() {
    this.rows = [];
    this.cells = []
  }

  // Create game field
  createField(width, height) {
    for (let i = 0; i < width; i++) {
      let row = {
        cells: []
      };
      for (let j = 0; j < height; j++) {
        row.cells[j] = {
          index : "0,0",
          bgImage: "",
          isHidden: true,
          isGuessed: false
        };
        row.cells[j].index = i + ',' + j;
      }
      this.rows.push(row);
    }

    // Push every cell to common array
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].cells.length; j++) {
        this.cells.push(this.rows[i].cells[j]);
      }
    }
  }

  // Get urls of images and fill the cells
  getAndFillImages(width, height) {
    let images = [];

    // Push urls of images from the resource to the array
    for (let i = 0; images.length != (width * height)/2; i++) {
      for (let j = 0; j < 10; j++) {
        if (images.length != (width * height)/2)
          images.push(this.IMAGES_URL + j + '.png');
      }
    }

    // Duplicate array with images
    let imagesToShow = images.concat(images);
    
    // Mix images
    imagesToShow.sort(() => {
      return Math.random() - 0.3;
    });

    // Set background image for cells
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].bgImage = imagesToShow[i];
    }
  }

  // Cell click event
  showCell(cell) {
    if (!cell.isGuessed) {
      // Show current cell
      cell.isHidden = false;

      // Get all no-guessed and no-hidden cells
      let currentCells = [];
      this.cells.forEach((cell) => {
        if (!cell.isGuessed && !cell.isHidden) {
          currentCells.push(cell);
        }
      });

      // If there are 2 cells
      if (currentCells.length === 2) {
        // Compare background images
        if (currentCells[0].bgImage === currentCells[1].bgImage) {
          // Guessed
          currentCells[0].isGuessed = true;
          currentCells[1].isGuessed = true;
          this.changeScore();
        } else {
          // Noguessed
          setTimeout(this.hideCells, 750, currentCells);
        }
      }
      this.checkForWin();
    }
  }

  hideCells(cells) {
    cells.forEach((cell) => {
      cell.isHidden = true;
    });
  }

  checkForWin() {
    // Get all guessed cells
    let guessedCells = [];
    this.cells.forEach((cell) => {
      if (cell.isGuessed) {
        guessedCells.push(cell);
      }
    });
    if (guessedCells.length === this.cells.length)
      this.heading = 'Congratulations! You won!';
  }

  changeScore() {
    // Get all guessed cells
    let guessedCells = [];
    this.cells.forEach((cell) => {
      if (cell.isGuessed) {
        guessedCells.push(cell);
      }
    });
    this.score = `Score: ${guessedCells.length/2}/${this.cells.length/2}`;
  }
}
