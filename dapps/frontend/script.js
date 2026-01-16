const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const studentNameEl = document.getElementById("student-name");
const studentNimEl = document.getElementById("student-nim");

// Data Mahasiswa
const STUDENT_NAME = "Dimas Febrianto Wicaksono";
const STUDENT_NIM = "251011401392";

// Avalanche Fuji Testnet Chain ID (HEX)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

// Format balance dari wei ke AVAX
function formatAvaxBalance(balanceHex) {
  const balance = BigInt(balanceHex);
  return Number(balance) / 1e18;
}

// Shorten Address
function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet / MetaMask tidak terdeteksi!");
    return;
  }
  console.log('window.ethereum', window.ethereum);

  try {
    statusEl.textContent = "Connecting...";
    connectBtn.disabled = true;
    connectBtn.textContent = "Connecting...";

    // Request akun
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    addressEl.textContent = shortenAddress(address);
    // Tampilkan Nama & NIM
    studentNameEl.textContent = STUDENT_NAME;
    studentNimEl.textContent = STUDENT_NIM;

    // Ambil chainId
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId !== AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Wrong Network ❌";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "red";
      return;
    }

    networkEl.textContent = "Avalanche Fuji Testnet";
    statusEl.textContent = "Connected ✅";
    statusEl.style.color = "#22c55e";

    // Disable connect button
    connectBtn.disabled = true;
    connectBtn.textContent = "Wallet Connected";

    // Ambil balance
    const balance = await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });

    balanceEl.textContent = formatAvaxBalance(balance).toFixed(4);

  } catch (error) {
    console.error(error);
    statusEl.textContent = "Connection Failed ❌";
    statusEl.style.color = "red";
    connectBtn.disabled = false;
    connectBtn.textContent = "Connect Wallet";
  }
}

// Event
connectBtn.addEventListener("click", connectWallet);

// Auto update jika account / network berubah
if (window.ethereum) {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      connectWallet();
    } else {
      statusEl.textContent = "Not Connected";
      statusEl.style.color = "initial";
      addressEl.textContent = "-";
      networkEl.textContent = "-";
      balanceEl.textContent = "-";
      studentNameEl.textContent = "-";
      studentNimEl.textContent = "-";
      connectBtn.disabled = false;
      connectBtn.textContent = "Connect Wallet";
    }
  });

  window.ethereum.on("chainChanged", () => {
    connectWallet();
  });
}
