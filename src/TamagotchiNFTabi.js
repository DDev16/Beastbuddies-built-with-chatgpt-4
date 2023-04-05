[
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
]