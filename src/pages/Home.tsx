import React from "react";
import styled from "styled-components";
import Events from "components/Events";

const App: React.FC = () => {
  return (
    <AppContainer>
      {/* Intro Section */}
      <IntroSection>
        <IntroContent>
          <h1>Gain Points. Build Reputation. <span>Stand Out! </span></h1>
          <p>Earn a reputation score by participating in events.</p>
          <Button
            onClick={() =>
              document
                .getElementById("events-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Check Upcoming Events
          </Button>
        </IntroContent>
      </IntroSection>

      {/* Video Section */}
      <VideoSection>
        <VideoWrapper>
          <BackgroundVideo autoPlay loop muted>
            <source src="/Register.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </BackgroundVideo>
        </VideoWrapper>
      </VideoSection>

      {/* Events Section */}
      <EventsSection id="events-section">
        <Events />
      </EventsSection>
    </AppContainer>
  );
};

export default App;

// Styled Components
const AppContainer = styled.div`
  font-family: "Arial", sans-serif;
  margin: 0;
  padding: 0;
  background-color: black;
`;

const IntroSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 100px 20px;
  background-color: black;
  color: white;
  z-index: 2;
  position: relative;
  height: 57vh;
`;

const IntroContent = styled.div`
  h1 {
    font-size: 3rem;
    margin-bottom: 20px;
    
  }

  /* For the blinking word "Stand Out" */
    span {
        font-size: 3rem;

      animation: neonBlink 2s ease-in-out infinite;
    }
  }

  p {
    font-size: 1.5rem;
    margin-bottom: 30px;
    color: white;
  }

  @keyframes neonBlink {
    0%, 100% {
      color: #00ff00; /* Neon green */
      text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
    }
    50% {
      color: white; /* White */
    }
  }
`;

const Button = styled.button`
  background: linear-gradient(90deg, #00ff00, #00ffff);
  color: black;
  font-size: 1rem;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: linear-gradient(90deg, #9fffa1, #00ffdd);
  }
`;

const VideoSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  padding: 50px 0; /* Spacing above and below the video */
`;

const VideoWrapper = styled.div`
  width: 50%; /* Restrict the video width */
  max-height: 100vh; /* Limit height to 80% of the viewport */
  overflow: hidden;
  position: relative;

  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid #00ff00; /* Green border around the video */
  border-radius: 10px; /* Rounded corners */
`;

const BackgroundVideo = styled.video`
  width: 100%;
  height: auto; /* Maintain aspect ratio */
`;

const EventsSection = styled.div`
  padding: 20px;
  background: white;
`;

