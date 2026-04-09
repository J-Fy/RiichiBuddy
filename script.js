//List of han possible
const hanList = [
    //Base - Require Fu
    1,2,3,4,
    //Mangan
    5,
    //Haneman
    6,7,
    //Baiman
    8,9,10,
    //Sanbaiman
    11,12,
    //Yakuman
    13
]
//List of fu possible
const fuList = [
    20,25,30,40,50,60,70,80,90,100,110
]

//Lists with duplicates for weighted odds to practice the common values more
const hanListWeighted = [
    //Basic - Requires Fu
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,
    3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
    4,4,4,4,4,4,4,4,4,4,4,4,4,4,
    //Mangan
    5,5,5,5,5,5,
    //Haneman
    6,6,
    7,7,
    //Baiman
    8,
    9,
    10,
    //Sanbaiman
    11,
    12,
    //Yakuman
    13
]
const fuListWeighted = [
    20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,
    25,25,25,25,25,25, 
    30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,
    40,40,40,40,40,40,40,40,
    50,
    60,
    70,
    80,
    90,
    100,
    110
]

//Impossible values array contains mini arrays of [Han,Fu,Tsumo]
const impossibleValues = [
    //Pinfu tsumo (the only source of 20 fu) is 2 han 
    [1,20,true],
    //20 Fu not possible with ron
    [1,20,false],
    [2,20,false],
    [3,20,false],
    [4,20,false],
    //Chiitoitsu (the only source of 25 fu) is 2 han 
    [1,25,true],
    [1,25,false],
    //And chiitoitsu tsumo would be 3 han 
    [2,25,true], 
];

//The four primary hint variables and the list that will store all hints generated
var han;
var fu;
var dealer;
var tsumo;
let hintList = [];

//Flag used so dealer pay amount box only animates once
var settingHints;

//References the object of the current score box being typed in
var scoreBox;
//Flag that switches the scorebox variable between boxes
let currentGuess = 0;
//Scoreboxes
let box2Enabled = false;
const pays = document.getElementById("pays");
const dealerPays = document.getElementById("dealerPays");

//Dialogs
//failed guess popup
const popup = document.getElementById("incorrectPopup");
const popupCloseBtn = document.getElementById("closePopup");
popupCloseBtn.addEventListener('click', () => newHint());

//Gear icon - settings
const settingsBtn = document.getElementById("settingsIcon")
const settingsDialog = document.getElementById("settings");
const settingsCloseBtn = document.getElementById("closeSettings");
settingsBtn.addEventListener('click', () => settingsDialog.showModal())
settingsCloseBtn.addEventListener('click', () => settingsDialog.close());

//Heart icon - donate dialog
const heartBtn = document.getElementById("heartIcon")
const heartDialog = document.getElementById("support");
const heartCloseBtn = document.getElementById("closeSupport");
heartBtn.addEventListener('click', () => heartDialog.showModal())
heartCloseBtn.addEventListener('click', () => heartDialog.close());


//Settings
let minHan = 1;
let maxHan = 13;
let minFu = 20;
let maxFu = 110;
let nonDealerEnabled = true;
let dealerEnabled = true;
let ronEnabled = true;
let tsumoEnabled = true;
let weightedMode = true; //Weights hints based on rarity
let hintMode = 'list'; //list or trueRandom
let randomMode = true; //Shuffles list before iterating
let kiriageMode = false; //Rounds some values up to mangan
let shorthandMode = false; //Remove 00 from scores
let quickMode = false; //Checks answers as you type
let reverseMode = false; //Provides a score as hint, user enters han & fu
let reloadHints = false; //If certain settings were changed, reload hints

// counters
let iHint = 0;
let streak = 0;

//Settings for the answer check popups
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
    console.log("I know you're reading this, please don't judge my ugly code. I'm a mainframe dev not a web dev")
    generateHintList()
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
    popup.close()
    switch(hintMode) {
        case "list":
            nextListHint()
            break
        case "trueRandom":
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
        iHint = 0
        generateHintList()
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
    settingHints = true

    //grey out dealer pays box
    if (dealer || !tsumo){
        dealerPays.style.borderColor = "rgb(44, 44, 44)"
        box2Enabled = false
    } else {
        box2Enabled = true
        dealerPays.style.borderColor = 'ButtonBorder'
    }

    // #TODO : pause other actions while animating goes, or cancel if support window is open
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
            if (settingHints) {
                setTimeout(()=> {
                    animateCSS(dealerPays, 'pulse','0.5s')
                    settingHints = false
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
        if (scoreBox.textContent.length != 5){
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
        newHint()
    } else {
        let ansText = document.getElementById("correctAns")
        let message = answer 
        if (box2Enabled) {
            message += " and " + answer2
        }
        ansText.textContent = message
        popup.showModal()
        streak = 0
    }
}



//Animation Code
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


//SETTINGS CODE ********************************************************************************************************

//Sliders Code
function controlminSlider(minSlider, maxSlider, minLabel, labelList) {
  const [from, to] = getParsed(minSlider, maxSlider);
  fillSlider(minSlider, maxSlider, maxSlider);
  if (from > to) {
    minSlider.value = to;
    minLabel.textContent = labelList[to];
    console.log('bumpin')
  } else {
    minSlider.value = from;
    minLabel.textContent = labelList[from];
  }
}
function controlmaxSlider(minSlider, maxSlider, maxLabel, labelList) {
  const [from, to] = getParsed(minSlider, maxSlider);
  fillSlider(minSlider, maxSlider, maxSlider);
  if (from <= to) {
    maxSlider.value = to;
    maxLabel.textContent = labelList[to];
  } else {
      maxSlider.value = from;
      maxLabel.textContent = labelList[from];
  }
}
function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}
function fillSlider(from, to, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${'#C6C6C6'} 0%,
      ${'#C6C6C6'} ${(fromPosition)/(rangeDistance)*100}%,
      ${'rgb(103, 198, 241)'} ${(fromPosition)/(rangeDistance)*100}%,
      ${'rgb(103, 198, 241)'} ${(toPosition)/(rangeDistance)*100}%, 
      ${'#C6C6C6'} ${(toPosition)/(rangeDistance)*100}%, 
      ${'#C6C6C6'} 100%)`;
}

const minHanSlider = document.getElementById('minHanSlider');
const minHanLabel = document.getElementById('minHanLabel');
const maxHanLabel = document.getElementById('maxHanLabel');
const maxHanSlider = document.getElementById('maxHanSlider');

const minFuSlider = document.getElementById('minFuSlider');
const maxFuSlider = document.getElementById('maxFuSlider');
const minFuLabel = document.getElementById('minFuLabel');
const maxFuLabel = document.getElementById('maxFuLabel');

minHanSlider.oninput = () => controlminSlider(minHanSlider, maxHanSlider, minHanLabel, hanList);
maxHanSlider.oninput = () => controlmaxSlider(minHanSlider, maxHanSlider, maxHanLabel, hanList);
minFuSlider.oninput = () => controlminSlider(minFuSlider, maxFuSlider, minFuLabel, fuList);
maxFuSlider.oninput = () => controlmaxSlider(minFuSlider, maxFuSlider, maxFuLabel, fuList);







minHanSlider.value = 0;
maxHanSlider.value = 12;
minFuSlider.value = 0;
maxFuSlider.value = 10;
fillSlider(minHanSlider, maxHanSlider, maxHanSlider);
fillSlider(minFuSlider, maxFuSlider, maxFuSlider);
startGame();
