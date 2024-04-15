import {validHand, expectedValuePlay, toPercentile, comboTypes} from "./brag.js";

const bragHandInput = document.querySelector("#bragHandInput")
const drawWins = document.querySelector("#drawWinsCheckbox")
const results = document.querySelector(".results")

function onInput(e) {
  outputHTML();
}
function onInputDraw(e) {
  console.log("drawevent")
  outputHTML();
}
function outputHTML() {
  var hand = bragHandInput.value
  if (validHand(hand)) {
    results.innerHTML = `<br>Expected value of playing = ${expectedValuePlay(hand,drawWins.checked)+1}`;
    results.innerHTML += `<br><br>Hand percentile = ${toPercentile(hand)}`;
    const ct = comboTypes(hand);
    results.innerHTML += `<br><br>Dealer doesn't qualify = ${ct[0]}`;
    results.innerHTML += `<br>Dealer wins = ${ct[1]}`;
    results.innerHTML += `<br>Draw = ${ct[2]}`;
    results.innerHTML += `<br>Player wins = ${ct[3]}`;
  }
}
bragHandInput.addEventListener('input', onInput)
drawWins.addEventListener('input', onInputDraw)


