import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import Pet from './Pet';
import Battle from './Battle';
import MintPets from './MintPets';
import PetList from './PetList';
import Wallet from './Wallet';
import {
  interact,
  feed,
  play,
  evolve,
  setName,
  buyPet,
  listPet,
  delistPet,
} from './PetActions';

const Main = () => {
  
};

export default Main;