const { exec } = require("child_process");
const util = require("util");
require("dotenv").config();

// Promisify exec for async/await
const execPromise = util.promisify(exec);

// Chain choice: 0 -> PLS, 1 -> BNB, 2 -> BOTH
const CHAIN_CHOICE = parseInt(process.env.CHAIN_CHOICE);

// Validate CHAIN_CHOICE
if (![0, 1, 2].includes(CHAIN_CHOICE)) {
  console.error("Error: CHAIN_CHOICE must be 0 (PLS), 1 (BNB), or 2 (BOTH).");
  process.exit(1);
}

// Read variables based on CHAIN_CHOICE
const plsKeystoreNames = CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2 ? (process.env.PLS_KEYSTORE_NAME ? process.env.PLS_KEYSTORE_NAME.split(",").map((name) => name.trim()) : []) : [];
const bnbKeystoreNames = CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2 ? (process.env.BNB_KEYSTORE_NAME ? process.env.BNB_KEYSTORE_NAME.split(",").map((name) => name.trim()) : []) : [];
const plsKeystorePasswords = CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2 ? (process.env.PLS_KEYSTORE_PASSWORD ? process.env.PLS_KEYSTORE_PASSWORD.split(",").map((pw) => pw.trim()) : []) : [];
const bnbKeystorePasswords = CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2 ? (process.env.BNB_KEYSTORE_PASSWORD ? process.env.BNB_KEYSTORE_PASSWORD.split(",").map((pw) => pw.trim()) : []) : [];

const plsItemIds = CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2 ? (process.env.PLS_ITEM_IDS ? process.env.PLS_ITEM_IDS.split(",").map((id) => parseInt(id.trim()) || 0) : []) : [];
const bnbItemIds = CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2 ? (process.env.BNB_ITEM_IDS ? process.env.BNB_ITEM_IDS.split(",").map((id) => parseInt(id.trim()) || 0) : []) : [];
const plsStartCities = CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2 ? (process.env.PLS_START_CITY ? process.env.PLS_START_CITY.split(",").map((city) => parseInt(city.trim()) || 0) : []) : [];
const bnbStartCities = CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2 ? (process.env.BNB_START_CITY ? process.env.BNB_START_CITY.split(",").map((city) => parseInt(city.trim()) || 0) : []) : [];
const plsEndCities = CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2 ? (process.env.PLS_END_CITY ? process.env.PLS_END_CITY.split(",").map((city) => parseInt(city.trim()) || 0) : []) : [];
const bnbEndCities = CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2 ? (process.env.BNB_END_CITY ? process.env.BNB_END_CITY.split(",").map((city) => parseInt(city.trim()) || 0) : []) : [];
const plsTravelTypes = CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2 ? (process.env.PLS_TRAVEL_TYPE ? process.env.PLS_TRAVEL_TYPE.split(",").map((type) => parseInt(type.trim()) || 0) : []) : [];
const bnbTravelTypes = CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2 ? (process.env.BNB_TRAVEL_TYPE ? process.env.BNB_TRAVEL_TYPE.split(",").map((type) => parseInt(type.trim()) || 0) : []) : [];

// Validate inputs
if (CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2) {
  if (plsKeystoreNames.length === 0) {
    console.error("Error: At least one PLS keystore name must be provided when CHAIN_CHOICE is 0 or 2.");
    process.exit(1);
  }
  if (
    plsKeystoreNames.length !== plsKeystorePasswords.length ||
    plsKeystoreNames.length !== plsItemIds.length ||
    plsKeystoreNames.length !== plsStartCities.length ||
    plsKeystoreNames.length !== plsEndCities.length ||
    plsKeystoreNames.length !== plsTravelTypes.length
  ) {
    console.error("Error: Number of PLS keystore names must match number of passwords, item IDs, cities, and travel types.");
    process.exit(1);
  }
}

if (CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2) {
  if (bnbKeystoreNames.length === 0) {
    console.error("Error: At least one BNB keystore name must be provided when CHAIN_CHOICE is 1 or 2.");
    process.exit(1);
  }
  if (
    bnbKeystoreNames.length !== bnbKeystorePasswords.length ||
    bnbKeystoreNames.length !== bnbItemIds.length ||
    bnbKeystoreNames.length !== bnbStartCities.length ||
    bnbKeystoreNames.length !== bnbEndCities.length ||
    bnbKeystoreNames.length !== bnbTravelTypes.length
  ) {
    console.error("Error: Number of BNB keystore names must match number of passwords, item IDs, cities, and travel types.");
    process.exit(1);
  }
}

