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
];
//List of fu possible
const fuList = [
    20,25,30,40,50,60,70,80,90,100,110
];

//Lists with duplicates for weighted odds to practice the common values more
const hanListWeighted = [
    //Basic - Requires Fu
    1,1,1,1,1,1,1,1,1,1,1,1,1,                   //13%
    2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,       //19%
    3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3, //21%
    4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,       //19%
    //Mangan 13%
    5,5,5,5,5,5,5,5,5,5,5,5,5,
    //Haneman 9%
    6,6,6,6,6,6, //6%
    7,7,7,       //3%
    //Baiman 3%
    8,
    9,
    10,
    //Sanbaiman 2%
    11,
    12,
    //Yakuman 1%
    13
];
const fuListWeighted = [
    //Common 91%
        //12%
    20,20,20,20,20,20,20,20,20,20,20,20,
        //5%
    25,25,25,25,25,
        //47%
    30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,
        //26%
    40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,
    //Uncommon 5%
    50,50,50,
    60,60,
    //Rare 5%
    70,
    80,
    90,
    100,
    110
];

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

//The four primary hint variables
var han;
var fu;
var dealer;
var tsumo;
//List that will hold the hints
let hintList = [];
//Variables holding the answers
var base;
var answer1;
var answer2;

//Hint visuals
const hanBox = document.getElementById("hanBox");
const fuBox = document.getElementById("fuBox");
const fuText = document.getElementById("fuText");
const dealFlag = document.getElementById("dealFlag");
const nonFlag = document.getElementById("nonFlag");
const tsumoFlag = document.getElementById("tsumoFlag");
const ronFlag = document.getElementById("ronFlag");

//Flag is true while UI is animating the hints
var settingHints;

//Scoreboxes
let box2Enabled = false;
let selectedBox = 1;
const ansBox1 = document.getElementById("box1");
const box1caption = document.getElementById("cap1");
const ansBox2 = document.getElementById("box2");
const box2caption = document.getElementById("cap2");

//Dialogs
//failed guess popup
const popup = document.getElementById("incorrectPopup");
const popupCloseBtn = document.getElementById("closePopup");
popupCloseBtn.addEventListener('click', newHint);

//Table icon - score table 
const tableBtn = document.getElementById("tableIcon");
const tableDialog = document.getElementById("table");
const tableCloseBtn = document.getElementById("closeTable")
tableBtn.addEventListener('click', () => tableDialog.showModal());
tableCloseBtn.addEventListener('click', () => tableDialog.close());

//Gear icon - settings
const settingsBtn = document.getElementById("settingsIcon");
const settingsDialog = document.getElementById("settings");
const settingsCloseBtn = document.getElementById("closeSettings");
settingsBtn.addEventListener('click', openSettings);
settingsCloseBtn.addEventListener('click', closeSettings);

//Heart icon - donate dialog
const heartBtn = document.getElementById("heartIcon");
const heartDialog = document.getElementById("support");
const heartCloseBtn = document.getElementById("closeSupport");
heartBtn.addEventListener('click', () => heartDialog.showModal());
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

//Settings elements
const minHanSlider = document.getElementById('minHanSlider');
const minHanLabel = document.getElementById('minHanLabel');
const maxHanLabel = document.getElementById('maxHanLabel');
const maxHanSlider = document.getElementById('maxHanSlider');

const minFuSlider = document.getElementById('minFuSlider');
const maxFuSlider = document.getElementById('maxFuSlider');
const minFuLabel = document.getElementById('minFuLabel');
const maxFuLabel = document.getElementById('maxFuLabel');

const dealOnlySwitch = document.getElementById('switch-D');
const dealBothSwitch = document.getElementById('switch-BD');
const nonOnlySwitch = document.getElementById('switch-N');

const ronOnlySwitch = document.getElementById('switch-R');
const ronBothSwitch = document.getElementById('switch-BR');
const tsumoOnlySwitch = document.getElementById('switch-T');

