import { useState } from 'react';
import './Battle.css';

const Battle = ({ contract, pets }) => {
  const [attackerId, setAttackerId] = useState('');
  const [defenderId, setDefenderId] = useState('');
  const [battleResult, setBattleResult] = useState('');

  async function handleBattle() {
    try {
      const result = await contract.battle(attackerId, defenderId);
      setBattleResult(`Pet ${attackerId} ${result ? 'won' : 'lost'} against Pet ${defenderId}`);
    } catch (error) {
      console.error("Failed to perform battle", error);
      setBattleResult("Error performing battle. Please try again.");
    }
  }

  return (
    <div className="battle">
      <h2>Battle Monsters</h2>
      <div className="form-group">
        <label htmlFor="attackerId">Attacker Pet ID:</label>
        <input
          type="number"
          id="attackerId"
          value={attackerId}
          onChange={(e) => setAttackerId(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="defenderId">Defender Pet ID:</label>
        <input
          type="number"
          id="defenderId"
          value={defenderId}
          onChange={(e) => setDefenderId(e.target.value)}
        />
      </div>
      <button onClick={handleBattle}>Battle</button>
      <p>{battleResult}</p>
    </div>
  );
};

export default Battle;
