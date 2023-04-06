// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TamagotchiNFT is
    ERC721URIStorage,
    Ownable,
    ReentrancyGuard,
    Pausable,
    ERC721Burnable
{
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter = Counters.Counter(1);

    struct Pet {
        uint256 id;
        uint256 birthBlock;
        uint256 lastInteractionBlock;
        uint lastInteractionReset;
        uint256 level;
        uint256 happiness;
        uint256 hunger;
        string name;
        uint256 xp; // Add the new xp property
        string superpower;
    } 

    string[] private superpowers = [
        "Flight",
        "Invisibility",
        "Super Strength",
        "Telepathy",
        "Teleportation",
        "Time Travel",
        "Healing",
        "Shape Shifting",
        "Super Speed",
        "Intangibility"
    ];

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        Currency currency;
    }

    enum Currency {
        ETH,
        Token
    }

    mapping(uint256 => Pet) public pets;
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => string) private _babyImageURIs;
    mapping(uint256 => string) private _adultImageURIs;
    mapping(uint256 => uint256) private lastBattleTime;
    mapping(address => uint256) private userWins;
    mapping(string => string) public superpowerCounters;

    uint256 public interactionCooldown = 0 hours;
    uint256 public cost = 0 ether;
    uint256 public constant MAX_SUPPLY = 500;
    IERC20 public rewardsToken;
    uint256 public REWARD_AMOUNT = 100;
    uint256 public evolveHappinessThreshold = 80;
    uint256 public evolveHungerThreshold = 20;

    string private _babyBaseURIs =
        "ipfs://bafybeia4syctcvmxenscq6c2jpwo2i3zoqbua6jwbvnylmvg2uwk5fla6m";
    string private _adultBaseURIs = "https://example.com/adult/";

    event NewPet(uint256 tokenId, uint256 birthTime);
  

    event Listed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        Currency currency
    );
    event Sold(
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        Currency currency
    );
    
    event Delisted(uint256 indexed tokenId);
    event Interaction(uint256 tokenId, uint256 timestamp);
    event Evolution(uint256 tokenId, uint256 newLevel, uint256 timestamp);
    event Feed(uint256 tokenId, uint256 timestamp);
    event Play(uint256 tokenId, uint256 timestamp);
    event NameChange(uint256 indexed tokenId, string newName);

    using SafeERC20 for IERC20;

    constructor(address _rewardsToken) ERC721("TamagotchiNFT", "TNFT") {
        rewardsToken = IERC20(_rewardsToken);
    }

    modifier notListed(uint256 tokenId) {
        require(listings[tokenId].tokenId == 0, "TamagotchiNFT: NFT is listed for sale");
        _;
    }

   // Add the following function to your TamagotchiNFT contract
