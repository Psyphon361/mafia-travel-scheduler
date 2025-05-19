# 🚀 Mafia Travel Scheduler: Automate Your DeFi Game Travel on PulseChain and BNB Chain 🌟

Welcome to the **Mafia Travel Scheduler**! This project automates calling the `travel` function on a DeFi game smart contract on **PulseChain** and **BNB Chain**, enabling to-and-fro travel between two cities with configurable travel types. Whether you're a tech newbie or a seasoned developer, this guide will walk you through setup on **Windows**, **Linux**, or **macOS**. Let’s dive in! 🏁

---

## 📜 What This Project Does

This project:
- 🌍 Automates to-and-fro travel between two cities (`START_CITY` and `END_CITY`) on PulseChain, BNB Chain, or both.
- 🚂 Supports different travel types (TRAIN: 4h 5m, CAR/MOTORCYCLE: 2h 5m, AIRPLANE: 1h 5m) with 5m buffer times.
- 🔒 Keeps your private keys secure using Foundry’s encrypted keystore.
- 🖥️ Works on Windows (via WSL), Linux, and macOS.

---

## 🛠️ Prerequisites: Install Required Tools

### 1️⃣ Install Git

#### Windows
Follow Linux steps on WSL if not installed by default (WSL install guide in Section #3)

#### Linux
1. Open a terminal (Ctrl+Alt+T on Ubuntu).
2. Install: `sudo apt update && sudo apt install git`
3. Verify: `git --version`

#### macOS
1. Open a terminal.
2. Install: `brew install git` (or via Homebrew if needed)
3. Verify: `git --version`

##### Installing Homebrew (if needed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

### 2️⃣ Install Node.js

#### Windows
Follow Linux steps on WSL if not installed by default (WSL install guide in Section #3)

#### Linux
1. Install: `sudo apt update && sudo apt install nodejs npm`
2. Verify: `node -v && npm -v`

#### macOS
1. Install: `brew install node`
2. Verify: `node -v && npm -v`

---

### 3️⃣ Install Foundry

#### Windows: Set Up WSL First
1. Enable WSL: **Control Panel > Programs > Turn Windows features on or off > Windows Subsystem for Linux**
2. Install: `wsl --install`
3. Open Ubuntu terminal, install Foundry:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```
4. Verify: `forge --version && cast --version`

#### Linux
1. Install:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```
2. Verify: `forge --version && cast --version`

#### macOS
1. Install:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```
2. Verify: `forge --version && cast --version`

---

### 4️⃣ Install pm2 (Optional but Recommended)

#### Windows (in WSL), Linux, and macOS
1. Install: `npm install -g pm2`
2. Verify: `pm2 --version`

---

## 👜 Clone the Project

1. Clone the Repository:
   ```bash
   git clone --recurse-submodules https://github.com/Psyphon361/mafia-travel-scheduler.git
   ```
2. Navigate to the Directory:
   ```bash
   cd mafia-travel-scheduler
   ```

---

## 🛠️ Set Up the Project

### 1️⃣ Install Node.js Dependencies
```bash
npm install
```

### 2️⃣ Install Foundry Dependencies
1. Navigate to the submodule:
   ```bash
   cd foundry-crime-scripts
   ```
2. Install: `forge install`
3. Return: `cd ..`

---

## 🔐 Secure Your Private Keys with Foundry’s Keystore

### Steps to Encrypt Your Private Key
#### Import Your PulseChain Private Key:
```bash
cast wallet import <KEYSTORE_NAME> --interactive
```
Enter your private key and a strong password.

#### Import Your BNB Chain Private Key:
```bash
cast wallet import <BNB_KEYSTORE_NAME> --interactive
```
Repeat if using a different key for BNB Chain.

---

## 📝 Create the `.env` File

### Create the File:
```bash
nano .env
```

### Add the Following Content:
Provide variables based on `CHAIN_CHOICE`:
```text
# RPC URLs (defaults provided)
PLS_RPC_URL=https://rpc-pulsechain.g4mm4.io
BNB_RPC_URL=https://bsc-dataseed.bnbchain.org

# Required for CHAIN_CHOICE 0 or 2
PLS_KEYSTORE_NAME=<your-comma-separated-pls-keystore-name>
PLS_KEYSTORE_PASSWORD=<your-comma-separated-pls-keystore-password>
PLS_ITEM_IDS=<comma-separated-item-ids>
PLS_START_CITY=<comma-separated-start-cities>
PLS_END_CITY=<comma-separated-end-cities>
PLS_TRAVEL_TYPE=<comma-separated-travel-types>  # 0 -> TRAIN, 1 -> CAR/MOTORCYCLE, 2 -> AIRPLANE

# Required for CHAIN_CHOICE 1 or 2
BNB_KEYSTORE_NAME=<your-comma-separated-bnb-keystore-name>
BNB_KEYSTORE_PASSWORD=<your-comma-separated-bnb-keystore-password>
BNB_ITEM_IDS=<comma-separated-item-ids>
BNB_START_CITY=<comma-separated-start-cities>
BNB_END_CITY=<comma-separated-end-cities>
BNB_TRAVEL_TYPE=<comma-separated-travel-types>  # 0 -> TRAIN, 1 -> CAR/MOTORCYCLE, 2 -> AIRPLANE

# Chain choice (required)
CHAIN_CHOICE=2  # 0 -> PLS, 1 -> BNB, 2 -> BOTH

# CITY MAPPING: 0 -> CHICAGO, 1 -> DETROIT, 2 -> NEW YORK, 3 -> MIAMI, 4 -> LAS VEGAS, 5 -> MEDELLIN, 6 -> BOGOTA, 7 -> CARACAS, 8 -> PALERMO, 9 -> MESSINA, 10 -> NAPOLI
```

### Explanation:
- `PLS_KEYSTORE_NAME`, `PLS_KEYSTORE_PASSWORD`, `PLS_ITEM_IDS`, `PLS_START_CITY`, `PLS_END_CITY`, `PLS_TRAVEL_TYPE`: Required if `CHAIN_CHOICE` is 0 or 2.
- `BNB_KEYSTORE_NAME`, `BNB_KEYSTORE_PASSWORD`, `BNB_ITEM_IDS`, `BNB_START_CITY`, `BNB_END_CITY`, `BNB_TRAVEL_TYPE`: Required if `CHAIN_CHOICE` is 1 or 2.
- `TRAVEL_TYPE`: Determines scheduling (0: 4h 5m, 1: 2h 5m, 2: 1h 5m).
- Comma-separated values must match the number of keystore names.

### Example
#### For CHAIN_CHOICE=1 (BNB only):
```plaintext
PLS_RPC_URL=https://rpc-pulsechain.g4mm4.io
BNB_RPC_URL=https://bsc-dataseed.bnbchain.org
PLS_KEYSTORE_NAME=LAURENTIS,VALENTINI
BNB_KEYSTORE_NAME=LAURENTIS,VALENTINI
PLS_KEYSTORE_PASSWORD=laurentis,valentini
BNB_KEYSTORE_PASSWORD=laurentis,valentini
PLS_ITEM_IDS=23350,24509
BNB_ITEM_IDS=281,2087
PLS_START_CITY=8,4
BNB_START_CITY=8,0
PLS_END_CITY=10,5
BNB_END_CITY=9,1 
CHAIN_CHOICE=2  # 0 -> PLS, 1 -> BNB, 2 -> BOTH
PLS_TRAVEL_TYPE=2,1 # 0 -> TRAIN, 1 -> CAR/MOTORCYCLE, 2 -> AIRPLANE
BNB_TRAVEL_TYPE=1,2  # 0 -> TRAIN, 1 -> CAR/MOTORCYCLE, 2 -> AIRPLANE
```

---

## 🚀 Run the Project

### 1️⃣ Test the Script
```bash
node run-travel-script.js
```

Logs example:
```text
Starting scheduler at 2025-05-19T19:40:00.000Z
BNB travel to city 8 (travelType: 1, itemId: 281) executed successfully for LAURENTIS
BNB next travel for LAURENTIS to city 9 scheduled for 2025-05-19T21:45:00.000Z (in 125 minutes)
```

### 2️⃣ Run in the Background with pm2
```bash
pm2 start run-travel-script.js
pm2 save
pm2 logs run-travel-script
```

### 3️⃣ Updating Configuration
Restart pm2 after changes:
```bash
pm2 restart run-travel-script
```

### 4️⃣ Updating the Submodule
```bash
cd foundry-crime-scripts
git pull origin main
cd ..
pm2 restart run-travel-script
```

---

## 🔒 Best Security Practices

### 1️⃣ Protect Your Private Keys
- **Never Share Your Private Key**
- Use `cast wallet import` for encryption.
- Choose a strong password (12+ characters).
- Store passwords securely (e.g., password manager).

### 2️⃣ Secure Your `.env` File
- Don’t commit to Git (already in `.gitignore`).
- Restrict permissions: `chmod 600 .env` (Linux/macOS)
- Backup securely.

### 3️⃣ General Security Tips
- Keep your system secure (antivirus, firewall).
- Use a dedicated wallet with small funds.
- Monitor logs: `pm2 logs run-travel-script`
- Update dependencies: `npm install -g npm && foundryup && npm install -g pm2`

---

## 🚧 Troubleshooting

### Error: "forge: command not found":
- Reinstall Foundry: `foundryup`

### Error: "node: command not found":
- Reinstall Node.js.

### Transaction Reverts:
- Check contract logic (e.g., cooldowns, jailing).

### Logs Not Showing:
- Check pm2: `pm2 list && pm2 logs run-travel-script`

### Submodule Not Found:
- Initialize: `git submodule update --init --recursive`

---

## 🎉 Congratulations!

You’ve set up the Mafia Travel Scheduler! Your script will now automate travel between cities on PulseChain, BNB Chain, or both. Happy traveling! 🚀

---

### ❤️ Made with Love

by [Tanish](https://github.com/Psyphon361) aka [Psyphon](https://pulsemafia.io/profile/psyphon)

### Disclaimer
This is an open-source project licensed under the **MIT License**.  
**I am not responsible for any financial losses or issues.** Do your own research (DYOR).

### Support This Project 🙏
Creating, testing, and maintaining this project takes time and effort. If it helps you, please consider a small donation to support ongoing development.

**Donation Address:** `0x44782f177962D7bb766B4853d3428A7b44802aA2`