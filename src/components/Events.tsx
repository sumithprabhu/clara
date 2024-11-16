import React, { useState } from 'react';
import styled from 'styled-components';

const dummyEvents = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `Event ${index + 1}`,
  date: new Date().toDateString(),
  location: `Location ${index + 1}`,
  pointsToStake: Math.floor(Math.random() * 100) + 1,
}));

const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  const handleRegister = () => {
    setIsRegistered(true);
  };

  return (
    <EventsContainer id="events-section">
      <EventGrid>
        {dummyEvents.map((event) => (
          <EventCard
            key={event.id}
            onClick={() => {
              setSelectedEvent(event);
              setIsRegistered(false); // Reset registration for each event
            }}
          >
            <EventImage src="dummy.png" alt={event.name} />
            <EventDetails>
              <EventName>{event.name}</EventName>
              <EventDate>{event.date}</EventDate>
              <EventLocation>{event.location}</EventLocation>
              <EventPoints>{event.pointsToStake} Points</EventPoints>
            </EventDetails>
          </EventCard>
        ))}
      </EventGrid>

      {selectedEvent && (
  <Modal
    onClick={(e) => {
      // Close the modal if clicked on the backdrop (not the content)
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
      <RegisterButton onClick={handleRegister} disabled={isRegistered}>
        {isRegistered ? 'Already Registered' : 'Register'}
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

const EventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 0 20px;
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
  border-bottom: 2px solid #e5e5e5;
`;

const EventDetails = styled.div`
  padding: 20px;
  text-align: center;
`;

const EventName = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 10px;
`;

const EventDate = styled.p`
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
`;

const EventLocation = styled.p`
  font-size: 16px;
  color: #777;
  margin-bottom: 8px;
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
  position: relative;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1010; /* Ensures modal content is above the backdrop */
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

  &:hover {
    color: #333;
  }
`;

const RegisterButton = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;
