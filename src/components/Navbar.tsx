import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { createKintoSDK, KintoAccountInfo } from "kinto-web-sdk";
import {
  encodeFunctionData, Address, getContract,
  defineChain, createPublicClient, http
} from 'viem';
import { useNavigate } from 'react-router-dom';



const kintoSDK = createKintoSDK("0xa6DC2754602E7e3b70E80d62CD765d71538091b1"); // Replace with your actual Kinto App Key

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
      http: ['https://rpc.kinto-rpc.com/'],
      webSocket: ['wss://rpc.kinto.xyz/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://kintoscan.io' },
  },
});

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  
  const [showProfile, setShowProfile] = useState<boolean>(false);
  const [accountInfo, setAccountInfo] = useState<KintoAccountInfo |  undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [address,setAddress] = useState<string>('');
  const [btnText, setBtnText] = useState<string>('Connect Wallet');

  const connectWallet = async () => {
    try {
      setLoading(true);
      setBtnText('Connecting...');
      const account = await kintoSDK.connect(); // Connect to Kinto Wallet
      setAccountInfo(account);
      setAddress(accountInfo?.walletAddress || '');
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleRegisterEvent = () => {
    console.log("Register Event clicked!");
    navigate('/register-event')
    // Add navigation or modal logic for registering events
  };

  return (
    <NavBarContainer>
      <Logo ><img src="rect-v1.png" alt="Logo" id="logo" /></Logo>
      <NavActions>
        <RegisterText onClick={handleRegisterEvent}>Register Event</RegisterText>
        {accountInfo ? (
          <WalletAddress
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
          >
            {"0xa6D"}...{"1b1"}
            {showProfile && (
              <ProfileContainer>
                <ProfileImage src="https://via.placeholder.com/100" alt="Profile" />
                <ProfileName>John Doe</ProfileName>
                <ReppScore>Repp Score: 1200</ReppScore>
              </ProfileContainer>
            )}
          </WalletAddress>
        ) : (
          <ConnectButton onClick={connectWallet}>{btnText}</ConnectButton>
        )}
      </NavActions>
    </NavBarContainer>
  );
};

export default Navbar;

// Styled Components

// Gradient animation for the bottom border
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const NavBarContainer = styled.nav`
  width: 100%;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #000000;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);

  // Bottom gradient border
  border-bottom: 4px solid transparent;
  background-image: linear-gradient(#000000, #000000),
    linear-gradient(270deg, #00ff00, #00ffff, #ff00ff, #00ff00);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-size: 400% 100%;
  animation: ${gradientAnimation} 5s linear infinite;
`;

const Logo = styled.h1`
  font-size: 4px;
  font-weight: bold;
  margin: -10px;
  color: lightgreen;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
`;

const RegisterText = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: lightgreen;
  cursor: pointer;
  margin-right: 20px;

  &:hover {
    text-decoration: underline;
  }
`;

const ConnectButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  color: black;
  background: lightgreen;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 0 40px;
  transition: transform 0.2s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #9fffa1;
  }
`;

const WalletAddress = styled.div`
  position: relative;
  font-size: 14px;
  font-weight: bold;
  color: lightgreen;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 6px 12px;
  border-radius: 8px;
  margin: 0 40px;
  cursor: pointer;

  /* Green border to match the Connect Wallet button */
  border: 2px solid lightgreen;
`;

const ProfileContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid lightgreen;
  border-radius: 12px;
  width: 200px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileName = styled.h4`
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
`;

const ReppScore = styled.p`
  font-size: 14px;
  color: lightgreen;
  margin: 0;
`;
