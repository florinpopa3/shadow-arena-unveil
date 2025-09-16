import { useState, useEffect, useCallback } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import { FHEClient } from '@fhevm/fhevmjs';
import { BrowserProvider } from 'ethers';

// Contract ABI for ShadowArena with FHE
const SHADOW_ARENA_ABI = parseAbi([
  'function joinArena(externalEuint32 _xPosition, externalEuint32 _yPosition) public',
  'function movePlayer(externalEuint32 _newX, externalEuint32 _newY) public',
  'function attackPlayer(address _target, externalEuint8 _damage) public',
  'function collectWeapon(uint256 _weaponId) public',
  'function getPlayerInfo(address _playerAddress) public view returns (uint32 playerId, uint32 xPosition, uint32 yPosition, uint8 health, uint8 armor, uint8 ammo, bool isAlive, bool isInGame, uint256 joinTime)',
  'function getGameState() public view returns (uint32 gameId, uint32 playerCount, bool isActive, uint32 arenaSize, uint256 startTime)',
  'function getWeaponInfo(uint256 _weaponId) public view returns (uint32 weaponId, uint32 xPosition, uint32 yPosition, uint8 damage, uint8 ammo, bool isCollected)',
  'function setGameActive(bool _isActive) public',
  'function resetGame() public',
  'event PlayerJoined(address indexed playerAddress, uint32 playerId, uint32 x, uint32 y)',
  'event PlayerMoved(address indexed playerAddress, uint32 x, uint32 y)',
  'event PlayerAttacked(address indexed attacker, address indexed target, uint8 damage)',
  'event PlayerEliminated(address indexed playerAddress)',
  'event WeaponSpawned(uint32 weaponId, uint32 x, uint32 y)',
  'event WeaponCollected(address indexed player, uint32 weaponId)',
  'event GameStateUpdated(uint32 gameId, uint32 playerCount, bool isActive)'
]);

// Contract address from environment variables
const SHADOW_ARENA_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

interface PlayerInfo {
  playerId: number;
  xPosition: number;
  yPosition: number;
  health: number;
  armor: number;
  ammo: number;
  isAlive: boolean;
  isInGame: boolean;
  joinTime: number;
}

interface GameState {
  gameId: number;
  playerCount: number;
  isActive: boolean;
  arenaSize: number;
  startTime: number;
}

interface WeaponInfo {
  weaponId: number;
  xPosition: number;
  yPosition: number;
  damage: number;
  ammo: number;
  isCollected: boolean;
}

