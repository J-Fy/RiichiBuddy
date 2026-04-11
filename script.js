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

//Hint visuals
const hanBox = document.getElementById("hanBox")
const fuBox = document.getElementById("fuBox")
const fuText = document.getElementById("fuText")
const dealFlag = document.getElementById("dealFlag")
const nonFlag = document.getElementById("nonFlag")
const tsumoFlag = document.getElementById("tsumoFlag")
const ronFlag = document.getElementById("ronFlag")

//Flag used so dealer pay amount box only animates once
var settingHints;

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
popupCloseBtn.addEventListener('click', newHint);

//Gear icon - settings
const settingsBtn = document.getElementById("settingsIcon")
const settingsDialog = document.getElementById("settings");
const settingsCloseBtn = document.getElementById("closeSettings");
settingsBtn.addEventListener('click', openSettings);
settingsCloseBtn.addEventListener('click', closeSettings);

//Heart icon - donate dialog
const heartBtn = document.getElementById("heartIcon")
const heartDialog = document.getElementById("support");
const heartCloseBtn = document.getElementById("closeSupport");
heartBtn.addEventListener('click', () => heartDialog.showModal())
heartCloseBtn.addEventListener('click', () => heartDialog.close());


//Settings
var minHan;
var maxHan;
var minFu;
var maxFu;
var nonDealerEnabled;
var dealerEnabled;
var ronEnabled;
var tsumoEnabled;
var weightedMode; //Weights hints based on rarity
var randomMode; //Shuffles list before iterating
var baseMode; //Checks base point amount only
var shorthandMode; //Remove 00 from scores
var kiriageMode; //Rounds some values up to mangan
var autocheckMode; //Checks answers as you type
var reverseMode; //Provides a score as hint, user enters han & fu
var trueRandomMode; //list or trueRandom
var settingsChanged; //bool that restarts game if a setting was clicked
var digitLimit; //Number of digits allowed in answerboxes, 5 (default) or 3 (shorthand mode)
var hList; //Active han list (unweighted or weighted)
var fList; //Active fu list (unweighted or weighted)

const minHanSlider = document.getElementById('minHanSlider');
const minHanLabel = document.getElementById('minHanLabel');
const maxHanLabel = document.getElementById('maxHanLabel');
const maxHanSlider = document.getElementById('maxHanSlider');

const minFuSlider = document.getElementById('minFuSlider');
const maxFuSlider = document.getElementById('maxFuSlider');
const minFuLabel = document.getElementById('minFuLabel');
const maxFuLabel = document.getElementById('maxFuLabel');

const weightedSwitch = document.getElementById('ms-weighted');
const randomSwitch = document.getElementById('ms-random');
const kiriageSwitch = document.getElementById('ms-kiriage');
const shorthandSwitch = document.getElementById('ms-short');
const autocheckSwitch = document.getElementById('ms-autocheck');
const baseSwitch = document.getElementById('ms-base');
const reverseSwitch = document.getElementById('ms-reverse');
const trueRandomSwitch = document.getElementById('ms-trueRand')

settingsDialog.addEventListener("click", function(event){
    if (event.target.classList.contains("setting")){
        settingsChanged = true;
    }
});

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
};



function startGame(){
    console.log("I know you're reading this, please don't judge my ugly code. I'm a mainframe dev not a web dev");
    // apply settings
    minHan = hanList[minHanSlider.value];
    maxHan = hanList[maxHanSlider.value];
    if (minHan < 5) {
        minFu = fuList[minFuSlider.value];
        maxFu = fuList[maxFuSlider.value];
    }
    weightedMode = weightedSwitch.checked;
    randomMode = randomSwitch.checked;
    baseMode = baseSwitch.checked;
    shorthandMode = shorthandSwitch.checked;
    kiriageMode = kiriageSwitch.checked;
    autocheckMode = autocheckSwitch.checked;
    reverseMode = reverseSwitch.checked;
    trueRandomMode = trueRandomSwitch.checked;
    if (shorthandMode) {
        digitLimit = 3;
    } else {
        digitLimit = 5;
    };
    if (weightedMode) {
        hList = hanListWeighted;
        fList = fuListWeighted;
    } else {
        hList = hanList;
        fList = fuList;
    };
    // create list of hints 
    if (!trueRandomMode) {
        generateHintList();
    }
    // load the hint
    newHint();
};

