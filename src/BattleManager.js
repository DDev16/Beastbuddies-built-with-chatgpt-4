import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import PokemonBattleABI from './Newbattle.json';
import NewBattle from './NewBattle';
import { Route, Routes, useNavigate } from "react-router-dom";

const CONTRACT_ADDRESS = '0x4593ed9CbE6003e687e5e77368534bb04b162503';

function BattleManager() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const navigate = useNavigate();
  const [battles, setBattles] = useState(() => {
    const localBattles = window.localStorage.getItem('battles');
    return localBattles ? JSON.parse(localBattles) : [];
  });

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

  useEffect(() => {
    if (battles.length > 0) {
      navigate(`/battle/${battles.length}`);
    }
  }, [battles, navigate]);

  const handleAddBattle = async () => {
    const attackerTokenId = prompt('Enter attacker token ID:');
    const defenderTokenId = prompt('Enter defender token ID:');

    try {
      const accounts = await provider.listAccounts();
      const sender = accounts[0];

      const result = await contract.createBattle(attackerTokenId, defenderTokenId, {
        from: sender,
        gasLimit: ethers.utils.hexlify(700000),
      });

      const receipt = await provider.getTransactionReceipt(result.hash);
      const event = contract.interface.parseLog(receipt.logs[0]);
      const battleId = event.args.battleId;

      // Update the battles state and store it in local storage
      const newBattle = { id: battleId, attackerTokenId, defenderTokenId };
      const newBattlesList = [...battles, newBattle];
      setBattles(newBattlesList);
      window.localStorage.setItem('battles', JSON.stringify(newBattlesList));

    } catch (error) {
      console.error('Error creating battle:', error);
    }
  };

  return (
  <div>
    <Routes>
      <Route path="/" element={<button onClick={handleAddBattle}>Add Battle</button>} />
      {battles.map((battle) => (
        <Route
          key={battle.id}
          path={`/battle/${battle.id}`}
          element={
            <NewBattle
              battleId={battle.id}
              attackerTokenId={battle.attackerTokenId}
              defenderTokenId={battle.defenderTokenId}
            />
          }
        />
      ))}
    </Routes>
  </div>
);
        }

export default BattleManager;
