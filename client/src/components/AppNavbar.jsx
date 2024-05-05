import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AppNavbar.css";

export default function AppNavbar({ onClick, gamedate, onChange }) {
  return (
    <Navbar
      expand="sm"
      fixed="top"
      className="bg-body-tertiary shadow-sm navbar-custom"
    >
      <Container>
        <Navbar.Brand href="#home">Word Guess</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link id="about" onClick={onClick}>
              About
            </Nav.Link>
            <Nav.Link id="random" onClick={onClick}>
              Random
            </Nav.Link>
            <Nav.Link id="reset" onClick={onClick}>
              Reset
            </Nav.Link>
            <Nav.Link id="answer" onClick={onClick}>
              Answer
            </Nav.Link>
            
          </Nav>
          <Nav className="ms-auto">
            <DatePicker
              className="game-date"
              selected={gamedate}
              onChange={onChange}
              minDate={new Date(2024, 0, 1)}
              maxDate={new Date(2030, 4, 3)}
              showIcon
              toggleCalendarOnIconClick
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 48 48"
                >
                  <mask id="ipSApplication0">
                    <g
                      fill="none"
                      stroke="#fff"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    >
                      <path
                        strokeLinecap="round"
                        d="M40.04 22v20h-32V22"
                      ></path>
                      <path
                        fill="#fff"
                        d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                      ></path>
                    </g>
                  </mask>
                  <path
                    fill="#808080"
                    d="M0 0h48v48H0z"
                    mask="url(#ipSApplication0)"
                  ></path>
                </svg>
              }
              aria-label="Game Date" 
            />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
