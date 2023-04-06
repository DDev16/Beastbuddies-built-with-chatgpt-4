// Main.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import './App.css';
import { FaConnectdevelop, FaPaw, FaCookieBite, FaFutbol, FaArrowUp } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import logo from './192.png';
import contractABI from './erc20.abi.json';
import Web3 from 'web3';
import Battle from './Battle.js';
import TamagotchiNFT_ABI from './abi.js';
import Pet from './Pet.js';
import { fetchPets } from './utils.js';



const injectedConnector = new InjectedConnector();
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const RPC_URL = "http://127.0.0.1:8545/";
const CHAIN_ID = 31337;
const MAX_SUPPLY = 500;
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

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
    const [listingTokenId, setListingTokenId] = useState('');
  const [listingPrice, setListingPrice] = useState('');
  
  
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
  
    async function setName(id, newName) {
      try {
        await contract.setName(id, newName);
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
  
   
    async function buyPet(tokenId) {
      try {
        const listing = await contract.listings(tokenId);
        const value = listing.currency === "" ? { value: ethers.utils.parseEther(listingPrice) } : {};
        await contract.buy(tokenId, value);
        window.alert("Pet bought successfully!");
        fetchPets(contract, setPets, setLoading);
      } catch (error) {
        console.error("Failed to buy pet", error);
        window.alert("Error buying pet. Please try again.");
      }
    }
    
    async function listPet(tokenId, price) {
      try {
        if (isNaN(price) || price === "") {
          window.alert("Please enter a valid listing price.");
          return;
        }
    
        await contract.list(tokenId, ethers.utils.parseEther(price), price);
        window.alert("Pet listed successfully!");
        fetchPets(contract, setPets, setLoading);
      } catch (error) {
        console.error("Failed to list pet", error);
        window.alert("Error listing pet. Please try again.");
      }
    }
    
    async function delistPet(tokenId) {
      try {
        await contract.delist(tokenId);
        window.alert("Pet delisted successfully!");
        fetchPets(contract, setPets, setLoading);
      } catch (error) {
        console.error("Failed to delist pet", error);
        window.alert("Error delisting pet. Please try again.");
      }
    }
  
    return (
      <div className={`App`}>
        <header className="App-header">
        </header>
        <img src={logo} className="App-logo" alt="logo" />
        {account && contract ? (
          <div>
  <div style={{ background: 'linear-gradient(45deg, #39FF14, #8e44ad)', padding: '10px' }}>
              <p style={{ color: 'rgb(57, 255, 20)' }}>Connected: {account}</p>
              <p style={{ color: 'white' }}>Reward tokens: {tokenBalance} {tokenName}</p>
              <div style={{ color: 'red' }}>Time remaining: {formatTime(remainingTime)}</div>
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
                <p style={{ color: 'black' }}>Current supply: {currentSupply}/{MAX_SUPPLY}</p>
                <button onClick={mintPets}><FaPaw /> Mint Pets</button>
              </div>                 
        </div>
                 <Battle contract={contract} pets={pets} />
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
        xp={pet.xp}
        superpower={pet.superpower}
        lastInteraction={pet.lastInteraction}
        interact={interact}
        feed={feed}
        play={play}
        evolve={evolve}
        setName={setName}
        listPet={listPet}
        delistPet={delistPet}
        buyPet={buyPet}
        tokenId={tokenId}
        setTokenId={setTokenId} // Pass the setTokenId function here
      />
   
  
  ))}
   <footer className="App-footer">
   <div className="container">
          <div className="row">
            <div className="col-md-4">
            <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div className="col-md-4">
              <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <p>&copy; 2023 My Website</p>
              <p className="powered-by">Powered by Monsters NFT Inc.</p>
            </div>
          </div>
        </div>
      </footer>
  </div>
  
          </div>
        ) : (
          <button onClick={connectWallet}><FaConnectdevelop /> Connect Wallet</button>
        )}
        
        
      </div>
    );
  
  }
export default Main;

