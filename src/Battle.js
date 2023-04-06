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

  
  async function handleBattle() {
    // Existing handleBattle code
  }

  async function handleChallenge() {
    // Handle challenge logic
  }

  async function handleAcceptChallenge() {
    // Handle accept challenge logic
  }

   // Sample leaderboard data (replace with actual data)
   const leaderboardData = [
    { id: 1, owner: '0x1234...', score: 100 },
    { id: 2, owner: '0x5678...', score: 90 },
    { id: 4, owner: '0x9abc...', score: 80 },
    { id: 5, owner: '0x1234...', score: 100 },
    { id: 6, owner: '0x5678...', score: 90 },
    { id: 7, owner: '0x9abc...', score: 80 },
    { id: 8, owner: '0x1234...', score: 100 },
    { id: 9, owner: '0x5678...', score: 90 },  ];


  return (
    <div className="battle">
      <h2>Battle Monsters</h2>
      <div className="game-info">
        <p>
          Welcome to Battle Monsters! To participate in battles, enter your pet's ID as the
          attacker and your opponent's pet's ID as the defender. You can also challenge other
          players and accept challenges. Win battles to increase your pet's ranking on the
          leaderboard.
        </p>
      </div>
      <img className="player-image attacker" src={`https://bafybeidm7jfef6v6l7dutjat52fl3ynv6jrrovhfgfrzipvxmbdnaqsnhm.ipfs.nftstorage.link/1.png`} alt={`Player ${attackerId}`} />
<span className="vs">VS</span>
<img className="player-image defender" src={`https://bafybeidm7jfef6v6l7dutjat52fl3ynv6jrrovhfgfrzipvxmbdnaqsnhm.ipfs.nftstorage.link/4.png`} alt={`Player ${defenderId}`} />
<div></div>
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
      <div className="card">

      <button onClick={handleBattle}>Battle</button>
      <button onClick={handleChallenge}>Challenge</button>
      <button onClick={handleAcceptChallenge}>Accept Challenge</button>
      <p>{battleResult}</p>
      </div>
      <div class="leaderboard">
  <h3>Leaderboard</h3>
  <table className="leaderboard-table">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Pet ID</th>
        <th>Owner</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {leaderboardData.map((entry, index) => (
      <tr key={entry.id}>
        <td>{index + 1}</td>
        <td>{entry.id}</td>
        <td>{entry.owner}</td>
        <td>{entry.score}</td>
      </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default Battle;