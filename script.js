//score will be represented as: han, fu, tsumo (boolean), dealer (boolean, math impact only, not logic)
const hanList = [
    //Basic Shit - Requires Fu
    1,
    2,
    3,
    4,
    //Mangan
    5,
    //Haneman
    6,
    // 7,
    // //Baiman
    // 8,
    // 9,
    // 10,
    // //Sanbaiman
    // 11,
    // 12,
    // //Yakuman
    // 13
]
const fuList = [
    20,
    25, //Chiitoitsu
    30,
    40,
    // 50,
    // 60,
    // 70,
    // 80,
    // 90,
    // 100,
    // 110
]
// const hanListWeighted = [
//     //Basic - Requires Fu
//     // 1,1,1,1,1,1,1,1,1,1,1,1,1,1,
//     // 2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
//     // 3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
//     // 4,4,4,4,4,4,4,4,4,4,4,4,4,4,
//     //Mangan
//     5,5,5,5,5,5,5,
//     //Haneman
//     6,6,
//     7,7,
//     //Baiman
//     8,
//     9,
//     10,
//     //Sanbaiman
//     11,
//     12,
//     //Yakuman
//     13
// ]
// const fuListWeighted = [
//     20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,
//     25,25,25,25,25,25, 
//     30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,
//     40,40,40,40,40,40,40,40,
//     50,
//     60,
//     70,
//     80,
//     90,
//     100,
//     110
// ]

//Impossible values array contains mini arrays of [Han,Fu,Tsumo]
const impossibleValues = [
    //1 han cannot be 20 or 25
    [1,20,true],
    [1,25,true],
    [1,25,false],
    //Chiitoitsu tsumo cannot be 2 han
    [2,25,true],
    //20 Fu only possible with tsumo
    [1,20,false],
    [2,20,false],
    [3,20,false],
    [4,20,false]
];

var han;
var fu;
var dealer;
var tsumo;
var scoreBox;
var settinghints;
let hintList = [];
let hintMode = "list";
let iHint = 0;
let streak = 0;
let nextDigit = 0;
let currentGuess = 0;
let pays = document.getElementById("pays");
let dealerPays = document.getElementById("dealerPays");
let box2Enabled = false;

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-center",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "2000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function startGame(){

    console.log("I know you're reading this, please don't look at my code I know it's not pretty, I'm a mainframe dev not a web dev")
    if (hintMode == "list"){
        generateHintList()
    }
    newHint()
}

function generateHintList(){
    for (let x = 0; x < hanList.length; x++) {
        for (let y = 0; y < fuList.length; y++) {
            han = hanList[x]
            fu = fuList[y]
            if (hanList[x] > 4) {
                fu = ''
                if (y > 0){
                    console.log("buh")
                    break
                }
            }
            var hint
                //  han,fu,tsumo,dealer
            hint = [han,fu,false,false]
            addHint(hint)
            hint = [han,fu,false,true]
            addHint(hint)
            hint = [han,fu,true,true]
            addHint(hint)
            hint = [han,fu,true,false]
            addHint(hint)
            
        }
    }
    console.log(hintList)
}

function addHint(hint) {
    if (!checkImpossible(hint)) {
        hintList.push(hint)
    }
}

function newHint() {
    switch(hintMode) {
        case "list":
            nextListHint()
            break
        case "random":
            newRandomHint()
            break
    }
    moveHints(han,fu,dealer,tsumo)
}

function nextListHint() {
    han = hintList[iHint][0]
    fu = hintList[iHint][1]
    tsumo = hintList[iHint][2]
    dealer = hintList[iHint][3]
    iHint ++
    if (iHint == hintList.length){
        alert("You've reached the end of the options")
    }
}

function newRandomHint() {
    han = hanList[Math.floor(Math.random() * hanList.length)]
    fu = fuList[Math.floor(Math.random() * fuList.length)]
    dealer = Math.random() < .5
    tsumo = Math.random() < .5
    while (checkImpossible([han,fu,tsumo]) == true){
        fu = fuList[Math.floor(Math.random() * fuList.length)]
    }
}

function moveHints(han,fu,dealer,tsumo){
    //pull the divs from the document
    let hanBox = document.getElementById("hanBox")
    let fuBox = document.getElementById("fuBox")
    let dealFlag = document.getElementById("dealFlag")
    let nonFlag = document.getElementById("nonFlag")
    let tsumoFlag = document.getElementById("tsumoFlag")
    let ronFlag = document.getElementById("ronFlag")

    //initialize values
    currentGuess = 0
    pays.textContent = ""
    dealerPays.textContent = ""
    settinghints = true

    //grey out dealer pays box
    if (dealer || !tsumo){
        dealerPays.style.borderColor = "rgb(44, 44, 44)"
        box2Enabled = false
    } else {
        box2Enabled = true
        dealerPays.style.borderColor = 'ButtonBorder'
    }

    //animate each item as it populates
    setTimeout(()=> {
        hanBox.textContent = han
        animateCSS(hanBox, 'pulse','0.5s')
    }, 200)

    setTimeout(()=> {
        if (han > 4){
        let fuText = document.getElementById("fuText")
        let fuBox = document.getElementById("fuBox")
        fuBox.style.borderColor = "GrayText"
        fuBox.style.color = "GrayText"
        fuText.style.color = "GrayText"
        } else {
            fuBox.textContent = fu
        }
        animateCSS(fuBox, 'pulse','0.5s')
    }, 400)

    setTimeout(()=> {
        if (dealer){
            nonFlag.classList.add('greyed')
            dealFlag.classList.remove('greyed')
            animateCSS(dealFlag, 'pulse','0.5s')
        } else {
            dealFlag.classList.add('greyed')
            nonFlag.classList.remove('greyed')
            animateCSS(nonFlag, 'pulse','0.5s')
        }
        
    }, 600)
    
    setTimeout(()=> {
        if (tsumo){
            ronFlag.classList.add('greyed')
            tsumoFlag.classList.remove('greyed')
            animateCSS(tsumoFlag, 'pulse','0.5s')
        } else {
            tsumoFlag.classList.add('greyed')
            ronFlag.classList.remove('greyed')
            animateCSS(ronFlag, 'pulse','0.5s')
        }
    }, 800)

    setTimeout(()=> {
        toggleLitScore()
    }, 1000)

}

