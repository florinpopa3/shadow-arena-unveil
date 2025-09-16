// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract ShadowArena is SepoliaConfig {
    using FHE for *;
    
    struct Player {
        euint32 playerId;
        euint32 x;
        euint32 y;
        euint32 health;
        euint32 armor;
        euint32 ammo;
        bool isAlive;
        bool isEncrypted;
        address wallet;
        uint256 joinTime;
        uint256 lastUpdate;
    }
    
    struct Weapon {
        euint32 weaponId;
        euint32 damage;
        euint32 range;
        euint32 ammo;
        bool isRare;
        string name;
    }
    
    struct Loot {
        euint32 lootId;
        euint32 x;
        euint32 y;
        euint32 value;
        bool isCollected;
        string itemType;
    }
    
    struct BattleResult {
        euint32 battleId;
        euint32 winnerId;
        euint32 loserId;
        euint32 damageDealt;
        bool isEncrypted;
        uint256 timestamp;
    }
    
    mapping(uint256 => Player) public players;
    mapping(uint256 => Weapon) public weapons;
    mapping(uint256 => Loot) public loot;
    mapping(uint256 => BattleResult) public battles;
    mapping(address => euint32) public playerReputation;
    mapping(address => euint32) public killCount;
    
    uint256 public playerCounter;
    uint256 public weaponCounter;
    uint256 public lootCounter;
    uint256 public battleCounter;
    
    address public owner;
    address public verifier;
    
    // Arena dimensions (encrypted)
    euint32 public arenaWidth;
    euint32 public arenaHeight;
    
    // Game state
    bool public gameActive;
    uint256 public gameStartTime;
    uint256 public gameEndTime;
    
    event PlayerJoined(uint256 indexed playerId, address indexed wallet);
    event PlayerMoved(uint256 indexed playerId, uint32 x, uint32 y);
    event WeaponFound(uint256 indexed weaponId, uint32 x, uint32 y);
    event LootCollected(uint256 indexed lootId, uint256 indexed playerId);
    event BattleOccurred(uint256 indexed battleId, uint256 indexed winnerId, uint256 indexed loserId);
    event GameStarted(uint256 startTime);
    event GameEnded(uint256 endTime, uint256 winnerId);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
        gameActive = false;
        
        // Initialize arena dimensions (encrypted)
        arenaWidth = FHE.asEuint32(1000);
        arenaHeight = FHE.asEuint32(1000);
    }
    
    function joinArena(
        externalEuint32 initialX,
        externalEuint32 initialY,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(!gameActive, "Game is already active");
        require(players[playerCounter].wallet == address(0), "Player already exists");
        
        uint256 playerId = playerCounter++;
        
        // Convert external encrypted coordinates to internal
        euint32 encryptedX = FHE.fromExternal(initialX, inputProof);
        euint32 encryptedY = FHE.fromExternal(initialY, inputProof);
        
        players[playerId] = Player({
            playerId: FHE.asEuint32(0), // Will be set properly later
            x: encryptedX,
            y: encryptedY,
            health: FHE.asEuint32(100),
            armor: FHE.asEuint32(0),
            ammo: FHE.asEuint32(30),
            isAlive: true,
            isEncrypted: true,
            wallet: msg.sender,
            joinTime: block.timestamp,
            lastUpdate: block.timestamp
        });
        
        emit PlayerJoined(playerId, msg.sender);
        return playerId;
    }
    
    function movePlayer(
        uint256 playerId,
        externalEuint32 newX,
        externalEuint32 newY,
        bytes calldata inputProof
    ) public {
        require(players[playerId].wallet == msg.sender, "Not your player");
        require(players[playerId].isAlive, "Player is dead");
        require(gameActive, "Game not active");
        
        // Convert external encrypted coordinates to internal
        euint32 encryptedX = FHE.fromExternal(newX, inputProof);
        euint32 encryptedY = FHE.fromExternal(newY, inputProof);
        
        // Update player position (encrypted)
        players[playerId].x = encryptedX;
        players[playerId].y = encryptedY;
        players[playerId].lastUpdate = block.timestamp;
        
        emit PlayerMoved(playerId, 0, 0); // Coordinates encrypted, will be decrypted off-chain
    }
    
    function spawnWeapon(
        externalEuint32 x,
        externalEuint32 y,
        string memory name,
        uint32 damage,
        uint32 range,
        uint32 ammo,
        bool isRare,
        bytes calldata inputProof
    ) public {
        require(msg.sender == owner || msg.sender == verifier, "Not authorized");
        require(gameActive, "Game not active");
        
        uint256 weaponId = weaponCounter++;
        
        // Convert external encrypted coordinates to internal
        euint32 encryptedX = FHE.fromExternal(x, inputProof);
        euint32 encryptedY = FHE.fromExternal(y, inputProof);
        
        weapons[weaponId] = Weapon({
            weaponId: FHE.asEuint32(0), // Will be set properly later
            damage: FHE.asEuint32(damage),
            range: FHE.asEuint32(range),
            ammo: FHE.asEuint32(ammo),
            isRare: isRare,
            name: name
        });
        
        // Create loot entry for the weapon
        uint256 lootId = lootCounter++;
        loot[lootId] = Loot({
            lootId: FHE.asEuint32(0), // Will be set properly later
            x: encryptedX,
            y: encryptedY,
            value: FHE.asEuint32(weaponId),
            isCollected: false,
            itemType: "weapon"
        });
        
        emit WeaponFound(weaponId, 0, 0); // Coordinates encrypted
    }
    
    function collectLoot(
        uint256 playerId,
        uint256 lootId,
        externalEuint32 playerX,
        externalEuint32 playerY,
        bytes calldata inputProof
    ) public {
        require(players[playerId].wallet == msg.sender, "Not your player");
        require(players[playerId].isAlive, "Player is dead");
        require(!loot[lootId].isCollected, "Loot already collected");
        require(gameActive, "Game not active");
        
        // Convert external encrypted coordinates to internal
        euint32 encryptedPlayerX = FHE.fromExternal(playerX, inputProof);
        euint32 encryptedPlayerY = FHE.fromExternal(playerY, inputProof);
        
        // Check proximity (encrypted distance calculation)
        euint32 deltaX = FHE.sub(encryptedPlayerX, loot[lootId].x);
        euint32 deltaY = FHE.sub(encryptedPlayerY, loot[lootId].y);
        
        // Simple proximity check (in real implementation, would use encrypted distance)
        ebool isNearby = FHE.and(
            FHE.lt(FHE.abs(deltaX), FHE.asEuint32(10)),
            FHE.lt(FHE.abs(deltaY), FHE.asEuint32(10))
        );
        
        // Mark loot as collected
        loot[lootId].isCollected = true;
        
        // Update player stats based on loot type
        if (keccak256(bytes(loot[lootId].itemType)) == keccak256(bytes("weapon"))) {
            // Add weapon to player (simplified)
            players[playerId].ammo = FHE.add(players[playerId].ammo, FHE.asEuint32(30));
        }
        
        emit LootCollected(lootId, playerId);
    }
    
    function engageBattle(
        uint256 attackerId,
        uint256 targetId,
        externalEuint32 attackerX,
        externalEuint32 attackerY,
        externalEuint32 targetX,
        externalEuint32 targetY,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(players[attackerId].wallet == msg.sender, "Not your player");
        require(players[attackerId].isAlive, "Attacker is dead");
        require(players[targetId].isAlive, "Target is dead");
        require(gameActive, "Game not active");
        
        uint256 battleId = battleCounter++;
        
        // Convert external encrypted coordinates to internal
        euint32 encryptedAttackerX = FHE.fromExternal(attackerX, inputProof);
        euint32 encryptedAttackerY = FHE.fromExternal(attackerY, inputProof);
        euint32 encryptedTargetX = FHE.fromExternal(targetX, inputProof);
        euint32 encryptedTargetY = FHE.fromExternal(targetY, inputProof);
        
        // Check if players are in range (encrypted distance calculation)
        euint32 deltaX = FHE.sub(encryptedAttackerX, encryptedTargetX);
        euint32 deltaY = FHE.sub(encryptedAttackerY, encryptedTargetY);
        
        ebool inRange = FHE.and(
            FHE.lt(FHE.abs(deltaX), FHE.asEuint32(50)),
            FHE.lt(FHE.abs(deltaY), FHE.asEuint32(50))
        );
        
        // Calculate damage (encrypted)
        euint32 damage = FHE.asEuint32(25); // Base damage
        
        // Apply damage to target
        players[targetId].health = FHE.sub(players[targetId].health, damage);
        
        // Check if target is dead
        ebool isDead = FHE.lt(players[targetId].health, FHE.asEuint32(1));
        
        // Update battle result
        battles[battleId] = BattleResult({
            battleId: FHE.asEuint32(0), // Will be set properly later
            winnerId: FHE.asEuint32(attackerId),
            loserId: FHE.asEuint32(targetId),
            damageDealt: damage,
            isEncrypted: true,
            timestamp: block.timestamp
        });
        
        // Update kill count for attacker
        killCount[msg.sender] = FHE.add(killCount[msg.sender], FHE.asEuint32(1));
        
        emit BattleOccurred(battleId, attackerId, targetId);
        return battleId;
    }
    
    function startGame() public {
        require(msg.sender == owner, "Only owner can start game");
        require(!gameActive, "Game already active");
        require(playerCounter > 1, "Need at least 2 players");
        
        gameActive = true;
        gameStartTime = block.timestamp;
        gameEndTime = block.timestamp + 3600; // 1 hour game
        
        emit GameStarted(gameStartTime);
    }
    
    function endGame() public {
        require(msg.sender == owner, "Only owner can end game");
        require(gameActive, "Game not active");
        
        gameActive = false;
        
        // Find winner (simplified - in real implementation would use encrypted logic)
        uint256 winnerId = 0;
        for (uint256 i = 0; i < playerCounter; i++) {
            if (players[i].isAlive) {
                winnerId = i;
                break;
            }
        }
        
        emit GameEnded(block.timestamp, winnerId);
    }
    
    function updateReputation(address player, euint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(player != address(0), "Invalid player address");
        
        playerReputation[player] = reputation;
    }
    
    function getPlayerInfo(uint256 playerId) public view returns (
        uint8 x,
        uint8 y,
        uint8 health,
        uint8 armor,
        uint8 ammo,
        bool isAlive,
        bool isEncrypted,
        address wallet,
        uint256 joinTime,
        uint256 lastUpdate
    ) {
        Player storage player = players[playerId];
        return (
            0, // FHE.decrypt(player.x) - will be decrypted off-chain
            0, // FHE.decrypt(player.y) - will be decrypted off-chain
            0, // FHE.decrypt(player.health) - will be decrypted off-chain
            0, // FHE.decrypt(player.armor) - will be decrypted off-chain
            0, // FHE.decrypt(player.ammo) - will be decrypted off-chain
            player.isAlive,
            player.isEncrypted,
            player.wallet,
            player.joinTime,
            player.lastUpdate
        );
    }
    
    function getWeaponInfo(uint256 weaponId) public view returns (
        uint8 damage,
        uint8 range,
        uint8 ammo,
        bool isRare,
        string memory name
    ) {
        Weapon storage weapon = weapons[weaponId];
        return (
            0, // FHE.decrypt(weapon.damage) - will be decrypted off-chain
            0, // FHE.decrypt(weapon.range) - will be decrypted off-chain
            0, // FHE.decrypt(weapon.ammo) - will be decrypted off-chain
            weapon.isRare,
            weapon.name
        );
    }
    
    function getLootInfo(uint256 lootId) public view returns (
        uint8 x,
        uint8 y,
        uint8 value,
        bool isCollected,
        string memory itemType
    ) {
        Loot storage lootItem = loot[lootId];
        return (
            0, // FHE.decrypt(lootItem.x) - will be decrypted off-chain
            0, // FHE.decrypt(lootItem.y) - will be decrypted off-chain
            0, // FHE.decrypt(lootItem.value) - will be decrypted off-chain
            lootItem.isCollected,
            lootItem.itemType
        );
    }
    
    function getBattleInfo(uint256 battleId) public view returns (
        uint8 winnerId,
        uint8 loserId,
        uint8 damageDealt,
        bool isEncrypted,
        uint256 timestamp
    ) {
        BattleResult storage battle = battles[battleId];
        return (
            0, // FHE.decrypt(battle.winnerId) - will be decrypted off-chain
            0, // FHE.decrypt(battle.loserId) - will be decrypted off-chain
            0, // FHE.decrypt(battle.damageDealt) - will be decrypted off-chain
            battle.isEncrypted,
            battle.timestamp
        );
    }
    
    function getPlayerReputation(address player) public view returns (uint8) {
        return 0; // FHE.decrypt(playerReputation[player]) - will be decrypted off-chain
    }
    
    function getKillCount(address player) public view returns (uint8) {
        return 0; // FHE.decrypt(killCount[player]) - will be decrypted off-chain
    }
    
    function getArenaDimensions() public view returns (uint8 width, uint8 height) {
        return (
            0, // FHE.decrypt(arenaWidth) - will be decrypted off-chain
            0  // FHE.decrypt(arenaHeight) - will be decrypted off-chain
        );
    }
}