function generateHintList(){
    hintList = [];
    iHint = 0;
    for (let x = 0; x < hList.length; x++) {
        if (hList[x] >= minHan && hList[x] <= maxHan) {
            han = hList[x];
            if (han > 4) {
                fu = '';
                generateHints();
            } else {
                for (let y = 0; y < fList.length; y++) {
                    if (fList[y] >= minFu && fList[y] <= maxFu) {
                        fu = fList[y];
                        generateHints();
                    };
                };
            };
        };
    };
    console.log(hintList);
    if (randomMode) {
        shuffle(hintList);
    };
    console.log(hintList);
};

function generateHints() {
    var hint;
    //      han,fu,tsumo,dealer
    hint = [han,fu,false,false];
    addHint(hint);
    if (!baseMode) {
        hint = [han,fu,false,true];
        addHint(hint);
        hint = [han,fu,true,true];
        addHint(hint);
        hint = [han,fu,true,false];
        addHint(hint);
    };
};

function addHint(hint) {
    if (!checkImpossible(hint)) {
        hintList.push(hint)
    }
}

function newHint() {
    popup.close()
    if (trueRandomMode) {
        newRandomHint()
    } else {
        nextListHint()
    }
    loadHint(han,fu,dealer,tsumo)
}

function nextListHint() {
    han = hintList[iHint][0];
    fu = hintList[iHint][1];
    tsumo = hintList[iHint][2];
    dealer = hintList[iHint][3];
    iHint ++;
    if (iHint == hintList.length){
        generateHintList();
    }
}

//For ListRandom
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

//TrueRandom
function newRandomHint() {
    han = hList[Math.floor(Math.random() * hList.length)]
    fu = fList[Math.floor(Math.random() * fList.length)]
    if (weightedMode){
        dealer = Math.random() < .33
    } else {
        dealer = Math.random() < .5
    }
    tsumo = Math.random() < .5
    while (checkImpossible([han,fu,tsumo]) == true){
        fu = fList[Math.floor(Math.random() * fList.length)]
    }
}

function loadHint(han,fu,dealer,tsumo){
    //initialize values
    currentGuess = 0
    pays.textContent = ""
    dealerPays.textContent = ""
    settingHints = true

    //grey out dealer pays box
    if (dealer || !tsumo || baseMode){
        dealerPays.style.borderColor = "rgb(44, 44, 44)"
        box2Enabled = false
    } else {
        box2Enabled = true
        dealerPays.style.borderColor = 'ButtonBorder'
    }

    // #TODO : pause other actions while animating goes, or cancel if support window is open
    //animate each item as it populates
    var timeout = 200;
    setTimeout(()=> {
        hanBox.textContent = han
        animateCSS(hanBox, 'pulse','0.5s')
    }, timeout);
    timeout += 200;

    setTimeout(()=> {
        if (han > 4){
            fuBox.classList.add('greyed')
            fuText.classList.add('greyed')
        } else {
            fuBox.classList.remove('greyed')
            fuText.classList.remove('greyed')
        }
        fuBox.textContent = fu
        animateCSS(fuBox, 'pulse','0.5s')
    }, timeout)
    timeout += 200;

    if (baseMode) {
        nonFlag.classList.add('greyed');
        dealFlag.classList.add('greyed');
        ronFlag.classList.add('greyed');
        tsumoFlag.classList.add('greyed');
    } else {
        setTimeout(()=> {
            if (dealer){
                nonFlag.classList.add('greyed');
                dealFlag.classList.remove('greyed');
                animateCSS(dealFlag, 'pulse','0.5s');
            } else {
                dealFlag.classList.add('greyed');
                nonFlag.classList.remove('greyed');
                animateCSS(nonFlag, 'pulse','0.5s');
            }
        }, timeout);
        timeout += 200;

        setTimeout(()=> {
            if (tsumo){
                ronFlag.classList.add('greyed');
                tsumoFlag.classList.remove('greyed');
                animateCSS(tsumoFlag, 'pulse','0.5s');
            } else {
                tsumoFlag.classList.add('greyed');
                ronFlag.classList.remove('greyed');
                animateCSS(ronFlag, 'pulse','0.5s');
            }
        }, timeout);
        timeout += 200;
    }
    

    setTimeout(()=> {
        toggleLitScore()
    }, timeout)
    timeout += 200;

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
    var scoreBox;
    if (currentGuess == 0){
        scoreBox = pays;
    } else {
        scoreBox = dealerPays;
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
        if (scoreBox.textContent.length != digitLimit){
            insertDigit(pressedKey,scoreBox)
        }
    }
})

//Insert digits into the guess box
function insertDigit(pressedKey,scoreBox){
    if (!(pressedKey == 0 && scoreBox.textContent.length == 0)){
        scoreBox.textContent += pressedKey
    }
    if (scoreBox.textContent.length == digitLimit){
        if (box2Enabled){
            currentGuess = 1
            toggleLitScore()
        }
    }
}

