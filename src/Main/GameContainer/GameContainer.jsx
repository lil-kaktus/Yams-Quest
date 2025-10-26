import { useState, useEffect } from 'react'

import Dice from './Dice/Dice';

import checkCombos from './combos';

const MIN_DICE = 1;
const MAX_DICE = 6;
const DICE_NUMBER = 5; //!\\ do not change or consequences.
const ROLLS = 3

export default function GameContainer() {

    const [dices, setDices] = useState([])
    const [turns, setTurns] = useState(ROLLS)
    const [combo, setCombo] = useState()

    function setDefaultDices() {
        setDices([])
        for (let i = 0; i < DICE_NUMBER; i++) {
            setDices((prevDices) => (
                [...prevDices, {
                    id: i,
                    value: "?",
                    saved: false,
                    comboed: false
                }]
            ))
        }
    }

    useEffect(() => {
        setDefaultDices()
    }, [])

    useEffect(() => {
        if (turns == 0) {
            playHand()
        }
    }, [turns])

    function isEveryDiceLocked() {
        for (const dice of dices) {
            if (!dice.saved) {
                return false
            }
        }
        return true
    }

    function lockEveryDice(locked = true) {
        setDices(prevDices =>
            (prevDices.map(dice => ({ ...dice, saved: locked })))
        )
    }

    function rerollDices() {
        if (turns > 0 && !isEveryDiceLocked()) {

            setDices(prevDices => {
                return prevDices.map((dice, index) => (
                    dice.saved ? dice : { ...dice, value: Math.floor(Math.random() * MAX_DICE) + MIN_DICE }
                ))
            })

            setTurns(prevTurns => prevTurns - 1)
        }
    }

    function toggleSavedDice(diceId) {
        setDices(prevDices => {
            return prevDices.map(dice => (
                dice.id === diceId ? { ...dice, saved: !dice.saved } : dice
            ))
        })
    }

    function playHand() {

        const {name, points, newDices} = checkCombos(dices)

        setTurns(0)
        setCombo({name, points})
        setDices(newDices)
        lockEveryDice(false)
    }

    function restartGame(){
        setDefaultDices()
        setTurns(ROLLS)
        setCombo()
    }

    return (<div className="game-container">
        <div className="game-table">
            <div className='dices-container'>
                {dices.map(dice => <Dice key={dice.id} dice={dice} toggleSavedDice={toggleSavedDice} />)}
            </div>
            <div className="turns-container">
                <span className="turns-text">Remaining rolls : </span>
                <span className="turns-number">{turns}</span>
            </div>
        </div>
        <div className='game-interface'>
            {turns != 0 ? <>
                <button className="reroll-button"
                    onClick={() => rerollDices()}
                >{turns === ROLLS ? "Roll" : "Reroll"}
                </button>
                {turns < ROLLS && <button className="play-hand-button"
                    onClick={() => playHand()}>
                    Play hand
                </button>}</>
                :
                <button
                    onClick={() => restartGame()}>
                    Play again
                </button>}
        </div>
        {combo && <div className="combo-container">
            <span className="combo-text">{combo.name} ({combo.points}pts)</span>
        </div>}
    </div>)
}