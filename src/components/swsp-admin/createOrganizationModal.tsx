import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import { createOrganization, OrganizationProps } from "../../utilities/api/calls";
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
      scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
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
          console.error('Error occured while fetching organizations', err)
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
            console.error('Error occured while fetching organizations', err)
            setError(true)
          })
        });
      });  

      handleClose();
    }

    return (
      <>
        <Button variant="success" onClick={handleShow}>
           Add organization <img src={AddIcon}></img> 
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
      </>
    );
  }
  
export default CreateOrganizationModal

