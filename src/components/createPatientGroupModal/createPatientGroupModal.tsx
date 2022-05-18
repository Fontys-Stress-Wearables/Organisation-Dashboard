import React, { FormEvent, useCallback, useState } from "react";
import { CaregiverGraphProps, createPatientGroup, PatientGroupProps } from "../../utilities/api/calls";
import AddIcon from "./group_add.svg";
import { useMsal } from "@azure/msal-react";
import Col from "react-bootstrap/esm/Col";
import FormControl, { FormControlProps } from "react-bootstrap/esm/FormControl";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";

interface ICreatePatientGroupModalProps {
  update: boolean,
  updatePatientGroupTable: (arg: boolean) => void
  caregivers: CaregiverGraphProps[]
}

const CreatePatientGroupModal: React.FC<ICreatePatientGroupModalProps> = ({ update, updatePatientGroupTable, caregivers}) => {
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [patientGroup, setPatientGroup] = useState<PatientGroupProps>();
    const [selectedCaregivers, setSelectedCaregivers] = useState();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { instance, accounts } = useMsal();

    const request = {
      scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
      account: accounts[0]
    };

    const [groupName, setGroupName] = useState("");

    const handleChangeGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
      setGroupName(event.target.value);
    };

    const [description, setDescription] = useState("");

    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.target.value);
    };

    const [assignedCaregivers, setAssignedCaregivers] = useState<CaregiverGraphProps>();

    // const onSelectedOptionsChange = (e: React.FormEvent<FormControlProps & typeof FormControl>) => {
    //   console.log(e.target.selectedOptions);
    // };

    const handleUpdate = useCallback(event => {
      updatePatientGroupTable(!update)
    }, [updatePatientGroupTable])
  
    function handleSubmit(){
      
      const handlePatientGroup: PatientGroupProps = {
        groupName: groupName,
        description: description
      }

      setPatientGroup(handlePatientGroup);

      instance.acquireTokenSilent(request).then((res: any) => {
        createPatientGroup(res.accessToken, handlePatientGroup).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const resPatientGroup = response.response
            setError(false)
            setPatientGroup(resPatientGroup)
            
          }
        }).catch((err) => {
          console.error('Error occured while creating patient group', err)
          setError(true)
        })
      }).catch((error) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          createPatientGroup(res.accessToken, handlePatientGroup).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const resPatientGroup = response.response
              setError(false)
              setPatientGroup(resPatientGroup)
            }
          }).catch((err) => {
            console.error('Error occured while creating patient group', err)
            setError(true)
          })
        });
      });  

      handleClose();
    }

    return (
      <>
        <Button variant="success" onClick={handleShow}>
           Add patient-group <img src={AddIcon}></img> 
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a new patient-group in the system</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="create-patient-group.groupName">
                <Form.Label>Group name</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="Group name"
                  autoFocus
                  onChange={handleChangeGroupName}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="create-patient-group.description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="Description"
                  autoFocus
                  onChange={handleChangeDescription}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="my_multiselect_field">
                <Form.Label>My multiselect</Form.Label>
                <Form.Control as="select" multiple>
                  {caregivers.map(c => (
                    <option key={c.id} value={c.displayName}>
                      {c.displayName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {/* <Form.Group className="mb-3" controlId="create-patient-group.caregiver">
                <Form.Label>Caregivers</Form.Label>
                  <Form.Select onChange={handleSelectedCaregiver} aria-label="Default select example">
                    <option>Select a cargiver</option>
                    {options}
                  </Form.Select>
              </Form.Group> */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSubmit()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default CreatePatientGroupModal

