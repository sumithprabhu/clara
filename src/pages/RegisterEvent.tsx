import React, { useState } from "react";
import styled from "styled-components";

interface ParticipantType {
  name: string;
  score: number;
}

interface EventDetailType {
  id: number;
  name: string;
  date: string;
  stakePoints: number;
  description: string;
  participants: ParticipantType[];
}

const RegisterEvent: React.FC = () => {
  const [events, setEvents] = useState<EventDetailType[]>([
    {
      id: 1,
      name: "Blockchain Basics Workshop",
      date: "2024-12-01",
      stakePoints: 5,
      description: "Blockchain Basics Workshop",
      participants: [
        { name: "John Doe", score: 670 },
        { name: "Jane Smith", score: 350 },
      ],
    },
  ]);
  const [showEventDetail, setShowEventDetail] = useState<EventDetailType | null>(null);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: EventDetailType = {
      id: events.length + 1,
      name: "New Event",
      date: "2024-12-31",
      stakePoints: 5,
      description: "A new event description",
      participants: [],
    };
    setEvents([...events, newEvent]);
  };

  return (
    <RegisterPage>
      <Header>Create Your Event</Header>
      <FormContainer>
        <Form onSubmit={handleCreateEvent}>
          <Label>Event Name</Label>
          <Input type="text" required />
          <Label>Event Photo</Label>
          <Input type="file" />
          <Label>Description</Label>
          <TextArea required />
          <Label>Stake Points</Label>
          <Input type="number" value={5} readOnly />
          <SubmitButton type="submit">Create Event</SubmitButton>
        </Form>
      </FormContainer>

      <EventListContainer>
        <h2>Created Events</h2>
        {events.map((event) => (
          <EventItem key={event.id} onClick={() => setShowEventDetail(event)}>
            <EventName>{event.name}</EventName>
            <EventDate>Ends on: {event.date}</EventDate>
            <EventParticipants>Participants: {event.participants.length}</EventParticipants>
          </EventItem>
        ))}
      </EventListContainer>

      {showEventDetail && (
        <EventDetail onClick={() => setShowEventDetail(null)}>
          <EventContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowEventDetail(null)}>X</CloseButton>
            <h3>{showEventDetail.name}</h3>
            <p>{showEventDetail.description}</p>
            <ParticipantsList>
              <h4>Participants</h4>
              <Scrollable>
                {showEventDetail.participants.map((participant, index) => (
                  <ParticipantBox key={index}>
                    <ParticipantName>{participant.name}</ParticipantName>
                    <ParticipantScore>Score: {participant.score}</ParticipantScore>
                    <ActionButtons>
                      <ApproveButton>Approve</ApproveButton>
                      <DeclineButton>Decline</DeclineButton>
                    </ActionButtons>
                  </ParticipantBox>
                ))}
              </Scrollable>
            </ParticipantsList>
          </EventContent>
        </EventDetail>
      )}
    </RegisterPage>
  );
};

export default RegisterEvent;

// Styled Components
const RegisterPage = styled.div`
  padding: 20px;
`;

const Header = styled.h1`
  text-align: center;
  color: green;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const Form = styled.form`
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
margin-top: 20px;
  border: 3px solid transparent;
  background-image: linear-gradient(white, white),
    linear-gradient(90deg, #00ff00, #00ffff, #ff00ff, #00ff00);
  background-origin: border-box;
  background-clip: padding-box, border-box;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 15px;
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: 8px;
  margin-bottom: 15px;
  width: 100%;
`;

const SubmitButton = styled.button`
  padding: 10px 15px;
  background: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darkgreen;
  }
`;

const EventListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const EventItem = styled.div`
   background: #ffffff;
  border-radius: 10px;
  max-width: 400px;
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const EventName = styled.h4`
  margin: 0;
`;

const EventDate = styled.p`
  margin: 0;
  font-size: 14px;
`;

const EventParticipants = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
`;

const EventDetail = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const EventContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const ParticipantsList = styled.div`
  margin-top: 20px;
`;

const Scrollable = styled.div`
  max-height: 150px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
`;

const ParticipantBox = styled.div`
  width: 180px;
  padding: 15px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  border: 3px solid transparent;
  background-image: linear-gradient(white, white),
    linear-gradient(90deg, #00ff00, #00ffff, #ff00ff, #00ff00);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ParticipantName = styled.h5`
  margin: 10px 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const ParticipantScore = styled.p`
  margin: 5px 0 10px;
  font-size: 14px;
  color: #555;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ApproveButton = styled.button`
  background: #00ff00;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #00cc00;
  }
`;

const DeclineButton = styled.button`
  background: #ff0000;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #cc0000;
  }
`;
