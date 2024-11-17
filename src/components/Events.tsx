import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { createKintoSDK, KintoAccountInfo } from 'kinto-web-sdk';
import {
  defineChain, getContract, createPublicClient, encodeFunctionData, Address, http
} from 'viem';
import {abi} from '../../smart-contract/abi';
import { connect } from 'http2';

// Smart Contract Configurations
const contractABI = abi;
const contractAddress = '0x04b4AA5A55fD666c588fe51ccc000e14F6101B70'; // Replace with your smart contract address
const rpcURL = 'https://rpc.kinto-rpc.com/';

// Define Kinto Chain
const kinto = defineChain({
  id: 7887,
  name: 'Kinto',
  network: 'kinto',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [rpcURL],
    },
  },
});


  

const Events: React.FC = () => {
  const [accountInfo, setAccountInfo] = useState<KintoAccountInfo | undefined>(undefined);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const kintoSDK = createKintoSDK(contractAddress);

  const dummyEvents = [
    {
      id: 1,
      name: "Tech Innovators Meetup",
      date: "2024-11-20",
      location: "San Francisco, CA",
      pointsToStake: 5,
      description: "Join us for an evening of networking and innovation with leading tech professionals.",
    },
    {
      id: 2,
      name: "Blockchain Basics Workshop",
      date: "2024-12-01",
      location: "New York, NY",
      pointsToStake: 5,
      description: "A hands-on workshop for beginners to learn the fundamentals of blockchain technology.",
    },
    {
      id: 3,
      name: "AI in Healthcare Conference",
      date: "2025-01-15",
      location: "London, UK",
      pointsToStake: 5,
      description: "Explore the intersection of artificial intelligence and healthcare with global experts.",
    },
    {
      id: 4,
      name: "Decentralized Finance Summit",
      date: "2024-12-10",
      location: "Singapore",
      pointsToStake: 5,
      description: "Dive into the world of DeFi and learn from industry pioneers about its potential.",
    },
    {
      id: 5,
      name: "Startups Pitch Night",
      date: "2024-12-05",
      location: "Austin, TX",
      pointsToStake: 5,
      description: "Local startups showcase their ideas to investors and industry leaders.",
    },
    {
      id: 6,
      name: "Green Tech Expo",
      date: "2025-02-20",
      location: "Berlin, Germany",
      pointsToStake: 5,
      description: "An exhibition of the latest advancements in sustainable and green technologies.",
    },
    {
      id: 7,
      name: "Cryptocurrency Market Trends",
      date: "2024-11-25",
      location: "Tokyo, Japan",
      pointsToStake: 5,
      description: "Understand the latest trends and future predictions for the cryptocurrency market.",
    },
    {
      id: 8,
      name: "Women in Tech Leadership Forum",
      date: "2025-03-08",
      location: "Sydney, Australia",
      pointsToStake: 5,
      description: "Celebrate International Women's Day with discussions on leadership and innovation in tech.",
    },
  ];
  

  useEffect(() => {
    const initiateConnection = async () => {
      try {
        await connectWallet(); // Ensure connectWallet is awaited
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    };
  
    initiateConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const account = await kintoSDK.connect();
      setAccountInfo(account);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleRegister = async () => {
    if (!selectedEvent || !accountInfo?.walletAddress) {
      alert('Please connect your wallet and select an event!');
      return;
    }

    setLoading(true);

    try {
      const client = createPublicClient({ chain: kinto, transport: http() });
      const contract = getContract({
        address: contractAddress as Address,
        abi: contractABI,
        client: { public: client },
      });

      const data = encodeFunctionData({
        abi: contractABI,
        functionName: 'registerForEvent',
        args: [selectedEvent.id],
      });

      await kintoSDK.sendTransaction([
        {
          to: contractAddress,
          data,
          value: BigInt(0),
        },
      ]);

      setIsRegistered(true);
      alert(`Successfully registered for ${selectedEvent.name}`);
    } catch (error) {
      console.error('Failed to register event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventsContainer>
      
      <EventGrid>
        {dummyEvents.map((event) => (
          <EventCard
            key={event.id}
            onClick={() => {
              setSelectedEvent(event);
              setIsRegistered(false);
            }}
          >
            <EventImage src="dummy.png" alt={event.name} />
            <EventDetails>
              <EventName>{event.name}</EventName>
              <EventDate>{event.date}</EventDate>
              <EventLocation>{event.location}</EventLocation>
              <EventPoints>{event.pointsToStake} Points to Stake</EventPoints>
            </EventDetails>
          </EventCard>
        ))}
      </EventGrid>

      {selectedEvent && (
        <Modal
          onClick={(e) => {
            if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
              setSelectedEvent(null);
            }
          }}
          className="modal-backdrop"
        >
          <ModalContent>
            <CloseButton onClick={() => setSelectedEvent(null)}>×</CloseButton>
            <EventImage src="dummy.png" alt={selectedEvent.name} />
            <EventDetails>
              <EventName>{selectedEvent.name}</EventName>
              <EventDate>{selectedEvent.date}</EventDate>
              <EventLocation>{selectedEvent.location}</EventLocation>
              <EventPoints>{selectedEvent.pointsToStake} Points</EventPoints>
            </EventDetails>
            <RegisterButton onClick={handleRegister} disabled={isRegistered || loading}>
              {loading ? 'Registering...' : isRegistered ? 'Already Registered' : 'Register'}
            </RegisterButton>
          </ModalContent>
        </Modal>
      )}
    </EventsContainer>
  );
};

export default Events;

// Styled Components
const EventsContainer = styled.div`
  padding: 40px 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
`;

const ConnectButton = styled.button`
  padding: 10px 20px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const WalletInfo = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
`;

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const EventDetails = styled.div`
  padding: 20px;
  text-align: center;
`;

const EventName = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
`;

const EventDate = styled.p`
  font-size: 16px;
  color: #555;
`;

const EventLocation = styled.p`
  font-size: 16px;
  color: #777;
`;

const EventPoints = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #28a745;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  width: 400px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
`;

const RegisterButton = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;
