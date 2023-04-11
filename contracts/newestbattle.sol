// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "contracts/UpdatedGotchiToma.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UpdatePokemonBattle is ERC721 {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _battleIdCounter;

    ITamagotchi public tamagotchiNFT;

    enum ElementType {
        Fire,
        Water,
        Grass,
        Electric
    }

    enum ItemType {
    None,
    Shield,
    Potion,
    PowerUp
}

// Add the isActive property to the Item struct
struct Item {
    ItemType itemType;
    uint256 effectValue;
    bool isActive; // Add this line
}

    struct Battle {
        uint256 attackerTokenId;
        uint256 defenderTokenId;
        uint256 attackerHp;
        uint256 defenderHp;
        uint256 attackerPower;
        uint256 defenderPower;
        uint256 attackerLevel;
        uint256 attackerExperience;
        uint256 defenderLevel;
        uint256 defenderExperience;
        ElementType attackerElement;
        ElementType defenderElement;
        address attacker;
        address defender;
        
    }
    

    mapping(uint256 => address) public currentTurn;
    mapping(uint256 => mapping(address => Item)) public battleItems;

    mapping(uint256 => bool) public battleIsActive;
    mapping(uint256 => Battle) public battles;
    mapping(address => uint256) public lastBattleTime;
    IERC20 public rewardToken;

    uint256 public constant REWARD_AMOUNT = 1000;
    uint256 public constant MAX_LEVEL_DIFFERENCE = 5;
    uint256 public constant COOLDOWN_PERIOD = 86400; // 1 day

    event NewBattle(
        uint256 indexed battleId,
        uint256 attackerTokenId,
        uint256 defenderTokenId
    );
    event BattleUpdate(
        uint256 indexed battleId,
        uint256 attackerHp,
        uint256 defenderHp
    );
    event BattleEnded(uint256 indexed battleId, uint256 winnerTokenId);
    event CriticalHit(uint256 indexed battleId, uint256 attackerTokenId);
    event CriticalMiss(uint256 indexed battleId, uint256 attackerTokenId);

    constructor(address _tamagotchiNFTAddress, address _rewardTokenAddress)
        ERC721("PokemonBattle", "PB")
    {
        tamagotchiNFT = ITamagotchi(_tamagotchiNFTAddress);
        rewardToken = IERC20(_rewardTokenAddress);
    }

   function createBattle(uint256 attackerTokenId, uint256 defenderTokenId)
    public
{
    address attacker = tamagotchiNFT.ownerOf(attackerTokenId);

    require(attacker == msg.sender, "You must own the attacker token");
    require(
        tamagotchiNFT.ownerOf(defenderTokenId) != msg.sender,
        "You cannot battle against your own token"
    );

    // Enforce the cooldown period only for the attacker
    require(
        block.timestamp >= lastBattleTime[attacker] + COOLDOWN_PERIOD,
        "Cooldown period has not passed yet for the attacker"
    );

    (uint256 attackerLevel, uint256 attackerExperience) = tamagotchiNFT
        .getLevelAndExperience(attackerTokenId);
    (uint256 defenderLevel, uint256 defenderExperience) = tamagotchiNFT
        .getLevelAndExperience(defenderTokenId);

    // Check if the level difference between attacker and defender is within the allowed range
    require(
        (attackerLevel >= defenderLevel &&
            attackerLevel <= defenderLevel + MAX_LEVEL_DIFFERENCE) ||
            (attackerLevel <= defenderLevel &&
                attackerLevel + MAX_LEVEL_DIFFERENCE >= defenderLevel),
        "Level difference between attacker and defender is too high"
    );

    uint256 battleId = _battleIdCounter.current();
    _battleIdCounter.increment();

    battles[battleId] = _createBattleStruct(
        attackerTokenId,
        defenderTokenId,
        attackerLevel,
        attackerExperience,
        defenderLevel,
        defenderExperience
    );
    battleIsActive[battleId] = true;
    emit NewBattle(battleId, attackerTokenId, defenderTokenId);

    currentTurn[battleId] = attacker;

    // Update the lastBattleTime only for the attacker at the end of the function
    lastBattleTime[attacker] = block.timestamp;




}


    function _createBattleStruct(
        uint256 attackerTokenId,
        uint256 defenderTokenId,
        uint256 attackerLevel,
        uint256 attackerExperience,
        uint256 defenderLevel,
        uint256 defenderExperience
    ) internal view returns (Battle memory) {
        uint256 attackerHp = tamagotchiNFT.getHp(attackerTokenId);
        uint256 defenderHp = tamagotchiNFT.getHp(defenderTokenId);
        uint256 attackerPower = tamagotchiNFT.getPower(attackerTokenId);
        uint256 defenderPower = tamagotchiNFT.getPower(defenderTokenId);
        ElementType attackerElement = stringToElementType(
            tamagotchiNFT.getElementType(attackerTokenId)
        );
        ElementType defenderElement = stringToElementType(
            tamagotchiNFT.getElementType(defenderTokenId)
        );

        return
            Battle({
                attackerTokenId: attackerTokenId,
                defenderTokenId: defenderTokenId,
                attackerHp: attackerHp,
                defenderHp: defenderHp,
                attackerPower: attackerPower,
                defenderPower: defenderPower,
                attackerLevel: attackerLevel,
                attackerExperience: attackerExperience,
                defenderLevel: defenderLevel,
                defenderExperience: defenderExperience,
                attackerElement: attackerElement,
                defenderElement: defenderElement,
                attacker: msg.sender,
                defender: tamagotchiNFT.ownerOf(defenderTokenId)
            });
    }

    function stringToElementType(string memory element)
        internal
        pure
        returns (ElementType)
    {
        if (
            keccak256(abi.encodePacked(element)) ==
            keccak256(abi.encodePacked("Fire"))
        ) {
            return ElementType.Fire;
        } else if (
            keccak256(abi.encodePacked(element)) ==
            keccak256(abi.encodePacked("Water"))
        ) {
            return ElementType.Water;
        } else if (
            keccak256(abi.encodePacked(element)) ==
            keccak256(abi.encodePacked("Grass"))
        ) {
            return ElementType.Grass;
        } else if (
            keccak256(abi.encodePacked(element)) ==
            keccak256(abi.encodePacked("Electric"))
        ) {
            return ElementType.Electric;
        } else {
            revert("Invalid element string");
        }
    }

    function attack(uint256 battleId, ItemType itemToUse) public {
    Battle storage battle = battles[battleId];
    require(battleIsActive[battleId], "Battle is not active");
    require(
        battle.attacker == msg.sender || battle.defender == msg.sender,
        "You are not a participant in this battle"
    );

    require(
        currentTurn[battleId] == msg.sender,
        "It is not your turn to attack"
    );

    if (itemToUse != ItemType.None) {
        Item memory item = battleItems[battleId][msg.sender];
        require(item.itemType == itemToUse, "You don't have the specified item");

        if (itemToUse == ItemType.Shield) {
            battleItems[battleId][msg.sender].isActive = true;
        } else if (itemToUse == ItemType.Potion) {
            battle.attackerHp = battle.attackerHp.add(item.effectValue);
        } else if (itemToUse == ItemType.PowerUp) {
            battle.attackerPower = battle.attackerPower.add(item.effectValue);
        }

        // Remove the used item
        battleItems[battleId][msg.sender].itemType = ItemType.None;
        battleItems[battleId][msg.sender].effectValue = 0;
    } else {
        uint256 damage;

        // Check if the defender has an active shield
        if (battleItems[battleId][battle.defender].isActive) {
            damage = battleItems[battleId][battle.defender].effectValue;
            battleItems[battleId][battle.defender].isActive = false;
        } else {



        // Calculate damage based on elemental advantage, level, and experience
         damage = battle.attackerPower.mul(
            battle.attackerLevel + battle.attackerExperience.div(100)
        );
        if (
            isElementStrongAgainst(
                battle.attackerElement,
                battle.defenderElement
            )
        ) {
            damage = damage.mul(2);
        } else if (
            isElementWeakAgainst(battle.attackerElement, battle.defenderElement)
        ) {
            damage = damage.div(2);
        }

        // Implement a chance of critical hits
        uint256 criticalHitChance = uint256(
            keccak256(abi.encodePacked(block.timestamp, battleId))
        ) % 10;
        if (criticalHitChance < 2) {
            // 20% chance of critical hit
            damage = damage.mul(2);
            emit CriticalHit(battleId, battle.attackerTokenId);
        }

        // Implement a chance of critical miss
        uint256 criticalMissChance = uint256(
            keccak256(abi.encodePacked(block.timestamp, battleId, "miss"))
        ) % 10;
        if (criticalMissChance < 2) {
            // 20% chance of critical miss
            damage = 0;
            emit CriticalMiss(battleId, battle.attackerTokenId);
        }

        unchecked {
            if (battle.defenderHp <= damage) {
                battle.defenderHp = 0;
                battleIsActive[battleId] = false;

                // Update XP, level, and other properties in the TamagotchiNFT contract
                // tamagotchiNFT.updateAfterBattle(battle.attackerTokenId, ...);
                rewardToken.transfer(battle.attacker, REWARD_AMOUNT);

                emit BattleEnded(battleId, battle.attackerTokenId);
            } else {
                battle.defenderHp = battle.defenderHp.sub(damage);
            }
        }

        emit BattleUpdate(battleId, battle.attackerHp, battle.defenderHp);

        // Switch turns
        (battle.attacker, battle.defender) = (battle.defender, battle.attacker);
        (battle.attackerTokenId, battle.defenderTokenId) = (
            battle.defenderTokenId,
            battle.attackerTokenId
        );
        (battle.attackerPower, battle.defenderPower) = (
            battle.defenderPower,
            battle.attackerPower
        );
        (battle.attackerElement, battle.defenderElement) = (
            battle.defenderElement,
            battle.attackerElement
        );

        // Update the HP of the new attacker and defender
        (battle.attackerHp, battle.defenderHp) = (
            battle.defenderHp,
            battle.attackerHp
        );

        // Switch turns
    if (currentTurn[battleId] == battle.attacker) {
        currentTurn[battleId] = battle.defender;
    } else {
        currentTurn[battleId] = battle.attacker;
    }


    }
    }
    }

    function isInActiveBattle(address user) internal view returns (bool) {
    for (uint256 i = 0; i < _battleIdCounter.current(); i++) {
        Battle memory battle = battles[i];
        if (
            battleIsActive[i] &&
            (battle.attacker == user || battle.defender == user)
        ) {
            return true;
        }
    }
    return false;
}


    function buyItem(uint256 battleId, ItemType itemType) public {
    require(itemType != ItemType.None, "Invalid item type");
    uint256 cost = 0;
    uint256 effectValue = 0;

    if (itemType == ItemType.Shield) {
        cost = 100; // Set cost for Shield
        effectValue = 20; // Set shield effect value
    } else if (itemType == ItemType.Potion) {   
        cost = 200; // Set cost for Potion
        effectValue = 20; // Set potion effect value
    } else if (itemType == ItemType.PowerUp) {
        cost = 300; // Set cost for PowerUp
        effectValue = 5; // Set power-up effect value
    }

    require(rewardToken.balanceOf(msg.sender) >= cost, "Not enough reward tokens");

    rewardToken.transferFrom(msg.sender, address(this), cost);

    battleItems[battleId][msg.sender].itemType = itemType;
    battleItems[battleId][msg.sender].effectValue = effectValue;
}


    function endBattle(uint256 battleId) public  {
        Battle storage battle = battles[battleId];
        require(battleIsActive[battleId], "Battle is not active");
        require(
            battle.attacker == msg.sender || battle.defender == msg.sender,
            "You are not a participant in this battle"
        );

        battleIsActive[battleId] = false;
        emit BattleEnded(battleId, 0); // 0 indicates a draw
    }

    

    function getBattle(uint256 battleId)
        public
        view
        returns (
            uint256 attackerTokenId,
            uint256 defenderTokenId,
            uint256 attackerHp,
            uint256 defenderHp,
            uint256 attackerPower,
            uint256 defenderPower,
            string memory attackerElement,
            string memory defenderElement,
            address attacker,
            address defender
        )
    {
        Battle memory battle = battles[battleId];
        return (
            battle.attackerTokenId,
            battle.defenderTokenId,
            battle.attackerHp,
            battle.defenderHp,
            battle.attackerPower,
            battle.defenderPower,
            elementTypeToString(battle.attackerElement),
            elementTypeToString(battle.defenderElement),
            battle.attacker,
            battle.defender
        );
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://api.example.com/pokemonbattle/";
    }

    function isElementStrongAgainst(
        ElementType attackerElement,
        ElementType defenderElement
    ) internal pure returns (bool) {
        return
            (attackerElement == ElementType.Fire &&
                defenderElement == ElementType.Grass) ||
            (attackerElement == ElementType.Water &&
                defenderElement == ElementType.Fire) ||
            (attackerElement == ElementType.Grass &&
                defenderElement == ElementType.Water) ||
            (attackerElement == ElementType.Electric &&
                defenderElement == ElementType.Water);
    }

    function isElementWeakAgainst(
        ElementType attackerElement,
        ElementType defenderElement
    ) internal pure returns (bool) {
        return
            (attackerElement == ElementType.Fire &&
                defenderElement == ElementType.Water) ||
            (attackerElement == ElementType.Water &&
                defenderElement == ElementType.Grass) ||
            (attackerElement == ElementType.Grass &&
                defenderElement == ElementType.Fire) ||
            (attackerElement == ElementType.Electric &&
                defenderElement == ElementType.Grass);
    }

    function elementTypeToString(ElementType element)
        internal
        pure
        returns (string memory)
    {
        if (element == ElementType.Fire) {
            return "Fire";
        } else if (element == ElementType.Water) {
            return "Water";
        } else if (element == ElementType.Grass) {
            return "Grass";
        } else if (element == ElementType.Electric) {
            return "Electric";
        } else {
            revert("Invalid ElementType");
        }
    }
}
