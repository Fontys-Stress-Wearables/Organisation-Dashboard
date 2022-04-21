import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import AddIcon from "./person_add_white.svg"

const CreateCaregiverModal = () => {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
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
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="First name"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="Last name"
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="E-mail"
                  autoFocus
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default CreateCaregiverModal