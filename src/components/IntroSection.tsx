import React from 'react';
import styled from 'styled-components';

const IntroSection: React.FC = () => {
  const handleScrollToEvents = () => {
    const eventsSection = document.getElementById('events-section');
    eventsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <IntroContainer>
      <ContentWrapper>
        <Tagline>
          Gain Points, Build a Reputation Score, and Stand Out from the Generalized Crowd.
        </Tagline>
        <Button onClick={handleScrollToEvents}>Check Upcoming Events</Button>
      </ContentWrapper>
    </IntroContainer>
  );
};

export default IntroSection;

// Styled Components
const IntroContainer = styled.section`
  width: 100%;
  height: 85vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  border: 5px solid black;
  padding: 20px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const Tagline = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: green;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: green;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;

  &:hover {
    transform: scale(1.05);
    background-color: #006400; /* Darker green on hover */
  }
`;