const weightedSwitch = document.getElementById('ms-weighted');
const randomSwitch = document.getElementById('ms-random');
const kiriageSwitch = document.getElementById('ms-kiriage');
const shorthandSwitch = document.getElementById('ms-short');
const autocheckSwitch = document.getElementById('ms-autocheck');
const baseSwitch = document.getElementById('ms-base');
const reverseSwitch = document.getElementById('ms-reverse');
const trueRandomSwitch = document.getElementById('ms-trueRand');

settingsDialog.addEventListener("click", function(event){
    if (event.target.classList.contains("setting")){
        settingsChanged = true;
    };
});

// counters
let iHint = 0;
let streak = 0;

//Settings for the answer check popups
toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": true,
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
    streak = 0;
    // apply settings
    weightedMode = weightedSwitch.checked;
    randomMode = randomSwitch.checked;
    baseMode = baseSwitch.checked;
    shorthandMode = shorthandSwitch.checked;
    kiriageMode = kiriageSwitch.checked;
    autocheckMode = autocheckSwitch.checked;
    reverseMode = reverseSwitch.checked;
    trueRandomMode = trueRandomSwitch.checked;
    dealerEnabled = !nonOnlySwitch.checked;
    nonDealerEnabled = !dealOnlySwitch.checked;
    ronEnabled = !tsumoOnlySwitch.checked;
    tsumoEnabled = !ronOnlySwitch.checked;
    if (reverseMode) {
        minHan = hanList[0];
        maxHan = hanList[3];
        minFu = fuList[0];
        maxFu = fuList[4];
        weightedMode = false;
        baseMode = false;
        trueRandomMode = false;
        shorthandMode = false;
        kiriageMode = false;
        autocheckMode = false;
        //TODO add autocheck for reverse mode
    } else {
        minHan = hanList[minHanSlider.value];
        maxHan = hanList[maxHanSlider.value];
        if (minHan < 5) {
            minFu = fuList[minFuSlider.value];
            maxFu = fuList[maxFuSlider.value];
        };
    };
    if (baseMode || reverseMode || (!tsumoEnabled && !nonDealerEnabled)) {
        ansBox2.style.display = "none";
    } else {
        ansBox2.style.display = "";
    };
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
    if (autocheckMode) {
        document.getElementById('enterBtn').style.display = "none";
    } else {
        document.getElementById('enterBtn').style.display = "";
    };
    // create list of hints 
    generateHintList();
    //Close the settings window (if it's open) and start the game by loading the first hint
    settingsDialog.close();
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
    if (hintList.length === 0) {
        hintList.push([13,"",true,false]);
        toastr["warning"]("No questions could be generated. Please adjust your han/fu settings");
    };
    if (randomMode) {
        shuffle(hintList);
    };
};

function generateHints() {
    var hint;
    //hint is formatted as: [han,fu,dealer,tsumo]
    if (baseMode) {
        hint = [han,fu,false,true];
        addHint(hint);
    } else {
        if (ronEnabled && nonDealerEnabled) {
            hint = [han,fu,false,false];
            addHint(hint);
        };
        if (ronEnabled && dealerEnabled) {
            hint = [han,fu,false,true];
            addHint(hint);
        };
        if (tsumoEnabled && dealerEnabled ) {
            hint = [han,fu,true,true];
            addHint(hint);
        };
        if (tsumoEnabled && nonDealerEnabled) {
            hint = [han,fu,true,false];
            addHint(hint);
        };
    };
};

function addHint(hint) {
    if (!checkImpossible(hint)) {
        hintList.push(hint);
    };
};

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
  };
};

function newHint() {
    popup.close();
    if (trueRandomMode) {
        newRandomHint();
    } else {
        nextListHint();
    };
    [answer1, answer2] = calcAnswer(han,fu);
    loadHint();
};

