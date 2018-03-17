//const modbusMaster = require("/dist/modbusMaster.js");



function renderConsole () {

    let windowSize = process.stdout.getWindowSize();
    let screenWidth = windowSize[0];
    let screenHeight = windowSize[1];

    let screen = "";
    for (let y=0; y<screenHeight; y++) {
        if ((y == 0) || (y == (screenHeight-1))) { for (let x=0; x<screenWidth; x++) { screen += '+'; } }
        else { 
            screen += '+';
            for (let x=1; x<screenWidth-1; x++) { screen += " "; }
            screen += '+';
        }
        if (y < (screenHeight-1)) { screen += "\n"; }
    }

    // Clear Screen
    process.stdout.write('\033[2J');
    process.stdout.write(screen);
}

setInterval(renderConsole, 250);