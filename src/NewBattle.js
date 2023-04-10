import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PokemonBattleABI from "./abi/Newbattle.json";
// Add this import at the beginning of NewBattle.js
import "./NewBattle.css";

const CONTRACT_ADDRESS = "0xD95e99f45E826B99a192d1D0e9cbCB04174eD170";


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

  const handleCreateBattle = async () => {
    try {
      await contract.createBattle(attackerTokenId, defenderTokenId);
      alert("Battle created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create battle.");
    }
  };

  const handleAttack = async () => {
    try {
      await contract.attack(battleId);
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

  return (
    <div className="NewBattle">


    <div>
    <img className="player-image attacker" src={`monsterb.png`} alt={`Player ${attackerId}`} />
<span className="vs">VS</span>
<img className="player-image defender" src={`monstera.png`} alt={`Player ${defenderId}`} />
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
      <button onClick={handleAttack}>Attack</button>
    </div>
    <h2>Buy Item</h2>
<input
  type="number"
  placeholder="Item ID"
  onChange={(e) => setItemId(e.target.value)}
/>
<button onClick={handleBuyItem}>Buy Item</button>

<h2>Use Item</h2>
<input
  type="number"
  placeholder="Item ID"
  onChange={(e) => setItemId(e.target.value)}
/>
<button onClick={handleUseItem}>Use Item</button>
    </div>
  );
}

export default NewBattle;
