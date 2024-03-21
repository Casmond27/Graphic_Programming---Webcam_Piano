/************************************************
#Further development
#Set the sound to play based on the grid that is activated
#With the higher position the grid is activated, 
#the louder the sound is played and vice versa
#
#1. Bottom of the webcam - no sound
#2. Top of the webcam - loudest sound played
#3. volume is set to negative so that higher height
    produce louder sound and vice versa
*************************************************/

//further development - implement a custom Note class
class Note {
    constructor(noteSize, notePos, noteState) {
        this.noteSize = noteSize;
        this.notePos = notePos;
        this.noteState = noteState;
    }
     getPositionAndColumn(x,gridHeight,noteSize){
        var positionAndState = [];
        var positionColumn = [];
        var stateColumn = [];
        for (var y=0;y<gridHeight;y+=noteSize){
            positionColumn.push(createVector(x+noteSize/4,y+noteSize/4));
            stateColumn.push(0);
        }
        positionAndState.push(positionColumn);
        positionAndState.push(stateColumn);
        return positionAndState;
    }
    
    drawOneNote(notes, x, y, i, j){
        var alpha = notes.noteState[i][j] * sin(x) * 200;
        //further development - customise the color and shape of the Note
        var c1 = color(255, 181, 46,alpha); //orange
        var c2 = color(255, 0, 255,alpha); //purple
        var mix = lerpColor(c1, c2, map(i, 0, notes.notePos.length, 0, 1));
        fill(mix);
        var s = notes.noteState[i][j];
        rect(x, y, notes.noteSize*s, notes.noteSize*s); //rectangle node
    }
    
}


class Grid {
  /////////////////////////////////
  constructor(_w, _h) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.notes = new Note(40, [], []);
      //further development - play sound depending on which note in the grid is activated
    this.monoSynth = new p5.MonoSynth();

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.notes.noteSize){
        var positionAndState = this.notes.getPositionAndColumn(x,_h,this.notes.noteSize);
        this.notes.notePos.push(positionAndState[0]);
        this.notes.noteState.push(positionAndState[1]);
      }
      
    }
  
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){
    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notes.notePos.length;i++){
      for (var j=0;j<this.notes.notePos[i].length;j++){
        var x = this.notes.notePos[i][j].x;
        var y = this.notes.notePos[i][j].y;
          
        if (this.notes.noteState[i][j] == 1) {
            //play sound where note appears
         let note = map(x, 0, img.width, 200, 500);
            //volume get louder as height increase and get softer as height decrease
         let volume = map(y, 0, img.height, -0.6, -0.3);
         userStartAudio();
         this.monoSynth.play(note, -volume, 0, 1/5);
        }
        if (this.notes.noteState[i][j] > 0) {
         this.notes.drawOneNote(this.notes, x, y, i, j);
        }
        this.notes.noteState[i][j]-=0.05;
        this.notes.noteState[i][j]=constrain(this.notes.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.notes.noteSize);
              var j = int(screenY/this.notes.noteSize);
              this.notes.noteState[i][j] = 1;
            }
        }
    }
  }
}
