import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import './App.css';
import { FaConnectdevelop, FaPaw, FaCookieBite, FaFutbol, FaArrowUp } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import logo from './192.png';
import contractABI from './erc20.abi.json';
import Web3 from 'web3';





const injectedConnector = new InjectedConnector();

const CONTRACT_ADDRESS = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";
const RPC_URL = "http://127.0.0.1:8545/";
const CHAIN_ID = 31337;
const MAX_SUPPLY = 500; // Add the max supply constant
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const TamagotchiNFT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_rewardsToken",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "interactionCooldown",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lastInteraction",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "blockTimestamp",
        "type": "uint256"
      }
    ],
    "name": "DebugCooldown",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalCost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "msgValue",
        "type": "uint256"
      }
    ],
    "name": "DebugMint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newLevel",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Evolution",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "Interaction",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "birthTime",
        "type": "uint256"
      }
    ],
    "name": "NewPet",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAX_SUPPLY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "REWARD_AMOUNT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "cost",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "evolve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "evolveHappinessThreshold",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "evolveHungerThreshold",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "feed",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getImageCID",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "interact",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "interactionCooldown",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mintPets",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "birthTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastInteraction",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastInteractionReset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "level",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "happiness",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "hunger",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "play",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardsToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newAdultBaseURIs",
        "type": "string"
      }
    ],
    "name": "setAdultBaseURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "newBabyBaseURIs",
        "type": "string"
      }
    ],
    "name": "setBabyBaseURI",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_newCost",
        "type": "uint256"
      }
    ],
    "name": "setCost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_threshold",
        "type": "uint256"
      }
    ],
    "name": "setEvolveHappinessThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_threshold",
        "type": "uint256"
      }
    ],
    "name": "setEvolveHungerThreshold",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_cooldown",
        "type": "uint256"
      }
    ],
    "name": "setInteractionCooldown",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "newName",
        "type": "string"
      }
    ],
    "name": "setName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_rewardAmount",
        "type": "uint256"
      }
    ],
    "name": "setRewardAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      }
    ],
    "name": "transferPet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const Pet = ({ id, name, level, happiness, hunger, imageCID }) => {
  let imageUrl;
  if (level >= 2) {
    imageUrl = `https://bafybeidm7jfef6v6l7dutjat52fl3ynv6jrrovhfgfrzipvxmbdnaqsnhm.ipfs.nftstorage.link/${id}.png`;
  } else {
    imageUrl = `https://bafybeih6ocvp4vmuibfe2xvuvjjujdi5fi7bb4aylvvakrvejztmuwx7ee.ipfs.nftstorage.link/${id}.png`;
  }


  return (
    <div className="pet">
      <img src={imageUrl} alt={`Pet level ${level}`} />
      <h3>{name}</h3>
      <p>ID: {id}</p>
      <p>Level: {level}</p>
      <p>Happiness: {happiness}</p>
      <p>Hunger: {hunger}</p>
    </div>
  );
};

async function fetchPets(contract, setPets, setLoading) {
  try {
    setLoading(true);
   
    const currentSupply = await contract.totalSupply();
    const tokenIds = await Promise.all(
      Array.from({ length: currentSupply }, (_, i) => i + 1).map((i) =>
        contract.ownerOf(i).then(() => i).catch(() => null)
      )
    );

    const ownedTokenIds = tokenIds.filter((tokenId) => tokenId !== null);

    const fetchedPets = await Promise.all(
      ownedTokenIds.map(async (tokenId) => {
        const pet = await contract.pets(tokenId);
        const imageCID = await contract.getImageCID(tokenId);
        return {
          id: pet.id.toString(),
          name: pet.name,
          level: pet.level.toString(),
          happiness: pet.happiness.toString(),
          hunger: pet.hunger.toString(),
          imageCID: imageCID,
        };
      })
    );

    setPets(fetchedPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
  } finally {
    setLoading(false);
  }
}


function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Main />
    </Web3ReactProvider>
  );
}

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function Main() {
  const { activate, active, account, library } = useWeb3React();
  const [contract, setContract] = useState(null);
  const [mintAmount, setMintAmount] = useState(1);
  const [tokenId, setTokenId] = useState('');
  const [newName, setNewName] = useState('');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(0); // Add new state variable for current supply
  const [tokenBalance, setTokenBalance] = useState(''); // Change this line
  const [tokenName, setTokenName] = useState(''); // Set the token name
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
  const [cooldownEnd, setCooldownEnd] = useState(null);
const [timeRemaining, setTimeRemaining] = useState(null);
const [remainingTime, setRemainingTime] = useState(0);

useEffect(() => {
  let interval;
  if (cooldownEnd) {
    interval = setInterval(() => {
      const remaining = cooldownEnd - Date.now();
      if (remaining > 0) {
        setTimeRemaining(remaining);
      } else {
        clearInterval(interval);
        setTimeRemaining(null);
        setCooldownEnd(null);
      }
    }, 1000);
  }
  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, [cooldownEnd]);

useEffect(() => {
  getRemainingTime();
  const interval = setInterval(() => {
      getRemainingTime();
  }, 1000);
  return () => clearInterval(interval);
}, []);



const getRemainingTime = async () => {
  try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const tokenId = 1; // Replace this with the user's actual token ID
      const pet = await contract.methods.pets(tokenId).call();
      const lastInteraction = parseInt(pet.lastInteraction);
      const interactionCooldown = parseInt(await contract.methods.interactionCooldown().call());
      const now = Math.floor(Date.now() / 1000);

      const timeRemaining = Math.max(0, lastInteraction + interactionCooldown - now);
      setRemainingTime(timeRemaining);
  } catch (error) {
      console.error("Error fetching remaining time:", error);
  }
};

const formatTime = (timeInSeconds) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
};



  // Set the contract address for the token
  const contractAddress = '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F';


  async function getBalanceOf(account) {
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const balance = await contract.balanceOf(account);
  setTokenBalance(balance.toString()); // Change this line
  return balance;
}

  
const [interactionCooldown, setInteractionCooldown] = useState(0);

