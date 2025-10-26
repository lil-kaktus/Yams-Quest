class Combo {
    constructor(name = "", func, points = 0) {
        this.name = name,
            this.func = func,
            this.points = points
    }
}

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
        console.log("full house evaluated to true")
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
            if (returnedCombo) {
                return { name: combo.name, points: combo.points, newDices: returnedCombo}
            }
        }

        let values = extractValues(dices)
        const highestValue = values[values.length - 1]
        return { name: "One Man Army", points: highestValue, newDices: dices.map(dice => (dice.value == highestValue ? {...dice, comboed: true} : dice))}
    }

    return null
}