import { ethers } from 'ethers';
import TamagotchiNFT from './TamagotchiNFTabi';

class TamagotchiNFTContract {
  constructor(chainId, rpcUrl) {
    this.chainId = chainId;
    this.rpcUrl = rpcUrl;
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcUrl, {
      chainId: this.chainId,
    });
    this.signer = null;
    this.contractAddress = '0xc351628EB244ec633d5f21fBD6621e1a683B1181';
    this.contract = new ethers.Contract(
      this.contractAddress,
      TamagotchiNFT.abi,
      this.provider
    );
  }

  async connect(wallet) {
    this.signer = wallet.connect(this.provider);
    this.contract = this.contract.connect(this.signer);
    return this.signer;
  }

  async getBalance() {
    if (!this.signer) {
      return null;
    }
    const balance = await this.signer.getBalance();
    return ethers.utils.formatEther(balance);
  }

  async mintPets(amount) {
    const cost = ethers.utils.parseEther('50').mul(amount);
    const transaction = await this.contract.mintPets(amount, {
      value: cost,
    });
    await transaction.wait();
  }

  async setName(tokenId, newName) {
    const transaction = await this.contract.setName(tokenId, newName);
    await transaction.wait();
  }

  async transferPet(tokenId, to) {
    const transaction = await this.contract.transferPet(tokenId, to);
    await transaction.wait();
  }

  async feed(tokenId) {
    const transaction = await this.contract.feed(tokenId);
    await transaction.wait();
  }

  async play(tokenId) {
    const transaction = await this.contract.play(tokenId);
    await transaction.wait();
  }

  async evolve(tokenId) {
    const transaction = await this.contract.evolve(tokenId);
    await transaction.wait();
}

async getTokenURI(tokenId) {
const tokenURI = await this.contract.tokenURI(tokenId);
return tokenURI;
}

async getPet(tokenId) {
const pet = await this.contract.pets(tokenId);
return {
id: pet.id.toNumber(),
birthTime: pet.birthTime.toNumber(),
lastInteraction: pet.lastInteraction.toNumber(),
lastInteractionReset: pet.lastInteractionReset.toNumber(),
level: pet.level.toNumber(),
happiness: pet.happiness.toNumber(),
hunger: pet.hunger.toNumber(),
name: pet.name,
};
}

async getBabyImageURI(tokenId) {
const babyImageURI = await this.contract._generateBabyTokenURI(tokenId);
return babyImageURI;
}

async getAdultImageURI(tokenId) {
const adultImageURI = await this.contract._adultImageURIs(tokenId);
return adultImageURI;
}
}

export default TamagotchiNFTContract;