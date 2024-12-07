import React, { useState } from 'react';

const TicketSaleApp = ({ contract }) => {
    const [ticketId, setTicketId] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [offerDetails, setOfferDetails] = useState('');
    const [message, setMessage] = useState('');
    const [action, setAction] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const getCurrentAccount = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts[0];
    };

    const handlePurchase = async () => {
        if (!ticketId) {
            setMessage('Please enter a ticket ID.');
            return;
        }

        setLoading(true);
        try {
            const account = await getCurrentAccount();
            await contract.methods.purchaseTicket(ticketId).send({ from: account });
            setMessage('Ticket purchased successfully!');
            setTicketId(''); // Reset the ticket ID after purchase
        } catch (error) {
            setMessage('Purchase failed: ' + error.message);
        }
        setLoading(false);
    };

    const handleOffer = async () => {
        if (!ticketId) {
            setMessage('Please enter a ticket ID.');
            return;
        }

        setLoading(true);
        try {
            const account = await getCurrentAccount();
            await contract.methods.offerSwap(ticketId).send({ from: account });
            setMessage('Offer is pending...');
            setTicketId(''); // Reset after offering
        } catch (error) {
            setMessage('Failed to offer swap: ' + error.message);
        }
        setLoading(false);
    };

    const handleAccept = async () => {
        if (!offerDetails) {
            setMessage('Please enter a ticket ID or address.');
            return;
        }

        setLoading(true);
        try {
            const account = await getCurrentAccount();
            await contract.methods.acceptOffer(offerDetails).send({ from: account });
            setMessage('Offer accepted successfully!');
            setOfferDetails(''); // Reset after accepting
        } catch (error) {
            setMessage('Failed to accept offer: ' + error.message);
        }
        setLoading(false);
    };

    const handleGetTicketNumber = async () => {
        setLoading(true);
        try {
            const ticket = await contract.methods.getTicketNumber(walletAddress).call();
            setMessage(`Ticket ID: ${ticket}`);
            setWalletAddress(''); // Reset wallet address after fetching
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
        setLoading(false);
    };

    const handleReturn = async () => {
        if (!ticketId) {
            setMessage('Please enter a ticket ID.');
            return;
        }

        setLoading(true);
        try {
            const account = await getCurrentAccount();
            await contract.methods.returnTicket(ticketId).send({ from: account });
            setMessage('Ticket returned successfully!');
            setTicketId(''); // Reset after return
        } catch (error) {
            setMessage('Return failed: ' + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="App">
            <h1>Ticket Sale</h1>
            
            {/* Select action */}
            <div>
                <button onClick={() => setAction('purchase')}>Purchase Ticket</button>
                <button onClick={() => setAction('offer')}>Offer Swap</button>
                <button onClick={() => setAction('accept')}>Accept Offer</button>
                <button onClick={() => setAction('getTicket')}>Get Ticket Number</button>
                <button onClick={() => setAction('return')}>Return Ticket</button>
            </div>

            {/* Show relevant form based on selected action */}
            {action === 'purchase' && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter ticket ID"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                    />
                    <button onClick={handlePurchase} disabled={loading}>
                        {loading ? 'Processing...' : 'Purchase Ticket'}
                    </button>
                </div>
            )}

            {action === 'offer' && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter ticket ID for swap"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                    />
                    <button onClick={handleOffer} disabled={loading}>
                        {loading ? 'Processing...' : 'Offer Swap'}
                    </button>
                </div>
            )}

            {action === 'accept' && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter ticket ID or address"
                        value={offerDetails}
                        onChange={(e) => setOfferDetails(e.target.value)}
                    />
                    <button onClick={handleAccept} disabled={loading}>
                        {loading ? 'Processing...' : 'Accept Offer'}
                    </button>
                </div>
            )}

            {action === 'getTicket' && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter wallet address"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                    />
                    <button onClick={handleGetTicketNumber} disabled={loading}>
                        {loading ? 'Fetching...' : 'Get Ticket ID'}
                    </button>
                </div>
            )}

            {action === 'return' && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter ticket ID"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                    />
                    <button onClick={handleReturn} disabled={loading}>
                        {loading ? 'Processing...' : 'Return Ticket'}
                    </button>
                </div>
            )}

            {/* Display messages */}
            <p>{message}</p>
        </div>
    );
};

export default TicketSaleApp;
