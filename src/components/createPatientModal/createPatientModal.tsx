import { FunctionComponent, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { createPatient, PatientProps } from "../../utilities/api/calls";
import AddIcon from "./person_add_white.svg";
import { useMsal } from "@azure/msal-react";

// interface ChangeProps {
//   onChange: ({name, value}: { name: keyof PatientProps; value: string}) => void
// }

const CreatePatientModal = () => {
    const [error, setError] = useState(false)
    const [show, setShow] = useState(false);
    const [patient, setPatient] = useState<PatientProps>({firstName: "firstName", lastName: "", birthdate: ""});
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { instance, accounts } = useMsal();

    const request = {
      scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
      account: accounts[0]
    };

    function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
      const value = evt.target.value;
      setPatient({
        ...patient,
        [evt.target.name]: value
      });
    }
     const [date, setDate] = useState("");
  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

    const handleSubmit = () => {
      instance.acquireTokenSilent(request).then((res: any) => {
        console.log(patient);
        createPatient(res.accessToken, patient).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const resPatient = response.response
            setError(false)
            setPatient(resPatient)
          }
        }).catch((err) => {
          console.error('Error occured while fetching patients', err)
          setError(true)
        })
      }).catch((error) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          createPatient(res.accessToken, patient).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const resPatient = response.response
              setError(false)
              setPatient(resPatient)
            }
          }).catch((err) => {
            console.error('Error occured while fetching patients', err)
            setError(true)
          })
        });
      });  
      handleClose();
    }

    return (
      <>
        <Button variant="success" onClick={handleShow}>
           <img src={AddIcon}></img>
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
                  onChange={(firstName) => handleChange()}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="Last name"
                  autoFocus
                  value={}
                  onChange={(lastName) => handleChange()}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Birthdate</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Birthdate"
                  autoFocus
                  onChange={(e) => handleChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default CreatePatientModal

function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}

