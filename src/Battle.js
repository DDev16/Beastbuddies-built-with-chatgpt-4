import { useEffect, useState } from 'react';
import './Battle.css';
import Web3 from 'web3';
import PokemonBattleABI from "./abi/Newbattle.json";

// Add the contract address here
const CONTRACT_ADDRESS = '0x3c48f4B70034f06A04dC3c1F5E6694A3eFbbcD11';



const Battle = ({ pets }) => {
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

     

       
      </div>
    
  );
};

export default Battle;
