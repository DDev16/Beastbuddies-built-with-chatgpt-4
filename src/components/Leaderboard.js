import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PokemonBattleABI from './Newbattle.json';
import './Leaderboard.css';

const CONTRACT_ADDRESS = '0x3c48f4B70034f06A04dC3c1F5E6694A3eFbbcD11';

function Leaderboard() {
    const [provider, setProvider] = useState();
    const [signer, setSigner] = useState();
    const [contract, setContract] = useState();
    const [topPlayers, setTopPlayers] = useState([]);
    const [topN, setTopN] = useState(5); // Default value for displaying top 5 players
  
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
      const fetchTopPlayers = async () => {
        if (contract) {
          try {
            const [playerAddresses, playerScores, playerTokenIds] = await contract.getTopPlayers(topN);
            const players = playerAddresses.map((address, index) => ({
              address,
              score: playerScores[index].toString(),
              tokenId: playerTokenIds[index].toString(),
            }));
            setTopPlayers(players);
          } catch (err) {
            console.error(err);
            alert("Failed to fetch top players.");
          }
        }
      };
  
      fetchTopPlayers();
    }, [contract, topN]);
  
    return (
      <div className="Leaderboard">
        <h2>Leaderboard</h2>
        <label htmlFor="topN">Top Players: </label>
        <input
          type="number"
          id="topN"
          min="1"
          value={topN}
          onChange={(e) => setTopN(parseInt(e.target.value, 10))}
        />
         <div class="Leaderboard-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Score</th>
              <th>Token ID</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player.address}</td>
                <td>{player.score}</td>
                <td>{player.tokenId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      
    );
  }
  

  export default Leaderboard;
