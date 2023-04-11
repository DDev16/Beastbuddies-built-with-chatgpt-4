import React, { useState, useEffect } from "react";
import "./BattleArena.css";
import playerPokemonImg from "./monstera.png"; // Import player image
import opponentPokemonImg from "./monsterb.png"; // Import opponent image

function BattleArena({ match }) {
  const battleId = match.params.battleId;
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);

  // Fetch battle information and update state here using battleId

  function Player({ imageSrc, health, isAttacker }) {
    return (
      <div className={`player-container ${isAttacker ? 'attacker' : 'defender'}`}>
        <img className="player-image" src={imageSrc} alt="Player" />
        <div className="health-bar">
          <div
            className="health-bar-inner player-health"
            style={{ width: `${health}%` }}
          ></div>
          <div className="health-bar-text">{health}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="BattleArena">
      <h1>Battle #{battleId}</h1>
      <div className="players">
        <Player
          imageSrc={playerPokemonImg}
          health={playerHealth}
          isAttacker={true}
        />
        <span className="vs">VS</span>
        <Player
          imageSrc={opponentPokemonImg}
          health={opponentHealth}
          isAttacker={false}
        />
      </div>
    </div>
  );
}

export default BattleArena;
