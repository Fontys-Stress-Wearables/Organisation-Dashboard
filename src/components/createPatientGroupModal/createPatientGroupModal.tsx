import React, { useState } from 'react'
import { useMsal } from '@azure/msal-react'
import Modal from 'react-bootstrap/esm/Modal'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import AddIcon from './group_add.svg'
import {
  createPatientGroup,
  PatientGroupProps,
} from '../../utilities/api/calls'
import { AUTH_REQUEST_SCOPE_URL } from '../../utilities/environment'

export interface IPatientGroupModalProps {
  update: () => void
}

const CreatePatientGroupModal: React.FC<IPatientGroupModalProps> = ({
  update,
}) => {
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const { instance, accounts } = useMsal()

  const request = {
    scopes: [AUTH_REQUEST_SCOPE_URL, 'User.Read'],
    account: accounts[0],
  }

  const [groupName, setGroupName] = useState('')

  const handleChangeGroupName = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setGroupName(event.target.value)
  }

  const [description, setDescription] = useState('')

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDescription(event.target.value)
  }

  function handleSubmit() {
    const handlePatientGroup: PatientGroupProps = {
      groupName,
      description,
    }

    instance.acquireTokenSilent(request).then((res: any) => {
      createPatientGroup(res.accessToken, handlePatientGroup)
        .then((response) => {
          console.log(response)
          if (response.error) {
            setError(true)
          } else {
            setError(false)
            update()
          }
        })
        .catch((err) => {
          console.error('Error occurred while creating patient group', err)
          setError(true)
        })
    })
    handleClose()
  }

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Add patient-group <img src={AddIcon}></img>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Patient Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="mb-3"
              controlId="create-patient-group.groupName"
            >
              <Form.Label>Group name</Form.Label>
              <Form.Control
                type="string"
                placeholder="Group name"
                autoFocus
                onChange={handleChangeGroupName}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="create-patient-group.description"
            >
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="string"
                placeholder="Description"
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
    </>
  )
}

export default CreatePatientGroupModal
