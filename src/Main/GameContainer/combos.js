class Combo {
    constructor(name = "", func, points = 0) {
        this.name = name,
            this.func = func,
            this.points = points
    }
}

/* here, the method is the following :
    - initiate new Combos objects with their own names, points, and checking functions
    - iterate over every combo from strongest to weakest ;
      if its function returns true (e.g. an array of new dices) it breaks and directly returns it,
      because we want the player to score the highest amount of points possible so it's
      pointless to check every weaker combo once a stronger one was found
    - if no comob was found, the default combo is to check the strongest dice value scored (so at least 3 with 5 dices)
*/

function checkSameValues(dices, n) {

    let nums = extractValues(dices)

    const availableValues = [...(new Set(nums))]

    if (n + availableValues.length > nums.length + 1) { //e.g. : with a wanted value of n = 5 (yam's), if there isn't only one type of value then the yam's combo is impossible
        //console.log('ruled out direct', n);
        return false
    }

    for (let j = 0; j < availableValues.length; j++) { //loop over every possible value

        const value = availableValues[j];

        let sameValues = 0 //becomes at least one

        for (let i = 0; i < nums.length; i++) {
            if (nums[i] === value) {
                sameValues++
            }
            //console.log("with a value of ", value, ", after ", 1 + i, " iteration, we counted ", sameValues, " similar values")
        }

        if (sameValues === n && typeof value !== "string") { //if we encountered n amount of time the value at availableValues[j] the combo is verified
            dices = dices.map(dice => (dice.value == value ? {...dice, comboed: true} : dice))
            return dices
        }
    }

    return false
}

function checkStraight(dices, startingValue) {

    let values = extractValues(dices)

    const availableValues = [...(new Set(values))]
    if (availableValues.length !== 5) return false

    for (let i = 0; i < availableValues.length - 1; i++) {
        if (availableValues[i] !== availableValues[i + 1] - 1) return false
    }

    return availableValues[0] === startingValue
}

function isYams(dices) {
    return checkSameValues(dices, 5)
}

function isSquare(dices) {
    return checkSameValues(dices, 4)
}

function isBigStraight(dices) {
    if(checkStraight(dices, 2)){
        return getEveryDiceComboed(dices)
    }
    else{
        return false
    }
}

function isSmallStraight(dices) {
    if(checkStraight(dices, 1)){
        return getEveryDiceComboed(dices)
    }
    else{
        return false
    }
}

function isFullHouse(dices) {

    let values = extractValues(dices)

    const availableValues = [...(new Set(values))]

    if (availableValues.length !== 2) return false

    if(checkSameValues(dices, 3) && checkSameValues(dices, 2)){
        return getEveryDiceComboed(dices)
    }
    else{
        return false
    }
}

function isThree(dices) {
    return checkSameValues(dices, 3)
}


function getEveryDiceComboed(dices){
    return dices.map(dice => ({...dice, comboed: true}))
}

function extractValues(dices) {
    let values = [...dices.map(dice => { return dice.value })]
    values.sort((a, b) => { return a - b })
    return values
}

export default function checkCombos(dices) {

    const combos = [
        new Combo("Yam's", () => isYams(dices), 50),
        new Combo("Square", () => isSquare(dices), 40),
        new Combo("Big Straight", () => isBigStraight(dices), 35),
        new Combo("Full House", () => isFullHouse(dices), 30),
        new Combo("Small Straight", () => isSmallStraight(dices), 25),
        new Combo("Three Of A Kind", () => isThree(dices), 20)
    ]

    let isAllNums = true

    for (const dice of dices) {
        if (!(typeof dice.value == "number")) {
            isAllNums = false;
            break;
        }
    }

    if (isAllNums) {
        for (const combo of combos) {
            const returnedCombo = combo.func()
            if (returnedCombo) { //when the combo.func() returns the new dice array it's evaluated as true bc it means that the combo was successfull
                return { name: combo.name, points: combo.points, newDices: returnedCombo}
            }
        }

        const values = extractValues(dices),
        highestValue = values[values.length - 1]
        
        let finalDices = dices

        for(let i = 0; i < finalDices.length; i++){
            if(finalDices[i].value === highestValue){
                finalDices[i] = {...finalDices[i], comboed: true}; //only mark the first biggest value encountered as "comboed"
                break;
            }
        }
        return { name: "One Man Army", points: highestValue, newDices: finalDices} //default combo if none was found
    }

    return null
}