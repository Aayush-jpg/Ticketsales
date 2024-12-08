import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

const CONTRACT_ADDRESS = '0x7b96aF9Bd211cBf6BA5b0dd53aa61Dc5806b6AcE'; 
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			}
		],
		"name": "acceptSwap",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			}
		],
		"name": "offerSwap",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "purchaseTicket",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			}
		],
		"name": "returnTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "purchaser",
				"type": "address"
			}
		],
		"name": "TicketPurchased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "returner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "refundAmount",
				"type": "uint256"
			}
		],
		"name": "TicketReturned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "acceptor",
				"type": "address"
			}
		],
		"name": "TicketSwapAccepted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "offerer",
				"type": "address"
			}
		],
		"name": "TicketSwapOffered",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getTicketByAddress",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ticketID",
				"type": "uint256"
			}
		],
		"name": "getTicketInfo",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
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
		"name": "serviceFee",
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
		"name": "ticketCounter",
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
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tickets",
		"outputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "isPurchased",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isSwapPending",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [swapTicketId, setSwapTicketId] = useState('');
  const [acceptSwapId, setAcceptSwapId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [userTicketIds, setUserTicketIds] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          
          setWeb3(web3Instance);
          setContract(contractInstance);
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask', error);
        }
      }
    };

    initWeb3();
  }, []);

  const buyTicket = async () => {
    try {
      await contract.methods.purchaseTicket().send({
        from: account,
        value: web3.utils.toWei('0.000001', 'ether')  
      });

      const randomTicketId = Math.floor(Math.random() * 1000000);
      console.log('Generated Ticket ID:', randomTicketId);
      alert(`Ticket purchased successfully! Your Ticket ID is: ${randomTicketId}`);
      setTicketId(randomTicketId);
    } catch (error) {
      console.error('Error buying ticket:', error);
      alert('Error buying ticket: ' + error.message);
    }
  };

  const offerSwap = async () => {
    try {
      await contract.methods.offerSwap(swapTicketId).send({
        from: account
      });
      alert('Swap offer made successfully!');
    } catch (error) {
      console.error('Error offering swap:', error);
      alert('Error offering swap: ' + error.message);
    }
  };

  const acceptSwap = async () => {
    try {
      await contract.methods.acceptSwap(acceptSwapId).send({
        from: account
      });
      alert('Swap accepted successfully!');
    } catch (error) {
      console.error('Error accepting swap:', error);
      alert('Error accepting swap: ' + error.message);
    }
  };

  const returnTicket = async () => {
    try {
      await contract.methods.returnTicket(ticketId).send({
        from: account
      });
      alert('Ticket returned successfully!');
    } catch (error) {
      console.error('Error returning ticket:', error);
      alert('Error returning ticket: ' + error.message);
    }
  };

  const fetchTicketByAddress = async () => {
  if (!contract) {
    alert('Contract is not initialized.');
    return;
  }
  if (!walletAddress || !web3.utils.isAddress(walletAddress)) {
    alert('Please enter a valid wallet address.');
    return;
  }
  try {
    console.log('Fetching tickets for wallet address:', walletAddress);
    const ticketIds = await contract.methods.getTicketByAddress(walletAddress).call();
    console.log('Fetched ticket IDs:', ticketIds);

    if (ticketIds.length === 0) {
      alert('No tickets found for this wallet address.');
    } else {
      setUserTicketIds(ticketIds);
    }
  } catch (error) {
    console.error('Error fetching tickets:', error);
    alert('Error fetching tickets: ' + error.message);
  }
};

  
  

  return (
    <div className="App">
      <h1>Ticket Sale DApp</h1>
      <p>Account: {account}</p>

      <div>
        <h2>Buy Ticket</h2>
        <button onClick={buyTicket}>Buy Ticket (0.000001 Ether)</button>
      </div>

      <div>
        <h2>Offer Swap</h2>
        <input
          type="number"
          placeholder="Ticket ID to offer swap"
          value={swapTicketId}
          onChange={(e) => setSwapTicketId(e.target.value)}
        />
        <button onClick={offerSwap}>Offer Swap</button>
      </div>

      <div>
        <h2>Accept Swap</h2>
        <input
          type="number"
          placeholder="Ticket ID to accept swap"
          value={acceptSwapId}
          onChange={(e) => setAcceptSwapId(e.target.value)}
        />
        <button onClick={acceptSwap}>Accept Swap</button>
      </div>

      <div>
        <h2>Return Ticket</h2>
        <input
          type="number"
          placeholder="Ticket ID to return"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        />
        <button onClick={returnTicket}>Return Ticket</button>
      </div>

      <div>
        <h2>View Tickets by Wallet Address</h2>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <button onClick={fetchTicketByAddress}>View Tickets</button>
      </div>

      <div>
        <h3>Your Tickets:</h3>
        {userTicketIds.length > 0 ? (
          <ul>
            {userTicketIds.map((ticketId, index) => (
              <li key={index}>Ticket ID: {ticketId}</li>
            ))}
          </ul>
        ) : (
          <p>No tickets found for this address.</p>
        )}
      </div>
    </div>
  );
}

export default App;
