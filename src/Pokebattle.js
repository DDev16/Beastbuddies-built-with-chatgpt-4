import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./PokeBattle.css";
import pokeBattleAbi from "./Pokebattle.json";
import playerPokemonImg from "./monstera.png"; // Import player image
import opponentPokemonImg from "./monsterb.png"; // Import opponent image



const PokeBattle = () => {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const contract = new ethers.Contract(
        "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
        pokeBattleAbi,
        signer
      );

      setProvider(provider);
      setContract(contract);
      setAccount(account);
    };

    if (window.ethereum) {
      init();
    } else {
      console.log("Install Metamask!");
    }
  }, []);


  
// Add health state for player and opponent
const [playerHealth, setPlayerHealth] = useState(100);
const [opponentHealth, setOpponentHealth] = useState(100);

 
  const buyItem = async (battleId, itemType) => {
    if (!contract) return;

    try {
      await contract.buyItem(battleId, itemType);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // Update the health state based on the actions or attacks
  // Dummy example, you should update these values based on the actual game logic
  const updateHealth = (player, opponent) => {
    setPlayerHealth(player);
    setOpponentHealth(opponent);
  };

  const performAttack = async (battleId, itemType) => {
    if (!contract) return;

    try {
      await contract.attack(battleId, itemType);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const attack = async (battleId) => {
    if (!contract) return;

    try {
      await contract.attack(battleId, 0); // 0 represents no item used
    } catch (error) {
      console.log("Error:", error);
    }
  };


  return (
    <div className="poke-battle">
      <h1>Monsters NFT Battle</h1>
      <div className="battle-screen">
        <div className="pokemon player-pokemon">
          <img src={playerPokemonImg} alt="Player Pokémon" />
        </div>
        <div className="pokemon opponent-pokemon">
          <img src={opponentPokemonImg} alt="Opponent Pokémon" />
        </div>
        <div className="vs-text">VS</div>
      </div>
      <div className="battle-container">
        {/* Add health bars */}
        <div className="battle-status">
          <div className="player">
            <img src={playerPokemonImg} alt="Player Pokémon" />
            <div className="health-bar">
              <div
                className="health-bar-inner"
                style={{ width: `${playerHealth}%` }}
              ></div>
              <div className="health-bar-text">{playerHealth}%</div>
            </div>
          </div>
          <div className="opponent">
            <img src={opponentPokemonImg} alt="Opponent Pokémon" />
            <div className="health-bar">
              <div
                className="health-bar-inner"
                style={{ width: `${opponentHealth}%` }}
              ></div>
              <div className="health-bar-text">{opponentHealth}%</div>
            </div>
          </div>
        </div>
        {/* End health bars */}
        <div className="battle-controls">
          <button onClick={() => buyItem(0, 1)}>Buy Shield</button>
          <button onClick={() => buyItem(0, 2)}>Buy Potion</button>
          <button onClick={() => buyItem(0, 3)}>Buy Power Up</button>
        </div>
        <div className="battle-actions">
          <button onClick={() => performAttack(0, 1)}>Use Shield</button>
          <button onClick={() => performAttack(0, 2)}>Use Potion</button>
          <button onClick={() => performAttack(0, 3)}>Use Power Up</button>
    <div className="battle-log">
      <p>Log:</p>
      <p>Player bought Shield</p>
      <p>Player used Shield</p>
      <p>Opponent attacked Player</p>
    </div>
  </div>
</div>


</div>
);
};

export default PokeBattle;