//TrueRandom
function newRandomHint() {
    let hanFiltered = [];
    let fuFiltered = [];
    hList.forEach((item) => {
        if (item >= minHan && item <= maxHan ) {
            hanFiltered.push(item);
        };
    });
    fList.forEach((item) => {
        if (item >= minFu && item <= maxFu) {
            fuFiltered.push(item);
        };
    });
    han = hanFiltered[Math.floor(Math.random() * hanFiltered.length)];
    fu = fuFiltered[Math.floor(Math.random() * fuFiltered.length)];
    if (dealerEnabled && nonDealerEnabled) {
        if (weightedMode){
            dealer = Math.random() < .33;
        } else {
            dealer = Math.random() < .5;
        };
    } else {
        if (dealerEnabled) {
            dealer = true;
        } else {
            dealer = false;
        };
    };
    if (tsumoEnabled && ronEnabled) {
        tsumo = Math.random() < .5;
    } else {
        if (tsumoEnabled) {
            tsumo = true;
        } else {
            tsumo = false;
        };
    };
    while (checkImpossible([han,fu,tsumo]) == true){
        fu = fList[Math.floor(Math.random() * fList.length)];
    };
};

function nextListHint() {
    if (iHint == hintList.length){
        generateHintList();
    };
    han = hintList[iHint][0];
    fu = hintList[iHint][1];
    dealer = hintList[iHint][2];
    tsumo = hintList[iHint][3];
    iHint ++;
};