//Delete digits from the guess box
function deleteDigit (scoreBox) {
    scoreBox.textContent = scoreBox.textContent.slice(0,scoreBox.textContent.length - 1)
    if (scoreBox.textContent.length == 0) {
        currentGuess = 0
        toggleLitScore()
    }
}

function checkGuess() {
    if (box2Enabled && dealerPays.textContent == ""){
        currentGuess = 1;
        toggleLitScore();
        return;
    }
    if (pays.textContent == ""){
        toggleLitScore();
        return;
    }
    var base;
    var answer;
    let answer2 = 0;
    let correct = true;
    switch (han) {
        case 1:
        case 2:
        case 3:
        case 4:
            base = fu * 2 ** (2 + han);
            if (base > 2000) {
                base = 2000;
            }
            break;
        case 5:
            base = 2000;
            break;
        case 6:
        case 7:
            base = 3000;
            break;
        case 8:
        case 9:
        case 10:
            base = 4000;
            break;
        case 11:
        case 12:
            base = 6000;
            break;
        case 13:
            base = 8000;
            break;
    };
    if (kiriageMode && base > 1900) {
        base = 2000;
    };
    if (baseMode) {
        answer = base;
    } else {
        if (tsumo){
            if (dealer) {
                answer = base * 2;
            } else {
                answer = base
                answer2 = base * 2;
            };
        } else {
            if (dealer) {
                answer = base * 6;
            } else {
                answer = base * 4;
            };
        };
        //points round to the nearest 100
        answer = Math.ceil(answer / 100) * 100;
        answer2 = Math.ceil(answer2 / 100) * 100;
        if (shorthandMode) {
            answer = chop(answer);
            if (answer2 > 0) {
                answer2 = chop(answer2);
            };
        };
    };
    
    if (pays.textContent != answer) {
        correct = false
    };
    if (box2Enabled && dealerPays.textContent != answer2) {
        correct = false
    };

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

function chop(num) {
    var ans = String(num);
    ans = ans.slice(0, ans.length - 2);
    return Number(ans)
};

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

function openSettings() {
    settingsChanged = false;
    settingsDialog.showModal();
}

function closeSettings() {
    settingsDialog.close();
    if (settingsChanged) {
        startGame();
    }
    console.log(minHan, maxHan, minFu, maxFu);
    console.log(baseMode);
    
}

//Sliders Code
function controlSlider(max, minSlider, maxSlider, Label, labelList) {
  const [from, to] = getParsed(minSlider, maxSlider);
  fillSlider(minSlider, maxSlider, maxSlider);
  if (max) {
    if (from <= to) {
        maxSlider.value = to;
        Label.textContent = labelList[to];

    } else {
        maxSlider.value = from;
        Label.textContent = labelList[from];
    }
  } else {
    if (from > to) {
        minSlider.value = to;
        Label.textContent = labelList[to];
    } else {
        minSlider.value = from;
        Label.textContent = labelList[from];
    }
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

minHanSlider.oninput = () => {
    controlSlider(false, minHanSlider, maxHanSlider, minHanLabel, hanList);
    if (hanList[minHanSlider.value] > 4) {
        document.getElementById('fuRange').classList.add('dimmed');
    } else {
        document.getElementById('fuRange').classList.remove('dimmed');
    };
};
maxHanSlider.oninput = () => controlSlider(true, minHanSlider, maxHanSlider, maxHanLabel, hanList);
minFuSlider.oninput = () => controlSlider(false, minFuSlider, maxFuSlider, minFuLabel, fuList);
maxFuSlider.oninput = () => controlSlider(true, minFuSlider, maxFuSlider, maxFuLabel, fuList);
baseSwitch.oninput = () => shorthandSwitch.checked = false;
shorthandSwitch.oninput = () => baseSwitch.checked = false;




//Establish default settings (I'm doing this twice because firefox saves var values between reloads)
minHanSlider.value = 0;
maxHanSlider.value = 12;
minFuSlider.value = 0;
maxFuSlider.value = 10;
weightedSwitch.checked = true;
randomSwitch.checked = true;
baseSwitch.checked = false;
shorthandSwitch.checked = false;
kiriageSwitch.checked = false;
autocheckSwitch.checked = false;
reverseSwitch.checked = false;
trueRandomSwitch.checked = false;
settingsChanged = true;
fillSlider(minHanSlider, maxHanSlider, maxHanSlider);
fillSlider(minFuSlider, maxFuSlider, maxFuSlider);
startGame();
