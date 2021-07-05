class LoadingBar {
  constructor(size,nbOfBar) {
    this.size = size
    this.cursor = [0,0] //relative pos
    this.timer = null
    this.nbOfBar= nbOfBar
    this.t0 = new Date();
  }
  init() {
    process.stdout.cursorTo(0);
    process.stdout.write("\x1B[?25l");  //disable cursor
  }
  update(value){
    process.stdout.write(ansiEscapes.cursorUp(this.cursor[0]) + ansiEscapes.cursorLeft);
    this.cursor[0]=0;
    for(var a=0; a<this.nbOfBar; a++){
      process.stdout.write("<");
      for(var b=0; b<this.size; b++){
        if(b<=value[a])
          process.stdout.write("=");
        else
          process.stdout.write("-");
      }
      process.stdout.write(">");

      process.stdout.write("   "+value[a]+"/"+this.size+"     ");

      if(a<this.nbOfBar-1){
        process.stdout.write(ansiEscapes.cursorDown(1) + ansiEscapes.cursorLeft);
        this.cursor[0]++;
      }
    }
    process.stdout.write(ansiEscapes.cursorDown(1) + ansiEscapes.cursorLeft);
    this.cursor[0]++;

    var timeDiff = new Date() - this.t0; //in ms
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);
    process.stdout.write(seconds + " seconds");

  }
  reset_bar(id){
    console.log("hello")
  }
}

module.exports = LoadingBar;