export const useShadowArena = () => {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [fheClient, setFheClient] = useState<FHEClient | null>(null);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [weapons, setWeapons] = useState<WeaponInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize FHEClient
  useEffect(() => {
    const initFHEClient = async () => {
      if (window.ethereum && isConnected) {
        try {
          const provider = new BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          const chainId = Number(network.chainId);
          
          const client = await FHEClient.create({
            chainId,
            provider,
          });
          
          setFheClient(client);
          console.log('FHE Client initialized successfully');
        } catch (err) {
          console.error('Failed to initialize FHE client:', err);
          setError('Failed to initialize FHE client');
        }
      }
    };
    
    initFHEClient();
  }, [isConnected]);

  // Read player info
  const { data: rawPlayerInfo, refetch: refetchPlayerInfo } = useReadContract({
    abi: SHADOW_ARENA_ABI,
    address: SHADOW_ARENA_CONTRACT_ADDRESS,
    functionName: 'getPlayerInfo',
    args: [address!],
    query: {
      enabled: isConnected && !!address && SHADOW_ARENA_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      select: (data: any) => ({
        playerId: Number(data[0]),
        xPosition: Number(data[1]),
        yPosition: Number(data[2]),
        health: Number(data[3]),
        armor: Number(data[4]),
        ammo: Number(data[5]),
        isAlive: data[6],
        isInGame: data[7],
        joinTime: Number(data[8]),
      }),
    },
  });

  useEffect(() => {
    if (rawPlayerInfo) {
      setPlayerInfo(rawPlayerInfo);
    }
  }, [rawPlayerInfo]);

  // Read game state
  const { data: rawGameState, refetch: refetchGameState } = useReadContract({
    abi: SHADOW_ARENA_ABI,
    address: SHADOW_ARENA_CONTRACT_ADDRESS,
    functionName: 'getGameState',
    query: {
      enabled: isConnected && SHADOW_ARENA_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000',
      select: (data: any) => ({
        gameId: Number(data[0]),
        playerCount: Number(data[1]),
        isActive: data[2],
        arenaSize: Number(data[3]),
        startTime: Number(data[4]),
      }),
    },
  });

  useEffect(() => {
    if (rawGameState) {
      setGameState(rawGameState);
    }
  }, [rawGameState]);

  // Join Arena with encrypted coordinates
  const { data: joinHash, writeContract: joinArenaContract, isPending: isJoining } = useWriteContract();
  const { isLoading: isJoiningConfirming, isSuccess: isJoiningSuccess } = useWaitForTransactionReceipt({ hash: joinHash });

  const handleJoinArena = useCallback(async (x: number, y: number) => {
    if (!fheClient || !isConnected || !address) {
      throw new Error("FHE Client not initialized or wallet not connected");
    }
    
    if (SHADOW_ARENA_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error("Contract not deployed. Please deploy the contract first.");
    }

    try {
      setIsLoading(true);
      setError(null);

      // Encrypt coordinates using FHE
      const encryptedX = await fheClient.encrypt(x);
      const encryptedY = await fheClient.encrypt(y);

      await writeContractAsync({
        address: SHADOW_ARENA_CONTRACT_ADDRESS,
        abi: SHADOW_ARENA_ABI,
        functionName: 'joinArena',
        args: [encryptedX, encryptedY],
      });

      // Refetch data after successful transaction
      setTimeout(() => {
        refetchPlayerInfo();
        refetchGameState();
      }, 2000);

    } catch (error: any) {
      console.error("Error joining arena:", error);
      setError(error.message || "Failed to join arena");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fheClient, isConnected, address, writeContractAsync, refetchPlayerInfo, refetchGameState]);

  // Move Player with encrypted coordinates
  const { data: moveHash, writeContract: movePlayerContract, isPending: isMoving } = useWriteContract();
  const { isLoading: isMovingConfirming, isSuccess: isMovingSuccess } = useWaitForTransactionReceipt({ hash: moveHash });

  const handleMovePlayer = useCallback(async (newX: number, newY: number) => {
    if (!fheClient || !isConnected || !address) {
      throw new Error("FHE Client not initialized or wallet not connected");
    }

    try {
      setIsLoading(true);
      setError(null);

      // Encrypt new coordinates using FHE
      const encryptedX = await fheClient.encrypt(newX);
      const encryptedY = await fheClient.encrypt(newY);

      await writeContractAsync({
        address: SHADOW_ARENA_CONTRACT_ADDRESS,
        abi: SHADOW_ARENA_ABI,
        functionName: 'movePlayer',
        args: [encryptedX, encryptedY],
      });

      // Refetch player info after successful transaction
      setTimeout(() => {
        refetchPlayerInfo();
      }, 2000);

    } catch (error: any) {
      console.error("Error moving player:", error);
      setError(error.message || "Failed to move player");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fheClient, isConnected, address, writeContractAsync, refetchPlayerInfo]);

  // Attack Player with encrypted damage
  const { data: attackHash, writeContract: attackPlayerContract, isPending: isAttacking } = useWriteContract();
  const { isLoading: isAttackingConfirming, isSuccess: isAttackingSuccess } = useWaitForTransactionReceipt({ hash: attackHash });

  const handleAttackPlayer = useCallback(async (target: string, damage: number) => {
    if (!fheClient || !isConnected || !address) {
      throw new Error("FHE Client not initialized or wallet not connected");
    }

    try {
      setIsLoading(true);
      setError(null);

      // Encrypt damage using FHE
      const encryptedDamage = await fheClient.encrypt(damage);

      await writeContractAsync({
        address: SHADOW_ARENA_CONTRACT_ADDRESS,
        abi: SHADOW_ARENA_ABI,
        functionName: 'attackPlayer',
        args: [target, encryptedDamage],
      });

      // Refetch data after successful transaction
      setTimeout(() => {
        refetchPlayerInfo();
        refetchGameState();
      }, 2000);

    } catch (error: any) {
      console.error("Error attacking player:", error);
      setError(error.message || "Failed to attack player");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fheClient, isConnected, address, writeContractAsync, refetchPlayerInfo, refetchGameState]);

  // Collect Weapon
  const { data: collectHash, writeContract: collectWeaponContract, isPending: isCollecting } = useWriteContract();
  const { isLoading: isCollectingConfirming, isSuccess: isCollectingSuccess } = useWaitForTransactionReceipt({ hash: collectHash });

  const handleCollectWeapon = useCallback(async (weaponId: number) => {
    if (!isConnected || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      setIsLoading(true);
      setError(null);

      await writeContractAsync({
        address: SHADOW_ARENA_CONTRACT_ADDRESS,
        abi: SHADOW_ARENA_ABI,
        functionName: 'collectWeapon',
        args: [BigInt(weaponId)],
      });

      // Refetch player info after successful transaction
      setTimeout(() => {
        refetchPlayerInfo();
      }, 2000);

    } catch (error: any) {
      console.error("Error collecting weapon:", error);
      setError(error.message || "Failed to collect weapon");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, writeContractAsync, refetchPlayerInfo]);

  // Get weapon info
  const getWeaponInfo = useCallback(async (weaponId: number) => {
    if (!isConnected) return null;

    try {
      // This would need to be implemented with a contract read
      // For now, return mock data
      return {
        weaponId,
        xPosition: Math.floor(Math.random() * 1000),
        yPosition: Math.floor(Math.random() * 1000),
        damage: 25,
        ammo: 30,
        isCollected: false,
      };
    } catch (error) {
      console.error("Error getting weapon info:", error);
      return null;
    }
  }, [isConnected]);

  return {
    // State
    playerInfo,
    gameState,
    weapons,
    fheClient,
    isLoading: isLoading || isJoining || isJoiningConfirming || isMoving || isMovingConfirming || isAttacking || isAttackingConfirming || isCollecting || isCollectingConfirming,
    error,
    
    // Actions
    handleJoinArena,
    handleMovePlayer,
    handleAttackPlayer,
    handleCollectWeapon,
    getWeaponInfo,
    
    // Utilities
    refetchPlayerInfo,
    refetchGameState,
    
    // Status
    isJoining: isJoining || isJoiningConfirming,
    isMoving: isMoving || isMovingConfirming,
    isAttacking: isAttacking || isAttackingConfirming,
    isCollecting: isCollecting || isCollectingConfirming,
    
    // Success states
    isJoiningSuccess,
    isMovingSuccess,
    isAttackingSuccess,
    isCollectingSuccess,
  };
};