//Accepts han & fu, returns player pay amt and dealer pay amt
function calcAnswer(han,fu) {
    base = 0;
    let pts1 = 0;
    let pts2 = 0;
    switch (han) {
        case 1:
        case 2:
        case 3:
        case 4:
            base = fu * 2 ** (2 + han);
            if (base > 2000 || (kiriageMode && base > 1900)) {
                base = 2000;
            };
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
    if (baseMode) {
        pts1 = base;
    } else {
        if (tsumo){
            if (dealer) {
                pts1 = base * 2;
            } else {
                pts1 = base;
                pts2 = base * 2;
            };
        } else {
            if (dealer) {
                pts1 = base * 6;
            } else {
                pts1 = base * 4;
            };
        };
        //points round to the next 100
        pts1 = Math.ceil(pts1 / 100) * 100;
        pts2 = Math.ceil(pts2 / 100) * 100;
    };
    if (shorthandMode) {
        //remove extra zeroes
        pts1 = chop(pts1);
        if (pts2 > 0) {
            pts2 = chop(pts2);
        };
    };
    return [pts1, pts2];
};

//For shorthand mode, removes 00 from the end of the answers
function chop(num) {
    var ans = String(num);
    ans = baseMode ? ans.slice(0, ans.length - 1) : ans.slice(0, ans.length - 2);
    return Number(ans);
};

function loadHint(){
    //initialize values
    selectedBox = 1;
    ansBox1.textContent = "";
    ansBox2.textContent = "";
    // box1caption.textContent = "";
    box2caption.textContent = "";
    settingHints = true;

    //grey out box 2
    if (dealer || !tsumo || baseMode){
        ansBox2.style.borderColor = "rgb(44, 44, 44)";
        box2Enabled = false;
        box2caption.textContent = '';
    } else {
        box2Enabled = true;
        ansBox2.style.borderColor = 'ButtonBorder';
    };

    //Populate boxes, timeout makes them populate and animate one at a time
    var timeout = 200;
    if (!reverseMode) {
        setTimeout(()=> {
            hanBox.textContent = han;
            animateCSS(hanBox, 'pulse','0.5s');
        }, timeout);
        timeout += 200;
        setTimeout(()=> {
            if (han > 4){
                fuBox.classList.add('greyed');
                fuText.classList.add('greyed');
            } else {
                fuBox.classList.remove('greyed');
                fuText.classList.remove('greyed');
            };
            if (!(fuBox.textContent == "" && fu == "")) {
                animateCSS(fuBox, 'pulse','0.5s');
            };
            fuBox.textContent = fu;
        }, timeout);
        if (!(fuBox.textContent == "" && fu == "")) {
                timeout += 200;
        };
    } else {
        hanBox.textContent = '';
        fuBox.textContent = '';
        ansBox1.style.borderColor = 'buttonborder';
    };

    if (!baseMode) {
        setTimeout(()=> {
            if (dealer){
                nonFlag.classList.remove('dealLit');
                dealFlag.classList.add('dealLit');
                animateCSS(dealFlag, 'pulse','0.5s');
            } else {
                dealFlag.classList.remove('dealLit');
                nonFlag.classList.add('dealLit');
                animateCSS(nonFlag, 'pulse','0.5s');
            };
        }, timeout);
        timeout += 200;

        setTimeout(()=> {
            if (tsumo){
                ronFlag.classList.remove('tsumoLit');
                tsumoFlag.classList.add('tsumoLit');
                animateCSS(tsumoFlag, 'pulse','0.5s');
            } else {
                tsumoFlag.classList.remove('tsumoLit');
                ronFlag.classList.add('tsumoLit');
                animateCSS(ronFlag, 'pulse','0.5s');
            };
        }, timeout);
        timeout += 200;
    };

    // if (reverseMode) {
        timeout = populateScoreBoxes(timeout);
    // };

    setTimeout(()=> {
        toggleLitScore()
        settingHints = false;
    }, timeout);
    timeout += 200;
};

function populateScoreBoxes(t) {
    setTimeout(()=> {
        if (reverseMode) {
            ansBox1.textContent = answer1;
        };
        if (!tsumo) {
            box1caption.textContent = 'Player pays';
        } else {
            if (dealer) {
                box1caption.textContent = 'All pay';
            } else {
                box1caption.textContent = 'Players pay';
            };
        };
        animateCSS(ansBox1, 'pulse','0.5s');
        animateCSS(box1caption, 'pulse','0.5s');
    }, t);
    t += 200;
    if (box2Enabled) {
        setTimeout(()=> {
            if (reverseMode) {
                ansBox2.textContent = answer2;
            };
            box2caption.textContent = 'Dealer pays';
            animateCSS(ansBox2, 'pulse','0.5s');
            animateCSS(box2caption, 'pulse','0.5s');
        }, t);
        t += 200;
    };
    return t;
};

function toggleLitScore(){
    if (selectedBox == 1) {
        if (!reverseMode) {
            ansBox1.style.borderColor = 'gainsboro';
            if (box2Enabled) {
                ansBox2.style.borderColor = 'buttonborder';
            }
            animateCSS(ansBox1, 'pulse','0.5s');
        } else {
            hanBox.style.borderColor = 'gainsboro';
            fuBox.style.borderColor = 'buttonborder';
            animateCSS(hanBox, 'pulse','0.5s');
        };
    } else {
        if (!reverseMode){
            ansBox1.style.borderColor = 'buttonborder';
            if (box2Enabled){
                ansBox2.style.borderColor = 'gainsboro';
                animateCSS(ansBox2, 'pulse','0.5s');
            };
        } else {
            hanBox.style.borderColor = 'buttonborder';
            fuBox.style.borderColor = 'gainsboro';
            animateCSS(fuBox, 'pulse','0.5s');
        }
    };
};
    
function checkImpossible(arr) {
    for (let i = 0; i < impossibleValues.length; i++) {
        for (let x = 0; x < 3; x++){
            if (arr[x] == impossibleValues[i][x]){
                if (x == 2){
                    return true;
                };
            } else {
                break;
            };
            
        };
    };
    return false;
};

//Accept input ***********************************************************************
//Clicking on the screen
document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target;

    if (!target.classList.contains("keyboard-button")) {
        return;
    };
    let key = target.textContent;

    if (key === "del") {
        key = "Backspace";
    };

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
});