// Chain configurations
const chains = {
  BNB: {
    rpcUrl: process.env.BNB_RPC_URL || "https://bsc-dataseed.bnbchain.org",
    script: "script/BNBTravel.s.sol:BNBTravel",
    keystoreNames: bnbKeystoreNames,
    keystorePasswords: bnbKeystorePasswords,
    itemIds: bnbItemIds,
    startCities: bnbStartCities,
    endCities: bnbEndCities,
    travelTypes: bnbTravelTypes,
  },
  PLS: {
    rpcUrl: process.env.PLS_RPC_URL || "https://rpc-pulsechain.g4mm4.io",
    script: "script/PLSTravel.s.sol:PLSTravel",
    keystoreNames: plsKeystoreNames,
    keystorePasswords: plsKeystorePasswords,
    itemIds: plsItemIds,
    startCities: plsStartCities,
    endCities: plsEndCities,
    travelTypes: plsTravelTypes,
  },
};

// Travel type to delay mapping (in hours, converted to milliseconds)
const travelDelays = {
  0: (4 * 60 + 5) * 60 * 1000, // TRAIN: 4 hours + 5 mins buffer
  1: (2 * 60 + 5) * 60 * 1000, // CAR/MOTORCYCLE: 2 hours + 5 mins buffer
  2: (1 * 60 + 5) * 60 * 1000, // AIRPLANE: 1 hour + 5 mins buffer
};

// Function to run travel for a single wallet
async function runTravel(chainName, keystoreName, keystorePassword, destinationCity, travelType, itemId) {
  try {
    const chain = chains[chainName];
    const command = `forge script ${chain.script} --rpc-url ${chain.rpcUrl} --broadcast --account ${keystoreName} --password ${keystorePassword} --sig "run(uint8,uint8,uint256)" ${destinationCity} ${travelType} ${itemId}`;

    const { stdout, stderr } = await execPromise(command, { cwd: "./foundry-travel-scripts" });
    console.log(`${chainName} travel to city ${destinationCity} (travelType: ${travelType}, itemId: ${itemId}) executed successfully for ${keystoreName}`);

    return { success: true };
  } catch (error) {
    console.error(`${chainName} travel failed for ${keystoreName}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Function to schedule travel for a single wallet with to-and-fro logic
function scheduleWallet(chainName, keystoreName, keystorePassword, itemId, startCity, endCity, travelType) {
  let isStartCity = true; // Start by traveling to startCity

  async function runAndReschedule() {
    const destinationCity = isStartCity ? startCity : endCity;
    const delay = travelDelays[travelType]; // Get delay based on travel type

    const result = await runTravel(chainName, keystoreName, keystorePassword, destinationCity, travelType, itemId);

    // Toggle between start and end cities
    isStartCity = !isStartCity;

    console.log(
      `${chainName} next travel for ${keystoreName} to city ${isStartCity ? startCity : endCity} scheduled for ${new Date(Date.now() + delay).toISOString()} (in ${delay / 1000 / 60} minutes)`
    );
    setTimeout(runAndReschedule, delay);
  }

  runAndReschedule();
}

// Function to start scheduling for all wallets on a chain
function startChainScheduling(chainName) {
  const chain = chains[chainName];

  for (let i = 0; i < chain.keystoreNames.length; i++) {
    scheduleWallet(chainName, chain.keystoreNames[i], chain.keystorePasswords[i], chain.itemIds[i], chain.startCities[i], chain.endCities[i], chain.travelTypes[i]);
  }
}

// Main function to start scheduling based on CHAIN_CHOICE
function startScheduler() {
  console.log(`Starting scheduler at ${new Date().toISOString()}`);

  if (CHAIN_CHOICE === 0 || CHAIN_CHOICE === 2) {
    startChainScheduling("PLS");
  }
  if (CHAIN_CHOICE === 1 || CHAIN_CHOICE === 2) {
    startChainScheduling("BNB");
  }
}

// Start the scheduler
startScheduler();
