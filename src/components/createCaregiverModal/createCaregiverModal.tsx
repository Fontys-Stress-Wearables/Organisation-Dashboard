import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import AddIcon from "./person_add_white.svg"

export interface IModalProps {
  update: boolean,
  updateTable: (arg: boolean) => void
}

const CreateCaregiverModal: React.FC<IModalProps> = (update, updateTable) => {
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (event: React.FormEvent<HTMLInputElement>) => {
      const form = event.currentTarget;
      if(form.checkValidity() === false){
        event.preventDefault();
        event.stopPropagation();
      }

      setValidated(true);
    }
  
    return (
      <>
        <Button variant="success" onClick={handleShow}>
           <img src={AddIcon}></img>
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a new caregiver in the system</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="ecaregiver.firstname">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First name"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please type a First name
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="caregiver.lastname">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Last name"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please type a Last name
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="caregiver.email">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="E-mail"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please type a valid email address
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="caregiver.jobtitle">
                <Form.Label>Job Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="type your job title"
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  Please type a job title
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" onClick={handleClose} type="submit">Submit caregiver</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default CreateCaregiverModal