const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting Shadow Arena contract deployment...");

  // Get the contract factory
  const ShadowArena = await ethers.getContractFactory("ShadowArena");

  // Deploy the contract
  console.log("📦 Deploying ShadowArena contract...");
  const shadowArena = await ShadowArena.deploy();

  // Wait for deployment to complete
  await shadowArena.waitForDeployment();

  const contractAddress = await shadowArena.getAddress();
  console.log("✅ ShadowArena deployed to:", contractAddress);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const owner = await shadowArena.owner();
  console.log("👤 Contract owner:", owner);

  // Get initial game state
  const gameState = await shadowArena.getGameState();
  console.log("🎮 Initial game state:", {
    gameId: gameState[0].toString(),
    playerCount: gameState[1].toString(),
    isActive: gameState[2],
    arenaSize: gameState[3].toString(),
    startTime: gameState[4].toString()
  });

  console.log("\n📋 Deployment Summary:");
  console.log("=====================");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.config.chainId}`);
  console.log(`Owner: ${owner}`);

  console.log("\n🔧 Next Steps:");
  console.log("1. Update the contract address in your frontend");
  console.log("2. Verify the contract on block explorer");
  console.log("3. Test the contract functions");
  console.log("4. Deploy to production network");

  // Save deployment info to file
  const deploymentInfo = {
    contractAddress,
    network: network.name,
    chainId: network.config.chainId,
    owner,
    deploymentTime: new Date().toISOString(),
    gameState: {
      gameId: gameState[0].toString(),
      playerCount: gameState[1].toString(),
      isActive: gameState[2],
      arenaSize: gameState[3].toString(),
      startTime: gameState[4].toString()
    }
  };

  const fs = require('fs');
  const path = require('path');
  
  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${network.name}-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  return contractAddress;
}

// Handle errors
main()
  .then((contractAddress) => {
    console.log(`\n🎉 Deployment completed successfully!`);
    console.log(`Contract Address: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
