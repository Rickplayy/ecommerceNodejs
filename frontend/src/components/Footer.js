
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <Container>
        <Row>
          <Col>
            <p>&copy; {new Date().getFullYear()} ROCKPA. All Rights Reserved.</p>
            <div>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.357 1.849 6.069l-1.254 4.579 4.66-1.241zM19.308 15.525c-.06-.127-.216-.208-.456-.347-.24-.139-.705-.347-1.39-.609-.685-.261-1.001-.402-1.132-.662-.131-.26-.131-.487.131-.811.197-.24.427-.48.588-.641.162-.162.216-.271.324-.451.108-.18.054-.347-.027-.487-.081-.139-.675-1.621-1.016-2.228-.312-.552-.623-.486-.863-.486-.24 0-.513-.027-.783-.027-.27 0-.702.108-1.069.513-.367.405-1.39 1.35-1.39 3.291 0 1.941 1.417 3.821 1.622 4.079.205.258 2.813 4.309 6.796 5.971 3.982 1.662 3.982 1.109 4.692 1.053.71-.054 2.205-.903 2.505-1.77.3-.867.3-1.592.216-1.711-.084-.119-.324-.19-.675-.324z"/></svg>
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
