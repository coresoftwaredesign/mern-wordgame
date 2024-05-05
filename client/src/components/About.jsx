import React from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function About({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>About Word Guess</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Word Guess was developed by{" "}
        <a
          href="https://www.coresoftwaredesign.com"
          target="_blank"
          rel="noreferrer"
        >
          Core Software Design
        </a>{" "}
        on the MERN Tech Stack (MongoDB, Express, React, Node). Find out more
        this application on{" "}
        <a
          href="https://www.github.com/coresoftwaredesign/mern-wordgame"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        .
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default About;