function getPetDetails(uint256 tokenId) public view returns (uint256 id, uint256 birthBlock, uint256 lastInteractionBlock, uint lastInteractionReset, uint256 level, uint256 happiness, uint256 hunger, string memory name, uint256 xp, string memory superpower) {
    Pet memory pet = pets[tokenId];
    return (pet.id, pet.birthBlock, pet.lastInteractionBlock, pet.lastInteractionReset, pet.level, pet.happiness, pet.hunger, pet.name, pet.xp, pet.superpower);
}



    function list(
        uint256 tokenId,
        uint256 price,
        Currency currency
    ) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "TamagotchiNFT: Not owner nor approved"
        );
        require(price > 0, "TamagotchiNFT: Price should be greater than 0");

        listings[tokenId] = Listing({
            tokenId: tokenId,
            seller: _msgSender(),
            price: price,
            currency: currency
        });

        emit Listed(tokenId, _msgSender(), price, currency);
    }

    function delist(uint256 tokenId) public {
        require(
            listings[tokenId].seller == _msgSender(),
            "TamagotchiNFT: Not owner of the listing"
        );

        delete listings[tokenId];

        emit Delisted(tokenId);
    }

    function buy(uint256 tokenId) public payable nonReentrant {
    Listing memory listing = listings[tokenId];
    require(listing.tokenId != 0, "TamagotchiNFT: Listing not found");

    if (listing.currency == Currency.Token) {
        rewardsToken.safeTransferFrom(
            _msgSender(),
            listing.seller,
            listing.price
        );
    } else {
        require(
            msg.value >= listing.price,
            "TamagotchiNFT: Insufficient ETH"
        );
        payable(listing.seller).transfer(listing.price);
        // Return any extra ETH sent
        if (msg.value > listing.price) {
            payable(_msgSender()).transfer(msg.value - listing.price);
        }
    }

    _transfer(listing.seller, _msgSender(), tokenId);

    delete listings[tokenId];

    emit Sold(tokenId, _msgSender(), listing.price, listing.currency);
}



    function setInteractionCooldown(uint256 _cooldown) external onlyOwner {
        interactionCooldown = _cooldown;
    }

    function setBabyBaseURI(string memory newBabyBaseURIs) public onlyOwner {
        _babyBaseURIs = newBabyBaseURIs;
    }

    function setAdultBaseURI(string memory newAdultBaseURIs) public onlyOwner {
        _adultBaseURIs = newAdultBaseURIs;
    }

    function setCost(uint256 _newCost) external onlyOwner {
        cost = _newCost;
    }

    function setRewardAmount(uint256 _rewardAmount) public onlyOwner {
        REWARD_AMOUNT = _rewardAmount;
    }
    
    function getRemainingInteractionTime(uint256 tokenId) public view returns (uint256) {
    require(_exists(tokenId), "Token does not exist");
    Pet storage pet = pets[tokenId];
    uint256 lastInteraction = pet.lastInteractionBlock;
    uint256 remainingTime = 0;

    if (block.number < lastInteraction + interactionCooldown) {
        remainingTime = lastInteraction + interactionCooldown - block.number;
    }

    return remainingTime;
}


    function setEvolveHappinessThreshold(uint256 _threshold)
        external
        onlyOwner
    {
        evolveHappinessThreshold = _threshold;
    }

    modifier petExists(uint256 tokenId) {
        require(_exists(tokenId), "Token does not exist");
        _;
    }

    function withdrawIERC20(address tokenAddress, uint256 amount)
        external
        onlyOwner
    {
        IERC20(tokenAddress).safeTransfer(msg.sender, amount);
    }

    function getAge(uint256 tokenId)
        public
        view
        petExists(tokenId)
        returns (uint256)
    {
        Pet storage pet = pets[tokenId];
        uint256 blockDifference = block.number - pet.birthBlock;
        // Approximate age in seconds, assuming an average block time of 13 seconds
        uint256 ageInSeconds = blockDifference * 13;
        return ageInSeconds / (1 days);
    }

    function setEvolveHungerThreshold(uint256 _threshold) external onlyOwner {
        evolveHungerThreshold = _threshold;
    }

    function mintPets(uint256 amount) public payable whenNotPaused {
        require(amount > 0 && amount <= 10, "Amount must be between 1 and 10");
        require(
            _tokenIdCounter.current() + amount <= MAX_SUPPLY,
            "Minting would exceed max supply"
        );

        uint256 requiredPayment = cost * amount;
        require(msg.value >= requiredPayment, "Insufficient payment");

       

        for (uint256 i = 0; i < amount; i++) {
            _mintPet(msg.sender);
        }
    }

    function _mintPet(address to) private {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(to, tokenId);

        string memory babyTokenURI = _generateBabyTokenURI(tokenId);
        string memory adultTokenURI = _generateAdultTokenURI(tokenId);

        _setTokenURI(tokenId, babyTokenURI);
        _adultImageURIs[tokenId] = adultTokenURI;

        Pet memory newPet = Pet({
            id: tokenId,
             birthBlock: block.timestamp,
            lastInteractionBlock: block.timestamp,
            lastInteractionReset: block.timestamp,
            level: 1,
            happiness: 100,
            hunger: 0,
            name: "Unnamed",
            xp: 0, // Initialize the new xp property
            superpower: "" // Initialize with an empty superpower
        });

        pets[tokenId] = newPet;
        _tokenIdCounter.increment();

        emit NewPet(tokenId, newPet.birthBlock);
    }

    function setSuperpowerCounter(
        string memory superpower,
        string memory counter
    ) external onlyOwner {
        superpowerCounters[superpower] = counter;
    }

    function getCounterSuperpower(string memory superpower)
        public
        view
        returns (string memory)
    {
        return superpowerCounters[superpower];
    }

    function _generateBabyTokenURI(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(_babyBaseURIs, tokenId.toString(), ".json")
            );
    }

    function _generateAdultTokenURI(uint256 tokenId)
        private
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(_adultBaseURIs, tokenId.toString(), ".json")
            );
    }

    function interact(uint256 tokenId) public whenNotPaused {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");

         Pet storage pet = pets[tokenId];
        require(
            block.timestamp >= pet.lastInteractionBlock + interactionCooldown,
            "Interaction is on cooldown"
        );

        pet.lastInteractionBlock = block.timestamp;
        pet.happiness = pet.happiness + 10;
       

        if (pet.happiness > 100) {
            pet.happiness = 100;
        }

        if (pet.hunger > 100) {
            pet.hunger = 100;
        }

        emit Interaction(tokenId, block.timestamp);
    }

    function setName(uint256 tokenId, string memory newName) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");

        Pet storage pet = pets[tokenId];
        pet.name = newName;

    emit NameChange(tokenId, newName);

    }

    function transferPet(uint256 tokenId, address to) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");

        _transfer(msg.sender, to, tokenId);
    }

    function feed(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");

        Pet storage pet = pets[tokenId];
        require(
            block.timestamp >= pet.lastInteractionBlock + interactionCooldown,
            "Interaction is on cooldown"
        );

        pet.lastInteractionBlock = block.timestamp;
        pet.hunger = pet.hunger - 20;

        if (pet.hunger < 0) {
            pet.hunger = 0;
        }
        emit Feed(tokenId, block.timestamp);
    }

    function play(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");

        Pet storage pet = pets[tokenId];
        require(
            block.timestamp >= pet.lastInteractionBlock + interactionCooldown,
            "Interaction is on cooldown"
        );

        pet.lastInteractionBlock = block.timestamp;
        pet.happiness = pet.happiness + 20;
        pet.hunger = pet.hunger + 10;

        if (pet.happiness > 100) {
            pet.happiness = 100;
        }

        emit Play(tokenId, block.timestamp);
    }

    function evolve(uint256 tokenId) public whenNotPaused {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner of the token");

        Pet storage pet = pets[tokenId];
        require(
            pet.happiness >= evolveHappinessThreshold &&
                pet.hunger <= evolveHungerThreshold,
            string(
                abi.encodePacked(
                    "Pet happiness must be at least ",
                    evolveHappinessThreshold.toString(),
                    " and hunger must be ",
                    evolveHungerThreshold.toString(),
                    " or below to evolve"
                )
            )
        );

        pet.level++;
        pet.happiness = 50;
        pet.hunger = 50;

                pet.lastInteractionBlock = block.timestamp;


        // If the pet reaches level 2, assign a random superpower
        if (pet.level == 2) {
            uint256 randomIndex = uint256(
                keccak256(
                    abi.encodePacked(block.timestamp, block.prevrandao, tokenId)
                )
            ) % superpowers.length;
            pet.superpower = superpowers[randomIndex];
            string memory adultImageURI = _adultImageURIs[tokenId];
            require(
                bytes(adultImageURI).length > 0,
                "Adult image URI not set for this token"
            );
            _setTokenURI(tokenId, adultImageURI);
        }

        // Reward the owner with tokens
        rewardsToken.safeTransfer(msg.sender, REWARD_AMOUNT);
        

        emit Evolution(tokenId, pet.level, block.timestamp);
    }

   

    function getUserWins(address user) public view returns (uint256) {
        return userWins[user];
    }

   

    function _burn(uint256 tokenId)
        internal
        virtual
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function getImageCID(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        Pet storage pet = pets[tokenId];
        if (pet.level < 2) {
            return _generateBabyTokenURI(tokenId);
        } else {
            return _adultImageURIs[tokenId];
        }
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current() - 1;
    }

    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");

        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
