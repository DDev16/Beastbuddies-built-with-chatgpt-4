import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PokemonBattleABI from "./abi/Newbattle.json";
import "./NewBattle.css";
import playerPokemonImg from "./monstera.png"; // Import player image
import opponentPokemonImg from "./monsterb.png"; // Import opponent image
import shieldImage from './shield.png';
import potionImage from './potion.png';
import powerUpImage from './powerUp.png';
import "./BattleLog.css";
import Leaderboard from './components/Leaderboard.js';



import { useNavigate } from 'react-router-dom';

const CONTRACT_ADDRESS = "0x4593ed9CbE6003e687e5e77368534bb04b162503";


function NewBattle() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [attackerTokenId, setAttackerTokenId] = useState("");
  const [defenderTokenId, setDefenderTokenId] = useState("");
  const [battleId, setBattleId] = useState(null);
  
  
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

  
  

  const handleCreateBattle = async () => {
    try {
      const tx = await contract.createBattle(attackerTokenId, defenderTokenId);
      const receipt = await tx.wait();
      const battleId = receipt.events[0].args.battleId.toString();
            alert('Battle created successfully!');
      navigate(`/battle/${battleId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create battle.');
    }
  };
  // Add these new state variables
const [battleInfo, setBattleInfo] = useState(null);
const [attackerElement, setAttackerElement] = useState("");
const [defenderElement, setDefenderElement] = useState("");
const [attackerPower, setAttackerPower] = useState(0);
const [defenderPower, setDefenderPower] = useState(0);
const [battleEvents, setBattleEvents] = useState([]);
const [playerHealth, setPlayerHealth] = useState(100);
const [opponentHealth, setOpponentHealth] = useState(100);
// Add this new function inside the NewBattle component
const fetchBattleInfo = async () => {
  if (contract && battleId) {
    try {
      const battle = await contract.getBattle(battleId);
      setBattleInfo(battle);
      setAttackerElement(battle.attackerElement.toString());
      setDefenderElement(battle.defenderElement.toString());
      setAttackerPower(battle.attackerPower.toString()); // Convert to string
      setDefenderPower(battle.defenderPower.toString()); // Convert to string
      setPlayerHealth(battle.attackerHp.toString());
      setOpponentHealth(battle.defenderHp.toString());
    } catch (err) {
      console.error(err);
      alert("Failed to fetch battle info.");
    }
  }
};


// Call fetchBattleInfo function whenever battleId changes
useEffect(() => {
  fetchBattleInfo();
}, [battleId]);

// Update Player component to display the element and power
function Player({ tokenId, health, element, power, isAttacker }) {
  const [imageSrc, setImageSrc] = useState("");

  
  useEffect(() => {
    function fetchImage() {
      // Fetch the image URL based on the token ID
      const imageUrl = `https://bafybeih6ocvp4vmuibfe2xvuvjjujdi5fi7bb4aylvvakrvejztmuwx7ee.ipfs.nftstorage.link/${tokenId}.png`;
      setImageSrc(imageUrl);
    }

    if (tokenId) {
      fetchImage();
    }
  }, [tokenId]);
  return (
    <div className={`player-container ${isAttacker ? "attacker" : "defender"}`}>
      <img className="player-image" src={imageSrc} alt="Player" />
      <div className="health-bar">
        <div
          className="health-bar-inner player-health"
          style={{ width: `${health}%` }}
        ></div>
        <div className="health-bar-text">{health}%</div>
      </div>
      <div className="player-stats">
        <p>Element: {element}</p>
        <p>Power: {power}</p>
      </div>
    </div>
  );
}
  
const subscribeToEvents = () => {
  contract.on("NewBattle", (battleId, attackerTokenId, defenderTokenId) => {
    setBattleEvents((prevEvents) => [
      ...prevEvents,
      `New battle: ${battleId}, Attacker: ${attackerTokenId}, Defender: ${defenderTokenId}`,
    ]);
  });

  contract.on("BattleUpdate", (battleId, attackerHp, defenderHp) => {
    setPlayerHealth(attackerHp.toString());
    setOpponentHealth(defenderHp.toString());
    setBattleEvents((prevEvents) => [
      ...prevEvents,
      `Battle ${battleId}: Attacker HP: ${attackerHp}, Defender HP: ${defenderHp}`,
    ]);
  });

  contract.on("ItemUsed", (battleId, itemType, user) => {
    setBattleEvents((prevEvents) => [
      ...prevEvents,
      `Item used in Battle ${battleId}: Item Type: ${itemType}, User: ${user}`,
    ]);
  });

  contract.on("BattleEnded", (battleId, winnerTokenId) => {
    setBattleEvents((prevEvents) => [
      ...prevEvents,
      `Battle ${battleId} ended. Winner Token ID: ${winnerTokenId}`,
    ]);
  });

  contract.on("CriticalHit", (battleId, attackerTokenId) => {
    setBattleEvents((prevEvents) => [
      ...prevEvents,
      `Battle ${battleId}: Critical Hit by Attacker Token ID: ${attackerTokenId}`,
    ]);
  });

  contract.on("CriticalMiss", (battleId, attackerTokenId) => {
    setBattleEvents((prevEvents) => [
      ...prevEvents,
      `Battle ${battleId}: Critical Miss by Attacker Token ID: ${attackerTokenId}`,
    ]);
  });

  return () => {
    contract.removeAllListeners("NewBattle");
    contract.removeAllListeners("BattleUpdate");
    contract.removeAllListeners("ItemUsed");
    contract.removeAllListeners("BattleEnded");
    contract.removeAllListeners("CriticalHit");
    contract.removeAllListeners("CriticalMiss");

  };
};

