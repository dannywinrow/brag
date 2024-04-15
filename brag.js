const ranks = "23456789TJQKA";
const suits = "cdhs";
const anteBonusD = {
    'prial': 5,
    'straightflush': 4,
    'straight': 1
}
var deck = [];
for (let r = 0; r < ranks.length; r++) {
    for (let s = 0; s < suits.length; s++) {
        deck.push(ranks[r].concat(suits[s]))
    }
};

const FLUSH_HAND_COMBOS = 4;
const FLUSH_COMBOS = FLUSH_HAND_COMBOS * 13 * 12 * 11 / 3 / 2
const STRAIGHT_FLUSH_HAND_COMBOS = 4;
const STRAIGHT_FLUSH_COMBOS = STRAIGHT_FLUSH_HAND_COMBOS * 12;
const HIGH_CARD_HAND_COMBOS = 4 * 4 * 4 - FLUSH_HAND_COMBOS;
const HIGH_CARD_COMBOS = HIGH_CARD_HAND_COMBOS * 13 * 12 * 11 / 3 / 2
const STRAIGHT_HAND_COMBOS = 4 * 4 * 4 - STRAIGHT_FLUSH_HAND_COMBOS;
const STRAIGHT_COMBOS = STRAIGHT_HAND_COMBOS * 12
const PAIR_HAND_COMBOS = 4 * 4 * 3 / 2;
const PAIR_COMBOS = PAIR_HAND_COMBOS * 13 * 12
const PRIAL_HAND_COMBOS = 4 * 3 * 2 / 3 / 2;
const PRIAL_COMBOS = PRIAL_HAND_COMBOS * 13
const TOTAL_COMBOS = 52 * 51 * 50 / 3 / 2

// Hand is in form AcKhJd
function sortedRanks(hand) {
    var rankarr = []
    for (let i = 0; i < hand.length/2; i++) {
        rankarr.push(ranks.indexOf(hand[i*2])) 
    }
    return rankarr.sort(function(a, b) {
        return b - a;
      });
}

// Hand is in form AcKhJd
function sortedSuits(hand) {
  var suitarr = []
  for (let i = 0; i < hand.length/2; i++) {
      suitarr.push(suits.indexOf(hand[i*2+1])) 
  }
  return suitarr.sort(function(a, b) {
      return b - a;
    });
}


// Hand is in form AcKhJd
function isFlush(hand) {
    var is = true;
    for (let i = 1; i < hand.length/2; i++) {
        if (hand[i*2+1] != hand[i*2-1]) {
            is = false;
            break;
        }
    }
    return is;
}

function isStraight(hand) {
    return isStraight_arr(sortedRanks(hand))
}

function isStraight_arr(rankarr) {
    return rankarr[0] == 12 && rankarr[1] == 1 && rankarr[2] == 0 || rankarr[0] - rankarr[2] == 2;
}

function isPrial(hand) {
    var r = sortedRanks(hand);
    return r[1] == r[2] && r[2] == r[3];
}

function isStraightFlush(hand) {
    return isStraight(hand) && isFlush(hand);
}

function isBetter(hand1,hand2){
    return getStrength(hand1) > getStrength(hand2)
}

function isEqual(hand1,hand2){
    return getStrength(hand1) == getStrength(hand2)
}

function getStrength(hand) {
    return strength[handKey(hand)];
}

function handQualifies(hand) {
    return getStrength(hand) >= getStrength("Qh3s2h");
}

function comboTypes(hand) {
    var notqual = 0;
    var lose = 0;
    var draw = 0;
    var win = 0;
    var currdeck = [...deck];
    var c1, c2, c3;
    var comphand;

    for (let i = 0; i < hand.length / 2; i++) {
        currdeck.splice(currdeck.indexOf(hand.slice(i*2,i*2+2)),1);
    }
    for (let i1 = 0; i1 < currdeck.length - 2; i1++) {
        c1 = currdeck[i1];
        for (let i2 = i1+1; i2 < currdeck.length - 1; i2++) {
            c2 = currdeck[i2];
            for (let i3 = i2+1; i3 < currdeck.length; i3++) {
                c3 = currdeck[i3];
                comphand = c1.concat(c2,c3);
                if (handQualifies(comphand)) {
                    if (isBetter(hand,comphand)) {
                        win++
                    }
                    else if (isEqual(hand,comphand)) {
                        draw++
                    }
                    else {
                        lose++
                    }
                }
                else {
                    notqual++
                }
            }
        }
    }
    return [notqual,lose,draw,win];
}

function handKey(hand) {
    var arr = sortedRanks(hand);
    arr.push(isFlush(hand));
    return arr;
}

function toPercentile(hand) {
    return perc[handKey(hand)]
}

var i = 1
var combosum = 0
var strength = {}
var perc = {}

