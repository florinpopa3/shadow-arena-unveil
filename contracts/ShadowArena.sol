// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract ShadowArena is SepoliaConfig {
    using FHE for *;
    
    struct Player {
        euint32 playerId;
        euint32 xPosition;
        euint32 yPosition;
        euint8 health;
        euint8 armor;
        euint8 ammo;
        ebool isAlive;
        ebool isInGame;
        address playerAddress;
        uint256 joinTime;
    }

    struct GameState {
        euint32 gameId;
        euint32 playerCount;
        ebool isActive;
        euint32 arenaSize;
        uint256 startTime;
    }

    struct Weapon {
        euint32 weaponId;
        euint32 xPosition;
        euint32 yPosition;
        euint8 damage;
        euint8 ammo;
        ebool isCollected;
    }

    mapping(address => Player) public players;
    mapping(uint256 => Weapon) public weapons;
    GameState public currentGameState;
    
    uint256 public playerCounter;
    uint256 public weaponCounter;
    address public owner;
    
    // Events for encrypted data
    event PlayerJoined(address indexed playerAddress, uint32 playerId, uint32 x, uint32 y);
    event PlayerMoved(address indexed playerAddress, uint32 x, uint32 y);
    event PlayerAttacked(address indexed attacker, address indexed target, uint8 damage);
    event PlayerEliminated(address indexed playerAddress);
    event WeaponSpawned(uint32 weaponId, uint32 x, uint32 y);
    event WeaponCollected(address indexed player, uint32 weaponId);
    event GameStateUpdated(uint32 gameId, uint32 playerCount, bool isActive);

    constructor() {
        owner = msg.sender;
        playerCounter = 0;
        weaponCounter = 0;
        currentGameState = GameState({
            gameId: FHE.asEuint32(1),
            playerCount: FHE.asEuint32(0),
            isActive: FHE.asEbool(true),
            arenaSize: FHE.asEuint32(1000),
            startTime: block.timestamp
        });
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier gameActive() {
        require(currentGameState.isActive.decrypt(), "Game is not active");
        _;
    }

    modifier playerInGame() {
        require(players[msg.sender].isInGame.decrypt(), "Player not in game");
        _;
    }

    modifier playerAlive() {
        require(players[msg.sender].isAlive.decrypt(), "Player is eliminated");
        _;
    }

    // Join the arena with encrypted position
    function joinArena(externalEuint32 _xPosition, externalEuint32 _yPosition) public gameActive {
        require(players[msg.sender].playerAddress == address(0), "Player already in game");
        
        playerCounter++;
        players[msg.sender] = Player({
            playerId: FHE.asEuint32(uint32(playerCounter)),
            xPosition: FHE.fromExternal(_xPosition),
            yPosition: FHE.fromExternal(_yPosition),
            health: FHE.asEuint8(100),
            armor: FHE.asEuint8(50),
            ammo: FHE.asEuint8(30),
            isAlive: FHE.asEbool(true),
            isInGame: FHE.asEbool(true),
            playerAddress: msg.sender,
            joinTime: block.timestamp
        });

        // Update game state with encrypted addition
        currentGameState.playerCount = FHE.add(currentGameState.playerCount, FHE.asEuint32(1));

        emit PlayerJoined(msg.sender, playerCounter, _xPosition.decrypt(), _yPosition.decrypt());
    }

    // Move player with encrypted coordinates
    function movePlayer(externalEuint32 _newX, externalEuint32 _newY) public playerInGame playerAlive {
        players[msg.sender].xPosition = FHE.fromExternal(_newX);
        players[msg.sender].yPosition = FHE.fromExternal(_newY);

        emit PlayerMoved(msg.sender, _newX.decrypt(), _newY.decrypt());
    }

    // Attack another player with encrypted damage
    function attackPlayer(address _target, externalEuint8 _damage) public playerInGame playerAlive {
        require(players[_target].isInGame.decrypt(), "Target not in game");
        require(players[_target].isAlive.decrypt(), "Target is already eliminated");
        require(_target != msg.sender, "Cannot attack yourself");

        // Calculate encrypted damage with armor reduction
        euint8 damage = FHE.fromExternal(_damage);
        euint8 armor = players[_target].armor;
        euint8 actualDamage = FHE.sub(damage, FHE.div(armor, FHE.asEuint8(2)));
        
        // Apply damage to health
        euint8 currentHealth = players[_target].health;
        euint8 newHealth = FHE.sub(currentHealth, actualDamage);
        players[_target].health = newHealth;

        // Check if player is eliminated (simplified check)
        if (newHealth.decrypt() <= 0) {
            players[_target].isAlive = FHE.asEbool(false);
            players[_target].isInGame = FHE.asEbool(false);
            currentGameState.playerCount = FHE.sub(currentGameState.playerCount, FHE.asEuint32(1));
            emit PlayerEliminated(_target);
        }

        emit PlayerAttacked(msg.sender, _target, _damage.decrypt());
    }

    // Spawn weapon at encrypted location
    function spawnWeapon(externalEuint32 _x, externalEuint32 _y, externalEuint8 _damage) public onlyOwner {
        weaponCounter++;
        weapons[weaponCounter] = Weapon({
            weaponId: FHE.asEuint32(uint32(weaponCounter)),
            xPosition: FHE.fromExternal(_x),
            yPosition: FHE.fromExternal(_y),
            damage: FHE.fromExternal(_damage),
            ammo: FHE.asEuint8(30),
            isCollected: FHE.asEbool(false)
        });

        emit WeaponSpawned(uint32(weaponCounter), _x.decrypt(), _y.decrypt());
    }

    // Collect weapon (simplified proximity check)
    function collectWeapon(uint256 _weaponId) public playerInGame playerAlive {
        require(_weaponId > 0 && _weaponId <= weaponCounter, "Invalid weapon ID");
        require(weapons[_weaponId].isCollected.decrypt() == false, "Weapon already collected");

        // Simple proximity check (in real implementation, this would be encrypted)
        uint32 playerX = players[msg.sender].xPosition.decrypt();
        uint32 playerY = players[msg.sender].yPosition.decrypt();
        uint32 weaponX = weapons[_weaponId].xPosition.decrypt();
        uint32 weaponY = weapons[_weaponId].yPosition.decrypt();

        // Check if player is within 5 units of weapon
        uint32 distanceX = playerX > weaponX ? playerX - weaponX : weaponX - playerX;
        uint32 distanceY = playerY > weaponY ? playerY - weaponY : weaponY - playerY;
        
        require(distanceX <= 5 && distanceY <= 5, "Too far from weapon");

        // Mark weapon as collected
        weapons[_weaponId].isCollected = FHE.asEbool(true);
        
        // Add weapon ammo to player
        euint8 currentAmmo = players[msg.sender].ammo;
        euint8 weaponAmmo = weapons[_weaponId].ammo;
        players[msg.sender].ammo = FHE.add(currentAmmo, weaponAmmo);

        emit WeaponCollected(msg.sender, uint32(_weaponId));
    }

    // Get encrypted player information
    function getPlayerInfo(address _playerAddress) public view returns (
        uint32 playerId,
        uint32 xPosition,
        uint32 yPosition,
        uint8 health,
        uint8 armor,
        uint8 ammo,
        bool isAlive,
        bool isInGame,
        uint256 joinTime
    ) {
        Player storage player = players[_playerAddress];
        return (
            player.playerId.decrypt(),
            player.xPosition.decrypt(),
            player.yPosition.decrypt(),
            player.health.decrypt(),
            player.armor.decrypt(),
            player.ammo.decrypt(),
            player.isAlive.decrypt(),
            player.isInGame.decrypt(),
            player.joinTime
        );
    }

    // Get encrypted game state
    function getGameState() public view returns (
        uint32 gameId,
        uint32 playerCount,
        bool isActive,
        uint32 arenaSize,
        uint256 startTime
    ) {
        return (
            currentGameState.gameId.decrypt(),
            currentGameState.playerCount.decrypt(),
            currentGameState.isActive.decrypt(),
            currentGameState.arenaSize.decrypt(),
            currentGameState.startTime
        );
    }

    // Get weapon information
    function getWeaponInfo(uint256 _weaponId) public view returns (
        uint32 weaponId,
        uint32 xPosition,
        uint32 yPosition,
        uint8 damage,
        uint8 ammo,
        bool isCollected
    ) {
        require(_weaponId > 0 && _weaponId <= weaponCounter, "Invalid weapon ID");
        Weapon storage weapon = weapons[_weaponId];
        return (
            weapon.weaponId.decrypt(),
            weapon.xPosition.decrypt(),
            weapon.yPosition.decrypt(),
            weapon.damage.decrypt(),
            weapon.ammo.decrypt(),
            weapon.isCollected.decrypt()
        );
    }

    // Admin functions
    function setGameActive(bool _isActive) public onlyOwner {
        currentGameState.isActive = FHE.asEbool(_isActive);
        emit GameStateUpdated(
            currentGameState.gameId.decrypt(),
            currentGameState.playerCount.decrypt(),
            _isActive
        );
    }

    function resetGame() public onlyOwner {
        playerCounter = 0;
        weaponCounter = 0;
        currentGameState.playerCount = FHE.asEuint32(0);
        currentGameState.startTime = block.timestamp;
    }

    // Emergency functions
    function emergencyWithdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
}
