import React, { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { createOrganization, OrganizationProps } from "../../utilities/api/calls";
import { REACT_APP_AUTH_REQUEST_SCOPE_URL } from "../../utilities/environment";
import AddIcon from "./home-plus.svg";
import { useMsal } from "@azure/msal-react";

interface  ICreatePatinetModalProps {
  update: boolean,
  updateOrganizationTable: (arg: boolean) => void
}

const CreateOrganizationModal: React.FC<ICreatePatinetModalProps> = ({ update, updateOrganizationTable }) => {
    const [error, setError] = useState(false)
    const [show, setShow] = useState(false);
    const [organization, setOrganization] = useState<OrganizationProps>();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { instance, accounts } = useMsal();

    const request = {
      scopes: [REACT_APP_AUTH_REQUEST_SCOPE_URL, "User.Read"],
      account: accounts[0]
    };

    const [name, setName] = useState("");
    const [tenantId, setTenantId] = useState("");

    const handleChangeOrganizationname = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    };

    const handleChangeTenantId = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTenantId(event.target.value);
    };

    function handleSubmit(){
      
      const handleOrganization: OrganizationProps = {
        name: name,
        id: tenantId,
      }

      setOrganization(handleOrganization);

      instance.acquireTokenSilent(request).then((res: any) => {
        console.log(organization);
        createOrganization(res.accessToken, handleOrganization).then((response) => {
          if(response.error){
            setError(true)
          } else {
            const resOrganization = response.response
            setError(false)
            setOrganization(resOrganization)
            
            updateOrganizationTable(true);
          }
        }).catch((err) => {
          console.error('Error occurred while fetching organizations', err)
          setError(true)
        })
      }).catch((error) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          createOrganization(res.accessToken, handleOrganization).then((response) => {
            if(response.error){
              setError(true)
            } else {
              const resOrganization = response.response
              setError(false)
              setOrganization(resOrganization)

              updateOrganizationTable(true);
            }
          }).catch((err) => {
            console.error('Error occurred while fetching organizations', err)
            setError(true)
          })
        });
      });  

      handleClose();
    }

    return (
      <div>
          {!error ? (
        <div>    
          <Button variant="success" onClick={handleShow}>
            Add organization <img alt="addicon" src={AddIcon}></img> 
          </Button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create a new organization in the system</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Organization name</Form.Label>
                  <Form.Control
                    type="string"
                    placeholder="Name"
                    autoFocus
                    onChange={handleChangeOrganizationname}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Tenant ID</Form.Label>
                  <Form.Control
                    type="string"
                    placeholder="Tenant ID"
                    autoFocus
                    onChange={handleChangeTenantId}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={() => handleSubmit()}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        ) : (
            <h2> ERROR PLEASE RELOAD PAGE</h2>
        )}
      </div>
    );
}
  
export default CreateOrganizationModal

