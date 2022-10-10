import React, { useState } from 'react'
import {
  createPatientGroup,
  PatientGroupProps,
} from '../../utilities/api/calls'
import AddIcon from './group_add.svg'
import { useMsal } from '@azure/msal-react'
import Modal from 'react-bootstrap/esm/Modal'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import { AUTH_REQUEST_SCOPE_URL } from '../../utilities/environment'

export interface IPatientGroupModalProps {
  update: boolean
  updatePatientGroupTable: (arg: boolean) => void
}

const CreatePatientGroupModal: React.FC<IPatientGroupModalProps> = ({
  update,
  updatePatientGroupTable,
}) => {
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const [patientGroup, setPatientGroup] = useState<PatientGroupProps>()
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
      groupName: groupName,
      description: description,
    }

    setPatientGroup(handlePatientGroup)

    instance
      .acquireTokenSilent(request)
      .then((res: any) => {
        createPatientGroup(res.accessToken, handlePatientGroup)
          .then((response) => {
            if (response.error) {
              setError(true)
            } else {
              const resPatientGroup = response.response
              setError(false)
              setPatientGroup(resPatientGroup)
              updatePatientGroupTable(true)
            }
          })
          .catch((err) => {
            console.error('Error occurred while creating patient group', err)
            setError(true)
          })
      })
      .catch((error) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          createPatientGroup(res.accessToken, handlePatientGroup)
            .then((response) => {
              if (response.error) {
                setError(true)
              } else {
                const resPatientGroup = response.response
                setError(false)
                setPatientGroup(resPatientGroup)
              }
            })
            .catch((err) => {
              console.error('Error occurred while creating patient group', err)
              setError(true)
              updatePatientGroupTable(true)
            })
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
          <Modal.Title>Create a new patient-group in the system</Modal.Title>
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
