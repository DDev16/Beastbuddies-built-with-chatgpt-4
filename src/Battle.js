import { useEffect, useState } from 'react';
import './Battle.css';
import Web3 from 'web3';
import PokemonBattleABI from "./abi/Newbattle.json";

// Add the contract address here
const CONTRACT_ADDRESS = '0x5133BBdfCCa3Eb4F739D599ee4eC45cBCD0E16c5';



const Battle = ({ pets }) => {
  const [battleResult, setBattleResult] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    }

    async function loadBlockchainData() {
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setWeb3(web3);
      setAccount(accounts[0]);

      const contractInstance = new web3.eth.Contract(PokemonBattleABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
    }

    loadWeb3();
    loadBlockchainData();
  }, []);

  useEffect(() => {
    if (contract) {
      updateLeaderboardData();
    }
  }, [contract]);

  async function updateLeaderboardData() {
    const leaderboard = [];
    for (const pet of pets) {
      const petOwner = await contract.methods.ownerOf(pet.id).call();
      const petWins = await contract.methods.playerWins(petOwner).call();
      const petLosses = await contract.methods.playerLosses(petOwner).call();
      const petScore = await contract.methods.calculateScore(petWins, petLosses).call();

      leaderboard.push({
        id: pet.id,
        owner: petOwner,
        score: parseInt(petScore),
      });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    setLeaderboardData(leaderboard);
  }



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

      <p>{battleResult}</p>

      <div className="leaderboard">
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
