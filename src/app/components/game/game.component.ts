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
  currentTime:string = "Timer: 00:00";
  timer;

  // URLs with resources (Update - size url doesnt work)
  // SIZE_URL:string = "https://kde.link/test/get_field_size.php";
  IMAGES_URL:string = "https://kde.link/test/";

  // Rows of field
  rows = [];
  // All cells
  cells = [];

  // Initial size of field
  data = {
    width: 4,
    height: 3
  };

  showChangeSizeButtons:boolean = false;
  
  ngOnInit() {
    this.start();
  }

  start() {
    this.clearField();
    this.createField(this.data.width, this.data.height);
    this.getAndFillImages(this.data.width, this.data.height);
    this.changeScore();
  }

  // Init game with small field (4x3)
  startSmallField() {
    this.data = {
      width: 4,
      height: 3
    }
    this.showChangeSizeButtons = false;
    this.start();
  }

   // Init game with normal field field (5x6)
  startNormalField() {
    this.data = {
      width: 6,
      height: 5
    }
    this.showChangeSizeButtons = false;
    this.start();
  }

  // Init game with large field (6x8)
  startLargeField() {
    this.data = {
      width: 6,
      height: 8
    }
    this.showChangeSizeButtons = false;
    this.start();
  }

  startGameTimer() {
    console.log('Timer started');
    let seconds = 0;
    let minutes = 0;
    this.timer = setInterval(() => {
        console.log('Interval started');
        if (seconds == 60) {
          minutes++;
          seconds = 0;
        } else {
          seconds++;
        }
        this.currentTime = `Time: ${minutes.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
      },1000);
    console.log('bruh');
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
    this.heading = "Find 2 same images";
    this.currentTime = "Time: 00:00";
    this.rows = [];
    this.cells = [];
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
          // No-guessed
          setTimeout(this.hideCells, 750, currentCells);
        }
      }
      // FIX No-hidden cells BUG
      if (currentCells.length > 2) {
        setTimeout(this.hideCells, 750, currentCells);
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
      //clearInterval(this.timer);
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
