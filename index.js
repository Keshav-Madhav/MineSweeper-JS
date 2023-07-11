var board=[];
var rows=30;
var columns=30;
var mineCount=100;
var minesLocation=[];

var tilesClicked=0;
var flagged=false;
var gameOver=false;

var startTime;
var timerInterval;

window.onload=function(){
    startGame();
}

function startGame(){
    document.getElementById("count").innerText=mineCount;
    document.getElementById("flag").addEventListener("click",setFlag);

    setMines();

    setBoard();
}

function setBoard(){
    for(let r=0;r<rows;r++){
        let row=[]
        for(let c=0;c<columns;c++){
            let tile=document.createElement("div");
            tile.id=r.toString()+"-"+c.toString();
            tile.addEventListener("click",clickTile);
            document.getElementById("board").append(tile)
            row.push(tile);
        }
        board.push(row);
    }
}

function resetBoard(){
    document.getElementById("board").innerHTML = "";
    board = [];
    minesLocation = [];
    tilesClicked = 0;
    flagged = false;
    gameOver = false;
}

document.getElementById("start").addEventListener("click",function(){
    rows=parseInt(document.getElementById("rowInp").value);
    columns=parseInt(document.getElementById("columnInp").value);
    mineCount=parseInt(document.getElementById("mineIn").value);
    document.getElementById("board").style.gridTemplateColumns=`repeat(${columns},1fr)`;
    document.getElementById("board").style.gridTemplateRows=`repeat(${rows},1fr)`;
    resetBoard();
    startTimer();
    startGame();
})

function setFlag(){
    if (flagged){
        flagged=false;
        document.getElementById("flag").style.backgroundColor="lightgray";
    }
    else{
        flagged=true;
        document.getElementById("flag").style.backgroundColor="darkgray";
    }
}

function clickTile(){
    if(gameOver || this.classList.contains("tile-clicked")){
        return; 
    }
    let tile=this;
    if(flagged){
        if(tile.innerText==''){
            tile.innerText="🚩";
        }
        else if(tile.innerText=="🚩"){
            tile.innerText="";
        }
        return;
    }

    if(minesLocation.includes(tile.id)){
        gameOver=true;
        stopTimer();
        revealMines();
        return;
    }

    let coords=tile.id.split("-");
    let r=parseInt(coords[0]);
    let c=parseInt(coords[1]);
    checkMine(r,c);
}

function setMines(){
    let minesLeft=mineCount;
    while(minesLeft>0){
        let r=Math.floor(Math.random()*rows);
        let c=Math.floor(Math.random()*columns)
        let id=r.toString()+"-"+c.toString();

        if(!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft--;
        }
    }
}

function revealMines(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile=board[r][c];
            if(minesLocation.includes(tile.id)){
                tile.innerText="💣";
                tile.style.backgroundColor="red";
            }
        }
    }
}

function checkMine(r,c){
    if(r<0 || r>=rows || c<0 || c>=columns){
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")){
        return;
    }

    board[r][c].classList.add("tile-clicked")
    tilesClicked+=1

    let minesFound=0;

    minesFound+=checkTile(r-1,c-1);
    minesFound+=checkTile(r-1,c);
    minesFound+=checkTile(r-1,c+1);
    minesFound+=checkTile(r,c-1);
    minesFound+=checkTile(r,c+1);
    minesFound+=checkTile(r+1,c-1);
    minesFound+=checkTile(r+1,c);
    minesFound+=checkTile(r+1,c+1);

    if(minesFound>0){
        board[r][c].innerText=minesFound;
        board[r][c].classList.add("x"+minesFound.toString());   
    }
    else{
        checkMine(r-1,c-1);
        checkMine(r-1,c);
        checkMine(r-1,c+1);
        checkMine(r,c-1);
        checkMine(r,c+1);
        checkMine(r+1,c-1);
        checkMine(r+1,c);
        checkMine(r+1,c+1);
    }

    if(tilesClicked==rows*columns-mineCount){
        document.getElementById("count").innerText="cleared";
        gameOver=true;
        stopTimer();
    }
}

function checkTile(r,c){
    if(r<0 || r>=rows || c<0 || c>=columns){
        return 0;
    }

    if(minesLocation.includes(r.toString()+"-"+c.toString())){
        return 1;
    }
    return 0;
}


function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(function() {
        var elapsedTime = Date.now() - startTime;
        var seconds = Math.floor(elapsedTime / 1000);
        var minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        document.getElementById("time").innerText = minutes + ":" + seconds;
        if (minutes == 30) {
            stopTimer();
        }
    }, 1000);
}

function stopTimer(){
    clearInterval(timerInterval);
}