function toLog(key,combos){
    strength[key] = i;
    perc[key] = combosum / TOTAL_COMBOS;
    combosum += combos;
    i++;
}

function createLookup() {
  var key
  var combos
  var lc
    // High cards
    for (let r1 = 2; r1 < 13; r1++) {
        for (let r2 = 1; r2 < r1; r2++) {
            for (let r3 = 0; r3 < r2; r3++) {
                if (!isStraight_arr([r1,r2,r3])) {
                    key = [r1,r2,r3,false];
                    combos = HIGH_CARD_HAND_COMBOS;
                    toLog(key,combos);
                }
            }
        }
    }
    console.log("High cards:",combosum)
    lc = combosum
    // Pairs
    for (let r1 = 0; r1 < 13; r1++) {
        for (let r2 = 0; r2 < 13; r2++) {
            if (r1 != r2) {
                if (r1 > r2) {
                    key = [r1,r1,r2,false];
                }
                else {
                    key = [r2,r1,r1,false];
                }
                combos = PAIR_HAND_COMBOS;
                toLog(key,combos);   
            }
        }
    }
    console.log("Pairs:",combosum-lc)
    lc = combosum
    // Flushes
    for (let r1 = 3; r1 < 13; r1++) {
        for (let r2 = 1; r2 < r1; r2++) {
            for (let r3 = 0; r3 < r2; r3++) {
                if (!isStraight_arr([r1,r2,r3])) {
                    key = [r1,r2,r3,true]
                    combos = FLUSH_HAND_COMBOS;
                    toLog(key,combos);              
                }
            }
        }
    }
    console.log("Flushes:",combosum-lc)
    lc = combosum
    // Straights
    for (let r1 = 1; r1 < 13; r1++) {
        if (r1 == 1) {
            key = [12,1,0,false];
        }
        else {
            key = [r1,r1-1,r1-2,false];
        }
        combos = STRAIGHT_HAND_COMBOS;
        toLog(key,combos);
    }
    console.log("Straights:",combosum-lc)
    lc = combosum
    // Straight Flushes
    for (let r1 = 1; r1 < 13; r1++) {
        if (r1 == 1) {
            key = [12,1,0,true];
        }
        else {
            key = [r1,r1-1,r1-2,true];
        }
        combos = STRAIGHT_FLUSH_HAND_COMBOS;
        toLog(key,combos);
    }
    console.log("Straight Flushes:",combosum-lc)
    lc = combosum
    // Prials (non 3)
    for (let r1 = 0; r1 < 13; r1++) {
        if (r1 != 3) {
            key = [r1,r1,r1,false];
            combos = PRIAL_HAND_COMBOS;
            toLog(key,combos);
        }
    }
    // PRIAL of Threes
    key = [3,3,3,false];
    combos = PRIAL_HAND_COMBOS;
    toLog(key,combos);
    console.log("Prials:",combosum-lc)
}

function expectedValuePlay(hand,drawwins=false) {
    var cs = comboTypes(hand);
    var win = 0;
    var totalcombos = 0;
    for (let c in cs) {
        totalcombos += cs[c];
    }
    win += cs[0];
    win -= cs[1] * 2;
    win += drawwins * cs[2] * 2;
    win += cs[3] * 2;
    return (win / totalcombos) + anteBonus(hand);
}

function anteBonus(hand) {
    if (isPrial(hand)) return anteBonusD['prial'];
    if (isStraight(hand)) {
        if (isFlush(hand)) {
            return anteBonusD['straightflush'];
        } else {
            return anteBonusD['straight'];
        }
    }
    return 0;
}


function gameValue() {
    var ev = 0;
    var cnt = 0;
    for (let i1 = 0; i1 < deck.length - 2; i1++) {
        var c1 = deck[i1];
        for (let i2 = i1+1; i2 < deck.length - 1; i2++) {
            var c2 = deck[i2];
            for (let i3 = i2+1; i3 < deck.length; i3++) {
                var c3 = deck[i3];
                var hand = c1.concat(c2,c3);
                ev += Math.max(expectedValuePlay(hand),-1);
                cnt++;
                if (cnt % 1000 == 0) {
                    console.log("Evaluated",cnt,"hands.")
                }
            }
        }
    }
    return ev/cnt;
}

function consoleoutput(hand){
    console.log("Hand:",hand,"key:",handKey(hand),"EV:",expectedValuePlay(hand),"OppCombos:",comboTypes(hand),"%tile:",toPercentile(hand));
}

function validHand(hand) {
  if (hand.length != 6) return false
  if (sortedRanks(hand)[2] == -1) return false
  if (sortedSuits(hand)[2] == -1) return false
  return true
}

createLookup();

export {validHand, expectedValuePlay, toPercentile, comboTypes};