function toggleLitScore(){
    if (currentGuess == 0) {
        pays.style.borderColor = 'gainsboro'
        animateCSS(pays, 'pulse','0.5s')
        if (box2Enabled){
            dealerPays.style.borderColor = 'buttonborder'
            if (settinghints) {
                setTimeout(()=> {
                    animateCSS(dealerPays, 'pulse','0.5s')
                    settinghints = false
                }, 200)
            }
        }
    } else {
        pays.style.borderColor = 'buttonborder'
        if (box2Enabled){
            dealerPays.style.borderColor = 'gainsboro'
            animateCSS(dealerPays, 'pulse','0.5s')
        }
    }
}
    
function checkImpossible(arr) {
    for (let i = 0; i < impossibleValues.length; i++) {
        for (let x = 0; x < 3; x++){
            if (arr[x] == impossibleValues[i][x]){
                if (x == 2){
                    return true
                }
            } else {
                break
            }
            
        }
    }
    return false
}

//Accept input ***********************************************************************
//Clicking on the screen
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target

    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

//Typing on keyboard
document.addEventListener("keyup", (e) => {
    if (currentGuess == 0){
        scoreBox = pays
    } else {
        scoreBox = dealerPays
    }

    let pressedKey = String(e.key)
    let k = null
    //animate button
    switch (pressedKey){
        case "Backspace":
            k = document.getElementById('delBtn')
            break
        // case "Enter":
        //     k = document.getElementById('enterBtn')
        //     break
        case "0":
            k = document.getElementById('zeroBtn')
            break
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            k = document.getElementById("btn" + pressedKey)
            break
    }
    if (k != null){
        animateCSS(k,"pulse")
    }

    //Delete
    if (pressedKey === "Backspace") {
        deleteDigit(scoreBox)
        return
    }


    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[0-9]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        if (scoreBox.textContent.length != 6){
            insertDigit(pressedKey,scoreBox)
        }
    }
})

//Insert digits into the guess box
function insertDigit(pressedKey,scoreBox){
    if (!(pressedKey == 0 && scoreBox.textContent.length == 0)){
        scoreBox.textContent += pressedKey
    }
    if (scoreBox.textContent.length == 5){
        scoreBox.textContent = scoreBox.textContent.substring(0,2) + "," + scoreBox.textContent.substring(2,5)
        if (box2Enabled){
            currentGuess = 1
            toggleLitScore()
        }
    }
}

//Delete digits from the guess box
function deleteDigit () {
    if (scoreBox.textContent.length == 6){
        scoreBox.textContent = scoreBox.textContent.replace(",","")
    }
    scoreBox.textContent = scoreBox.textContent.slice(0,scoreBox.textContent.length - 1)
    if (scoreBox.textContent.length == 0) {
        currentGuess = 0
        toggleLitScore()
    }
}

function checkGuess() {
    if (box2Enabled && dealerPays.textContent == ""){
        currentGuess = 1
        toggleLitScore()
        return
    }
    var base
    var answer
    var answer2
    let correct = true
    switch (han) {
        case 1:
        case 2:
        case 3:
        case 4:
            base = fu * 2 ** (2 + han)
            if (base > 2000) {
                base = 2000
            }
            break
        case 5:
            base = 2000
            break
        case 6:
        case 7:
            base = 3000
            break
        case 8:
        case 9:
        case 10:
            base = 4000
            break
        case 11:
        case 12:
            base = 6000
            break
        case 13:
            base = 8000
            break 
    }

    if (tsumo){
        if (dealer) {
            answer = base * 2
        } else {
            answer = base
            answer2 = base * 2
        }
    } else {
        if (dealer) {
            answer = base * 6
        } else {
            answer = base * 4
        }

    }
    answer = Math.ceil(answer / 100) * 100
    if (answer2 > 0){
        answer2 = Math.ceil(answer2 / 100) * 100
    }
    if (pays.textContent.replace(",","") != answer) {
        correct = false
    }
    if (box2Enabled && dealerPays.textContent.replace(",","") != answer2) {
        correct = false
    }
    if (correct) {
        streak += 1
        toastr.success("Answer correct! Streak: " + streak)
    } else {
        let message = "Incorrect. The answer was " + answer 
        if (box2Enabled) {
            message += " and " + answer2
        }
        alert(message)
        streak = 0
    }
    newHint()
}

const animateCSS = (element, animation, duration, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    if (duration == undefined){
        duration = '0.1s'
    }
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', String(duration));

    node.classList.add(`${prefix}animated`, animationName);
    

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

nonFlag.classList.add('greyed');
dealFlag.classList.add('greyed');
ronFlag.classList.add('greyed');
tsumoFlag.classList.add('greyed');
startGame();