//Typing on keyboard
document.addEventListener("keyup", (e) => {
    var scoreBox;
    if (selectedBox == 1) {
        scoreBox = reverseMode ? hanBox : ansBox1;
        if (reverseMode) {
            digitLimit = 1
        }
        if (autocheckMode) {
            String(answer1).length
        }
    } else {
        scoreBox = reverseMode ? fuBox : ansBox2;
        if (reverseMode) {
            digitLimit = 2
        }
        if (autocheckMode) {
            String(answer2).length
        }
    };

    let pressedKey = String(e.key);
    let k = null;
    //animate button
    switch (pressedKey){
        case "Backspace":
            k = document.getElementById('delBtn');
            break;
        case "0":
            k = document.getElementById('zeroBtn');
            break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            k = document.getElementById("btn" + pressedKey);
            break;
    };
    if (k != null){
        animateCSS(k,"pulse");
    };

    //Delete
    if (pressedKey === "Backspace") {
        deleteDigit(scoreBox);
        return;
    };

    if (pressedKey === "Enter") {
        checkGuess();
        return;
    };

    let found = pressedKey.match(/[0-9]/gi)
    if (!found || found.length > 1) {
        return;
    } else {
        if (scoreBox.textContent.length != digitLimit /*&& !settingHints*/){
            insertDigit(pressedKey,scoreBox);
        };
    };
});

//Insert digits into the guess box
function insertDigit(pressedKey,scoreBox){
    if (!(pressedKey == 0 && scoreBox.textContent.length == 0)){
        scoreBox.textContent += pressedKey;
        if (autocheckMode) {
            checkGuess();
        };
    };
    if (scoreBox.textContent.length == digitLimit){
        if (box2Enabled || reverseMode){
            selectedBox = 2;
            toggleLitScore();
        };
    };
};

//Delete digits from the guess box
function deleteDigit (scoreBox) {
    if (scoreBox.textContent.length == 0) {
        selectedBox = 1;
        toggleLitScore();
    };
    if (!autocheckMode) {
        scoreBox.textContent = scoreBox.textContent.slice(0,scoreBox.textContent.length - 1);
    }
};

//Switch boxes
ansBox1.addEventListener("click", function() {
    if (!autocheckMode && !reverseMode) {
        selectedBox = 1;
        toggleLitScore();
    };
});
ansBox2.addEventListener("click", function() {
    if (!autocheckMode && !reverseMode && box2Enabled) {
        selectedBox = 2;
        toggleLitScore();
    };
});
//Switch boxes in reverse mode
hanBox.addEventListener("click", function() {
    if (reverseMode) {
        selectedBox = 1;
        toggleLitScore();
    };
});
fuBox.addEventListener("click", function() {
    if (reverseMode) {
        selectedBox = 2;
        toggleLitScore();
    };
});

//Evaluate the guess and return correct or incorrect popup
function checkGuess() {
    var guess1;
    var guess2;
    if (!reverseMode) {
        guess1 = ansBox1.textContent;
        guess2 = ansBox2.textContent;
    } else {
        [guess1, guess2] = calcAnswer(Number(hanBox.textContent),Number(fuBox.textContent));
    };
    if (guess1 == ""){
        selectedBox = 1;
        toggleLitScore();
        return;
    } else {
        if (box2Enabled && guess2 == "" && !autocheckMode){
            selectedBox = 2;
            toggleLitScore();
            return;
        };
    };
    
    let correct = true;
    let moveOn = true;
    //autocheck mode evaluates the guesses as they are typed
    if (autocheckMode) {
        moveOn = false;
        let ans1String = String(answer1);
        let ans2String = String(answer2);
        correct = selectedBox == 1 ? scrutinizeGuess(guess1, ans1String) : scrutinizeGuess(guess2, ans2String);
        if (box2Enabled) {
            if (guess2.length == ans2String.length) {
                moveOn = true;
            }
        } else {
            if (guess1.length == ans1String.length) {
                moveOn = true;
            };
        };
    } else {
        if (guess1 != answer1) {
            correct = false;
        };
        if (box2Enabled && guess2 != answer2) {
            correct = false;
        };
    };
    if (correct) {
        if (moveOn) {
            streak += 1;
            toastr.success("Answer correct! Streak: " + streak);
            newHint();
        };
    } else {
        let ansText = document.getElementById("correctAns");
        var message;
        if (!reverseMode) {
            message = answer1;
            if (box2Enabled) {
                message += " and " + answer2;
            };
        } else {
            //TODO show overlaps
            message = han + " han and " + fu + " fu";
        };
        ansText.textContent = message;
        popup.showModal();
        streak = 0;
    };
};