// Add useEffect to handle countdown timer
useEffect(() => {
  let intervalId;
  if (contract && tokenId) {
    contract.interactionCooldown(tokenId).then((cooldown) => {
      const endTime = parseInt(cooldown.toString()) * 1000;
      setInteractionCooldown(endTime);
      intervalId = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(intervalId);
          setInteractionCooldown(0);
        }
      }, 1000);
    });
  }
  return () => clearInterval(intervalId);
}, [contract, tokenId]);



useEffect(() => {
  if (active && library) {
    const signer = library.getSigner();
    const tamagotchiNFTContract = new ethers.Contract(CONTRACT_ADDRESS, TamagotchiNFT_ABI, signer);
    setContract(tamagotchiNFTContract);
    fetchPets(tamagotchiNFTContract, setPets, setLoading);
    tamagotchiNFTContract.totalSupply().then((supply) => setCurrentSupply(supply.toNumber()));
    const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
    tokenContract.balanceOf(account).then((balance) => setTokenBalance(ethers.utils.formatUnits(balance, 18)));
    tokenContract.name().then((name) => setTokenName(name));
  } else {
    setContract(null);
  }
}, [active, library]);

  
  

  async function connectWallet() {
    try {
      await activate(injectedConnector);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  }

  async function mintPets() {
    try {
      await contract.mintPets(mintAmount, { value: ethers.utils.parseEther("50") });
      window.alert("Pets minted successfully!");
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to mint pets", error);
      window.alert("Error minting pets. Please try again.");
    }
  }
  
  async function setName() {
    try {
      await contract.setName(tokenId, newName);
      window.alert("Name set successfully!");
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to set name", error);
      window.alert("Error setting name. Please try again.");
    }
  }
  
  async function interact() {
    try {
      await contract.interact(tokenId);
      window.alert("Interaction successful!");
      fetchPets(contract, setPets, setLoading);
      setCooldownEnd(Date.now() + 60 * 1000); // Set the cooldown end time to 1 minute from now
    } catch (error) {
      console.error("Failed to interact", error);
      window.alert("Error interacting. Please try again.");
    }
  }
  
  
  async function feed() {
    try {
      await contract.feed(tokenId);
      window.alert("Pet fed successfully!");
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to feed", error);
      window.alert("Error feeding pet. Please try again.");
    }
  }
  
  async function play() {
    try {
      await contract.play(tokenId);
      window.alert("Playtime successful!");
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to play", error);
      window.alert("Error playing with pet. Please try again.");
    }
  }
  
  async function evolve() {
    try {
      await contract.evolve(tokenId);
      window.alert("Evolution successful!");
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to evolve", error);
      window.alert("Error evolving pet. Please try again.");
    }
  }

  return (
<div className={`App`}>      
<header className="App-header">
        
      </header>
      <img src={logo} className="App-logo" alt="logo" />
      
      
      {account && contract ? (
        <div>
         <div style={{background: 'linear-gradient(45deg, #f39c12, #8e44ad)', padding: '10px'}}>
<p style={{color: 'rgb(57, 255, 20)'}}>Connected: {account}</p> 
 <p style={{color: 'white'}}>Reward tokens: {tokenBalance} {tokenName}</p>
 <div style={{color: 'red'}}>Time remaining: {formatTime(remainingTime)}</div>

</div>


            <div className="card-container">
            <div className="card">
              <div className="form-group">
                <input
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                />
              </div>
              <p style={{color: 'black'}}>Current supply: {currentSupply}/{MAX_SUPPLY}</p>

              <button onClick={mintPets}><FaPaw /> Mint Pets</button>    
      
              </div>
            <div className="card">
              <div className="form-group">
              <label>Set the Token ID to interact with.</label>
                <input
                  type="number"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
    
            <div className="card">
              <button onClick={interact}><FaPaw /> Interact</button>
              <button onClick={feed}><FaCookieBite /> Feed</button>
              <button onClick={play}><FaFutbol /> Play</button>
              <button onClick={evolve}><FaArrowUp /> Evolve</button>
            </div>
            <div className="form-group">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <button onClick={setName}><MdModeEdit /> Set Name</button>
            </div>
          </div>
          <div className="pets-container">
            {pets.map((pet) => (
              <Pet
                key={pet.id}
                id={pet.id}
                name={pet.name}
                level={pet.level}
                happiness={pet.happiness}
                hunger={pet.hunger}
                imageCID={pet.imageCID}
              />
            ))}
          </div>
        </div>
      ) : (
        <button onClick={connectWallet}><FaConnectdevelop /> Connect Wallet</button>
      )}
      <footer className="App-footer">
        <p>Created by Monsters NFT Inc.</p>
      </footer>
    </div>
  );

}
export default App;