useEffect(() => {
  if (contract) {
    const unsubscribe = subscribeToEvents();
    return unsubscribe;
  }
}, [contract]);



const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));



const handleAttack = async () => {
  try {
    web3.eth.defaultGas = 15000000;
    await contract.attack(battleId);
    console.log("Attack successful!");
  } catch (err) {
    console.error(err);
    alert("Failed to attack.");
  }
};


const buyShield = async () => {
  
  try {
    await contract.buyShield();
    console.log("Protection at its Finest!");

  } catch (error) {
    console.log("Error:", error);
  }
};

const buyPotion = async () => {
  try {
    await contract.buyPotion();
    console.log("Potion Succesfully bought!");
  } catch (error) {
    console.log("Error:", error);
  }
};


const buyPowerUp = async () => {
  
  try {
    await contract.buyPowerUp();
    console.log("Stronger than before!");
  } catch (error) {
    console.log("Error:", error);
  }
};

const handleBuyItem = async (itemType) => {
  switch (itemType) {
    case "Shield":
      await buyShield();
      break;
    case "Potion":
      await buyPotion();
      break;
    case "PowerUp":
      await buyPowerUp();
      break;
    default:
      break;
  }
};




return  (
  <><div><Leaderboard /> </div><div className="NewBattle">
    <div>
      <Player
        tokenId={attackerTokenId}
        health={playerHealth}
        element={attackerElement}
        power={attackerPower}
        isAttacker={true} />
      <span className="vs">VS</span>
      <Player
        tokenId={defenderTokenId}
        health={opponentHealth}
        element={defenderElement}
        power={defenderPower}
        isAttacker={false} />




      <div className="battle-log-container">
        <h2>Battle Log</h2>
        <div className="battle-log-list">
          {battleEvents.map((event, index) => (
            <div key={index} className="battle-log-item">
              {event}
            </div>
          ))}
        </div>
      </div>
      <div className="battle-actions">
        <h2>Create Battle</h2>
        <input
          type="number"
          placeholder="Attacker Token ID"
          onChange={(e) => setAttackerTokenId(e.target.value)} />
        <input
          type="number"
          placeholder="Defender Token ID"
          onChange={(e) => setDefenderTokenId(e.target.value)} />
        <button onClick={handleCreateBattle}>Create Battle</button>

        <h2>Battle Actions</h2>
        <input
          type="number"
          placeholder="Battle ID"
          onChange={(e) => setBattleId(e.target.value.toString())} />


        <button onClick={handleAttack}>Attack</button>
      </div>
      <div className="battle-actions">
        <button onClick={() => contract.useShield(battleId)}>Use Shield</button>
        <button onClick={() => contract.usePotion(battleId)}>Use Potion</button>
        <button onClick={() => contract.usePowerUp(battleId)}>Use Power Up</button>
      </div>
      <div className="battle-container">
        <div className="battle-status">
          <div className="player"></div>
        </div>
        <div className="battle-controls">
          <div className="item">
            <img src={shieldImage} alt="Shield" width="100" height="100" />
            <button onClick={() => handleBuyItem("Shield")}>Buy Shield</button>
            <p>Cost: 100 $MonsterBits</p>
          </div>

          <div className="item">
            <img src={potionImage} alt="Potion" width="150" height="150" />
            <button onClick={() => handleBuyItem("Potion")}>Buy Potion</button>
            <p>Cost: 50 $MonsterBits</p>
          </div>
          <div className="item">
            <img src={powerUpImage} alt="Power Up" width="100" height="100" />
            <button onClick={() => handleBuyItem("PowerUp")}>Buy Power Up</button>
            <p>Cost: 200 $MonsterBits</p>
          </div>
        </div>

      </div>
    </div>
  </div></>
);
};

export default NewBattle;