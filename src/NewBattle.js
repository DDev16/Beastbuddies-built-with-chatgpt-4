import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PokemonBattleABI from "./abi/Newbattle.json";
import "./NewBattle.css";
import playerPokemonImg from "./monstera.png"; // Import player image
import opponentPokemonImg from "./monsterb.png"; // Import opponent image
import shieldImage from './shield.png';
import potionImage from './potion.png';
import powerUpImage from './powerUp.png';

import { useNavigate } from 'react-router-dom';

const CONTRACT_ADDRESS = "0x6e7cfe3fd749F6E1C53BC1065fc702eb6c22F600";


function NewBattle() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [attackerTokenId, setAttackerTokenId] = useState("");
  const [defenderTokenId, setDefenderTokenId] = useState("");
  const [battleId, setBattleId] = useState("");
  const [attackerId, setAttackerId] = useState('');
  const [defenderId, setDefenderId] = useState('');
  const [itemId, setItemId] = useState('');
  useEffect(() => {
    if (window.ethereum) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const signer = web3Provider.getSigner();
      setSigner(signer);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PokemonBattleABI,
        signer
      );
      setContract(contract);
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  const navigate = useNavigate();

  const ItemType = {
    None: 0,
    Shield: 1,
    Potion: 2,
    PowerUp: 3
  };
  

  const handleCreateBattle = async () => {
    try {
      const battleId = await contract.createBattle(attackerTokenId, defenderTokenId);
      alert('Battle created successfully!');
      navigate(`/battle/${battleId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create battle.');
    }
  };
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

  const handleAttack = async () => {
    try {
      await contract.attack(battleId, ItemType.None);
      alert("Attack successful!");
    } catch (err) {
      console.error(err);
      alert("Failed to attack.");
    }
  };
  

  const handleEndBattle = async () => {
    try {
      await contract.endBattle(battleId);
      alert("Battle ended successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to end battle.");
    }
  };

  const handleBuyItem = async () => {
    try {
      await contract.buyItem(itemId);
      alert("Item bought successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to buy item.");
    }
  };
  
  const handleUseItem = async () => {
    try {
      await contract.useItem(itemId);
      alert("Item used successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to use item.");
    }
  };

  const [playerHealth, setPlayerHealth] = useState(100);
 


const [opponentHealth, setOpponentHealth] = useState(100);
const [playerInventory, setPlayerInventory] = useState({ shield: 0, potion: 0, powerUp: 0 });
const [opponentInventory, setOpponentInventory] = useState({ shield: 0, potion: 0, powerUp: 0 });
const [battleLog, setBattleLog] = useState([]);

const buyItem = async (battleId, itemType) => {
if (!contract) return;


try {
  await contract.buyItem(battleId, itemType);
} catch (error) {
  console.log("Error:", error);
}
};

const updateHealth = (player, opponent) => {
setPlayerHealth(player);
setOpponentHealth(opponent);
};

const performAttack = async (battleId, itemType) => {
  if (!contract) return;

  try {
    await contract.attack(battleId, itemType);
    alert("Attack successful!");
  } catch (error) {
    console.log("Error:", error);
    alert("Failed to attack.");
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

return  (
  <div className="NewBattle">
    <div>
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
      <div className="battle-actions">
        <h2>Create Battle</h2>
        <input
          type="number"
          placeholder="Attacker Token ID"
          onChange={(e) => setAttackerTokenId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Defender Token ID"
          onChange={(e) => setDefenderTokenId(e.target.value)}
        />
        <button onClick={handleCreateBattle}>Create Battle</button>
        
        <h2>Battle Actions</h2>
        <input
          type="number"
          placeholder="Battle ID"
          onChange={(e) => setBattleId(e.target.value)}
        />
        <form>
          <label>
            Select item type:
            <select value={itemId} onChange={(e) => setItemId(e.target.value)}>
              <option value="">None</option>
              <option value="1">Shield</option>
              <option value="2">Potion</option>
              <option value="3">Power Up</option>
            </select>
          </label>
        </form>
        <button onClick={handleAttack}>Attack</button>
      </div>
      <div className="battle-actions">
      <button onClick={() => performAttack(0, ItemType.Shield)}>Use Shield</button>
<button onClick={() => performAttack(0, ItemType.Potion)}>Use Potion</button>
<button onClick={() => performAttack(0, ItemType.PowerUp)}>Use Power Up</button>

      </div>
      <div className="battle-container">
        <div className="battle-status">
          <div className="player"></div>
        </div>
        <div className="battle-controls">
          <div className="item">
            <img src={shieldImage} alt="Shield" width="100" height="100"/>
            <button onClick={() => buyItem(0, ItemType.Shield)}>Buy Shield</button>
            <p>Cost: 100 $MonsterBits</p>
          </div>
          <div className="item">
            <img src={potionImage} alt="Potion" width="150" height="150" />
            <button onClick={() => buyItem(0, ItemType.Potion)}>Buy Potion</button>
            <p>Cost: 50 $MonsterBits</p>
          </div>
          <div className="item">
            <img src={powerUpImage} alt="Power Up" width="100" height="100" />
            <button onClick={() => buyItem(0, ItemType.PowerUp)}>Buy Power Up</button>
            <p>Cost: 200 $MonsterBits</p>
          </div>
        </div>
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

export default NewBattle;