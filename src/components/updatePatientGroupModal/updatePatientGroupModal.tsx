import { useMsal } from "@azure/msal-react";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import EditIcon from "./edit.svg"
import { PatientGroupProps, updatePatientGroup } from "../../utilities/api/calls";
import { REACT_APP_AUTH_REQUEST_SCOPE_URL } from "../../utilities/environment";
import Form from "react-bootstrap/esm/Form";

interface IUpdatePatientGroupModal {
    patientGroup: PatientGroupProps,
    update: () => void
}

const UpdatePatientGroupModal:React.FC<IUpdatePatientGroupModal> = ({patientGroup, update}) => {
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const { instance, accounts } = useMsal();

    const request = {
      scopes: [REACT_APP_AUTH_REQUEST_SCOPE_URL, "User.Read"],
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

    const handleShow = () => {
        if(show){
            setShow(false);
        }
        setGroupName(patientGroup.groupName)
        setDescription(patientGroup.description)
        setShow(true);
    }

    // const handleUpdate = useCallback(event => {
    //     updatePatientGroupTable(!update)
    // }, [updatePatientGroupTable])
    
    function handleSubmit(){
      
      const handlePatientGroup: PatientGroupProps = {
        id: patientGroup.id,
        groupName: groupName,
        description: description
      }


      instance.acquireTokenSilent(request).then((res: any) => {
        updatePatientGroup(res.accessToken, handlePatientGroup).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const resPatientGroup = response.response
            setError(false)

            update()
            // updatePatientGroupTable(true)
          }
        }).catch((err) => {
          console.error('Error occurred while creating patient group', err)
          setError(true)
        })
      }).catch((error) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          updatePatientGroup(res.accessToken, handlePatientGroup).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const resPatientGroup = response.response
              setError(false)

              update()
            }
          }).catch((err) => {
            console.error('Error occurred while creating patient group', err)
            setError(true)
            // updatePatientGroupTable(true)
          })
        });
      });  

      handleClose();
    }

    return (
      <div>
        <Button style={{display: "flex", width: "36px", justifyContent: "center"}} variant="success" onClick={handleShow}>
            <img alt="editicon" src={EditIcon}></img>
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update patient-group:{patientGroup.groupName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="create-patient-group.groupName">
                <Form.Label>Group name</Form.Label>
                <Form.Control
                  type="string"
                  placeholder={patientGroup.groupName}
                  autoFocus
                  onChange={handleChangeGroupName}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="create-patient-group.description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="string"
                  placeholder={patientGroup.description}
                  autoFocus
                  onChange={handleChangeDescription}
                />
              </Form.Group>
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
      </div>
    );
}

export default UpdatePatientGroupModal