import React, { useCallback, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { createPatient, PatientProps } from "../../utilities/api/calls";
import AddIcon from "./person_add_white.svg";
import { useMsal } from "@azure/msal-react";
import { AUTH_REQUEST_SCOPE_URL } from "../../utilities/environment";


export interface IModalProps {
  update: boolean,
  updateTable: (arg: boolean) => void
}

const CreatePatientModal: React.FC<IModalProps> = ({ update, updateTable }) => {
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [patient, setPatient] = useState<PatientProps>();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { instance, accounts } = useMsal();

    const request = {
      scopes: [AUTH_REQUEST_SCOPE_URL, "User.Read"],
      account: accounts[0]
    };

    const [firstname, setFirstname] = useState("");

    const handleChangeFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFirstname(event.target.value);
    };

    const [lastname, setLastname] = useState("");

    const handleChangeLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
      setLastname(event.target.value);
    };

    const [date, setDate] = useState("");

    const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDate(event.target.value);
    };

    function handleSubmit(){

      const handlePatient: PatientProps = {
        firstName: firstname,
        lastName: lastname,
        birthdate: date
      }

      setPatient(handlePatient);

      instance.acquireTokenSilent(request).then((res: any) => {
        createPatient(res.accessToken, handlePatient).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const resPatient = response.response
            setError(false)
            setPatient(resPatient)
            updateTable(true)
          }
        }).catch((err) => {
          console.error('Error occurred while fetching patients', err)
          setError(true)
        })
      }).catch((error) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          createPatient(res.accessToken, handlePatient).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const resPatient = response.response
              setError(false)
              setPatient(resPatient)
              updateTable(true)
            }
          }).catch((err) => {
            console.error('Error occurred while fetching patients', err)
            setError(true)
          })
        });
      });  

      handleClose();
    }

    return (
      <>
        <Button variant="success" onClick={handleShow}>
           Add patient <img src={AddIcon}></img> 
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a new patient in the system</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="First name"
                  autoFocus
                  onChange={handleChangeFirstname}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="Last name"
                  autoFocus
                  onChange={handleChangeLastname}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Birthdate"
                  autoFocus
                  max={new Date().toISOString().split("T")[0]}
                  onChange={handleChangeDate}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
              Submit Patient
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default CreatePatientModal

