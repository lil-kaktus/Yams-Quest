export default function Dice({ dice, toggleSavedDice }) {
    return (<>
        <button className={`dice${dice.saved || !(typeof dice.value == "number") ? " dice-saved" : ""}${dice.comboed ? " dice-comboed" : ""}`}
            onClick={() => toggleSavedDice(dice.id)}
            disabled={!(typeof dice.value == "number")}>
            <span>{dice.value}</span>
            {dice.saved && <div className="dice-issaved-icon">🔒</div>}
        </button>
    </>
    )
}