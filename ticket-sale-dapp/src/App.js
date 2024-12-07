// src/App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TicketSaleApp from './Ticketsaleapp';
import YourContract from './YourContract.js'; // Import the TicketSaleApp component

const App = () => {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null); // For capturing any error messages

    useEffect(() => {
        const loadWeb3 = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    setWeb3(web3Instance);
                    console.log('Web3 initialized');
                    // Requesting accounts
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccounts(accounts);
                    console.log('Accounts:', accounts);
                } else {
                    setError('Please install MetaMask!');
                    console.error('MetaMask not installed');
                }
            } catch (err) {
                setError('Error connecting to MetaMask: ' + err.message);
                console.error('MetaMask connection error:', err);
            }
        };

        const loadContract = async () => {
            try {
                if (!web3) {
                    console.log('Web3 is not initialized yet');
                    return;
                }

                console.log('Web3 is initialized, loading contract...');
                const networkId = await web3.eth.net.getId();
                console.log('Network ID:', networkId);

                // Check if contract is deployed on the network
                const deployedNetwork = YourContract.networks[networkId];
                if (!deployedNetwork) {
                    setError('Contract not deployed on this network');
                    console.error('Contract not deployed on network:', networkId);
                    return;
                }

                console.log('Contract found on this network at address:', deployedNetwork.address);
                const contractInstance = new web3.eth.Contract(
                    YourContract.abi,
                    deployedNetwork.address
                );
                setContract(contractInstance);
                console.log('Contract loaded:', contractInstance);
            } catch (err) {
                setError('Error loading contract: ' + err.message);
                console.error('Contract loading error:', err);
            }
        };

        loadWeb3();
        if (web3) loadContract();
    }, [web3]);

    return (
        <div className="App">
            <h1>Welcome to the Ticket Sale App</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {contract ? (
                <TicketSaleApp contract={contract} accounts={accounts} />
            ) : (
                <p>Loading contract...</p>
            )}
        </div>
    );
};

export default App;
