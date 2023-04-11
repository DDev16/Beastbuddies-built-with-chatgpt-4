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
import Battle from './Battle.js';
import TamagotchiNFT_ABI from './abi.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import SearchBar from './components/Search.js';
import NewBattle from './NewBattle.js';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BattleArena from "./BattleArena"; // import the BattleArena component






const injectedConnector = new InjectedConnector();

const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const RPC_URL = "http://127.0.0.1:8545/";
const CHAIN_ID = 31337;
const MAX_SUPPLY = 500; // Add the max supply constant
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');


const Pet = ({
  id,
  name,
  level,
  happiness,
  hunger,
  xp,
  superpower,
  lastInteraction,
  interact,
  feed,
  play,
  evolve,
  setName,
  listPet,
  delistPet,
  buyPet,
  contract,
  account
}) => {
  let imageUrl;
  if (level >= 2) {
    imageUrl = `https://bafybeidm7jfef6v6l7dutjat52fl3ynv6jrrovhfgfrzipvxmbdnaqsnhm.ipfs.nftstorage.link/${id}.png`;
  } else {
    imageUrl = `https://bafybeih6ocvp4vmuibfe2xvuvjjujdi5fi7bb4aylvvakrvejztmuwx7ee.ipfs.nftstorage.link/${id}.png`;
  }

  const [newName, setNewName] = useState('');
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState('ETH');
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (contract && account) {
        const owner = await contract.ownerOf(id);
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      }
    };

    checkOwnership();
  }, [contract, account, id]);


  return (
    <>
      <div className="pet">
        <img src={imageUrl} alt={`Pet level ${level}`} />
        <h3>{name}</h3>
        <p>ID: {id}</p>
        <p>Level: {level}</p>
        <p>XP: {xp}</p>
        <p>Superpower: {superpower}</p>
        <p>Happiness: {happiness}</p>
        <p>Hunger: {hunger}</p>
        <p>
          Last Interaction: {new Date(lastInteraction * 1000).toLocaleString()}
        </p>

        {isOwner ? (
          <>
            

            <div className="form-group">
  <label></label>
  <div className="action-button">
  <input
    type="text"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    placeholder="Set New Name"
  />
</div>
<button onClick={() => setName(id, newName)}>
  <MdModeEdit /> Set Name
</button>
</div>
            <div className="buttons">
              <button className="action-button" onClick={() => interact(id)}>
                <FaPaw /> Interact
              </button>
              <button className="action-button" onClick={() => feed(id)}>
                <FaCookieBite /> Feed
              </button>
              <button className="action-button" onClick={() => play(id)}>
                <FaFutbol /> Play
              </button>
              <button className="action-button" onClick={() => evolve(id)}>
                <FaArrowUp /> Evolve
              </button>
            </div>

            <div className="form-group">
              <label>Set Listing Price</label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                
              />
            </div>
            <div className="form-group">
              <label>Choose Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="null">Ethereum (ETH)</option>
                <option value="null">Monster Coin (MC)</option>
                {/* Add other currency options here */}
              </select>
            </div>

            <div className="buttons">
              <button
                className="action-button"
                onClick={() => listPet(id, price, currency)}
              >
                <FaConnectdevelop /> List Pet
              </button>
              <button className="action-button" onClick={() => delistPet(id)}>
                <FaConnectdevelop /> Delist Pet
              </button>
            </div>
          </>
        ) : (
          <div className="buttons">
            <button className="action-button" onClick={() => buyPet(id)}>
              <FaConnectdevelop /> Buy Pet
            </button>
          </div>
        )}
      </div>
    </>
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
        try {
          const pet = await contract.pets(tokenId);
          const imageCID = await contract.getImageCID(tokenId);
          return {
            id: pet.id?.toString() || '',
            name: pet.name || '',
            level: pet.level?.toString() || '',
            happiness: pet.happiness?.toString() || '',
            hunger: pet.hunger?.toString() || '',
            imageCID: imageCID || '',
            xp: pet.xp?.toString() || '', // Add XP points
            superpower: pet.superpower || '', // Add superpower
            lastInteraction: pet.lastInteraction?.toString() || '', // Add last interaction
          };
        } catch (error) {
          console.error(`Error fetching pet with tokenId ${tokenId}:`, error);
          return null;
        }
      })
    );

    setPets(fetchedPets.filter(pet => pet !== null));
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
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(0); // Add new state variable for current supply
  const [tokenBalance, setTokenBalance] = useState(''); // Change this line
  const [tokenName, setTokenName] = useState(''); // Set the token name
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
  const [cooldownEnd, setCooldownEnd] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [listingPrice, setListingPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


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
    fetchPets(contract, setPets, setLoading);
  }, [contract]);

  const filteredPets = pets.filter((pet) => {
    const queryLowerCase = searchQuery.toLowerCase();
    return (
      pet.superpower.toLowerCase().includes(queryLowerCase) ||
      pet.id.toLowerCase().includes(queryLowerCase) ||
      pet.name.toLowerCase().includes(queryLowerCase)
    );
  });
  


  // Set the contract address for the ERC20 token
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";



 

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
      toast.success("Pets minted successfully!", {
        icon: <img src={logo} alt="./192.png" />
      });
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to mint pets", error);
      toast.error("Error minting pets. Please try again.", {
        icon: <img src={logo} alt="My Logo" />
      });
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


  async function interact(tokenId) {
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


  async function feed(tokenId) {
    try {
      await contract.feed(tokenId);
      window.alert("Pet fed successfully!");
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to feed", error);
      window.alert("Error feeding pet. Please try again.");
    }
  }

  async function play(tokenId) {
    try {
      await contract.play(tokenId);
      window.alert("Playtime successful!");
      fetchPets(contract, setPets, setLoading);
    } catch (error) {
      console.error("Failed to play", error);
      window.alert("Error playing with pet. Please try again.");
    }
  }

  async function evolve(tokenId) {
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

             <div className="card">
       
             <div className="card-timer">
  <div className="card-timer-content">
    <p className="account-info">Connected: {account}</p>
    <p className="token-info">Reward tokens: {tokenBalance} {tokenName}</p>
  </div>   
</div>
</div>
              <div className="form-group">
                <input
                  type="number"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                />
              
              <p style={{ color: 'white' }}>Current supply: {currentSupply}/{MAX_SUPPLY}</p>
              <button onClick={mintPets}><FaPaw /> Mint Pets</button>
              <ToastContainer position="top-center" autoClose={3000} />
            
          </div>
          <Battle contract={contract} pets={pets} />
          <NewBattle></NewBattle>
          <Routes>
  <Route path="/" element={<NewBattle />} index />
  <Route path="/battle/:battleId" element={<NewBattle />} />
</Routes>
         
          <SearchBar setSearchQuery={setSearchQuery} />
          <div>

  
         
          
    </div>
          <div className="pets-container">
            {filteredPets.map((pet) => (
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
                contract={contract} // Pass the contract instance
                account={account} // Pass the account address
              />
            ))}
          </div>
          <footer className="card">
            <div className="card-timer">
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
                    <li><a href="#">Marketplace</a></li>
                    <li><a href="https://monstersnftinc.co">Website</a></li>
                  </ul>
                </div>
                <div className="col-md-4">
                  <p className="powered-by">Powered by Monsters NFT Inc.</p>
                  <p>&copy; 2023 </p>
                </div>
              </div>
            </div>
          </footer>
          </div>

          
      ) : (
        <button onClick={connectWallet}><FaConnectdevelop /> Connect Wallet</button>
      )}

 
    </div>
  );

}
export default App;

