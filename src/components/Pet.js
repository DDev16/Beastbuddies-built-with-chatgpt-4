import React, { useState } from 'react';
import { FaPaw, FaCookieBite, FaFutbol, FaArrowUp } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';

const Pet = ({
  id,
  name,
  level,
  happiness,
  hunger,
  imageCID,
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
  tokenId,
  setTokenId
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

  return (
    <div className="pet">
      <img src={imageUrl} alt={`Pet level ${level}`} />
      <h3>{name}</h3>
      <p>ID: {id}</p>
      <p>Level: {level}</p>
      <p>XP: {xp}</p>
      <p>Superpower: {superpower}</p>
      <p>Happiness: {happiness}</p>
      <p>Hunger: {hunger}</p>
      <p>Last Interaction: {new Date(lastInteraction * 1000).toLocaleString()}</p>
      <div className="form-group">
        <label>Set the Token ID to interact with.</label>
        <input
          type="number"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Set New Name</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
      </div>
      <button onClick={() => setName(id, newName)}><MdModeEdit /> Set Name</button>
      <div className="buttons">
        <button className="action-button" onClick={() => interact(id)}><FaPaw /> Interact</button>
        <button className="action-button" onClick={() => feed(id)}><FaCookieBite /> Feed</button>
        <button className="action-button" onClick={() => play(id)}><FaFutbol /> Play</button>
        <button className="action-button" onClick={() => evolve(id)}><FaArrowUp /> Evolve</button>
      </div>
      <div className="form-group">
        <label>List Pet for Sale</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
        </select>
      </div>
      <button onClick={() => listPet(id, price, currency)}>List for Sale</button>
      <button onClick={() => delistPet(id)}>Delist from Sale</button>
      <button onClick={() => buyPet(id, tokenId)}>Buy Pet</button>
    </div>
  );
};

export default Pet;