//For autocheck mode, checks every digit 
function scrutinizeGuess(guess, answer) {
        for (let i = 0; i < guess.length; i++) {
            if (guess[i] != answer[i]) {
                return false;
            };
        };
        return true;
};

//Animation Code
const animateCSS = (element, animation, duration, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    if (duration == undefined){
        duration = '0.1s';
    };
    const animationName = `${prefix}${animation}`;
    const node = element
    node.style.setProperty('--animate-duration', String(duration));
    node.classList.add(`${prefix}animated`, animationName);
    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    };
    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});


//SETTINGS CODE ********************************************************************************************************

function openSettings() {
    settingsChanged = false;
    settingsDialog.showModal();
};

function closeSettings() {
    if (settingsChanged) {
        startGame();
    } else {
        settingsDialog.close();
    };
};

//Sliders Code
function controlSlider(max, minSlider, maxSlider, Label, labelList) {
    settingsChanged = true;
    const [from, to] = getParsed(minSlider, maxSlider);
    fillSlider(minSlider, maxSlider, maxSlider);
    if (max) {
        if (from <= to) {
            maxSlider.value = to;
            Label.textContent = labelList[to];
            
        } else {
            maxSlider.value = from;
            Label.textContent = labelList[from];
        };
        setToggleAccessible(maxSlider, minSlider);
    } else {
        if (from > to) {
            minSlider.value = to;
            Label.textContent = labelList[to];
        } else {
            minSlider.value = from;
            Label.textContent = labelList[from];
        };
    };
};

function setToggleAccessible(currSlider, otherSlider) {
    if (Number(currSlider.value) <= 0 || currSlider.value == otherSlider.value) {
        currSlider.style.zIndex = 2;
    } else {
        currSlider.style.zIndex = 0;
    };
};

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
};
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
};

//Dim the fu slider when minimum han is above 4
minHanSlider.oninput = () => {
    controlSlider(false, minHanSlider, maxHanSlider, minHanLabel, hanList);
    if (hanList[minHanSlider.value] > 4) {
        document.getElementById('fuRange').classList.add('dimmed');
    } else {
        if (!reverseSwitch.checked)
        document.getElementById('fuRange').classList.remove('dimmed');
    };
};
maxHanSlider.oninput = () => controlSlider(true, minHanSlider, maxHanSlider, maxHanLabel, hanList);
minFuSlider.oninput = () => controlSlider(false, minFuSlider, maxFuSlider, minFuLabel, fuList);
maxFuSlider.oninput = () => controlSlider(true, minFuSlider, maxFuSlider, maxFuLabel, fuList);

//Dim sliders and switches when reverse mode enabled
reverseSwitch.oninput = () => {
    let elements = Array.from(document.getElementsByClassName("nonrev"));
    if (reverseSwitch.checked) {
        elements.forEach(element => {
            element.classList.add('dimmed');
        });
    } else {
        elements.forEach(element => {
            element.classList.remove('dimmed');
        });
    };
};

baseSwitch.oninput = () => {
    let trips = document.getElementById('triples');
    if (baseSwitch.checked) {
        trips.classList.add('dimmed');
    } else{
        trips.classList.remove('dimmed');
    }
}

//TrueRandom cannot be enabled without Random enabled also
trueRandomSwitch.oninput = () => {
    if (trueRandomSwitch.checked) {
        randomSwitch.checked = true;
    };
};




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
dealBothSwitch.checked = true;
ronBothSwitch.checked = true;
settingsChanged = true;
fillSlider(minHanSlider, maxHanSlider, maxHanSlider);
fillSlider(minFuSlider, maxFuSlider, maxFuSlider);
console.log("Please don't judge my code. I'm a mainframe dev not a web dev lol");
startGame();
