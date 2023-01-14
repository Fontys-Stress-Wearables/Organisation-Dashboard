import { useMsal } from '@azure/msal-react'
import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import Form from 'react-bootstrap/esm/Form'
import EditIcon from './edit.svg'
import { PatientProps, updatePatient } from '../../utilities/api/calls'
import { AUTH_REQUEST_SCOPE_URL } from '../../utilities/environment'

interface IUpdatePatientModal {
  patient: PatientProps
  update: () => void
}

const UpdatePatientModal: React.FC<IUpdatePatientModal> = ({
  patient,
  update,
}) => {
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const { instance, accounts } = useMsal()

  const request = {
    scopes: [AUTH_REQUEST_SCOPE_URL, 'User.Read'],
    account: accounts[0],
  }

  const [firstname, setFirstname] = useState('')

  const handleChangeFirstname = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFirstname(event.target.value)
  }

  const [lastname, setLastname] = useState('')

  const handleChangeLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(event.target.value)
  }

  const [date, setDate] = useState('')

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value)
  }

  const handleShow = () => {
    if (show) {
      setShow(false)
    }
    setFirstname(patient.firstName)
    setLastname(patient.lastName)
    setDate(patient.birthdate)
    setShow(true)
  }

  function handleSubmit() {
    const handlePatient: PatientProps = {
      id: patient.id,
      firstName: firstname,
      lastName: lastname,
      birthdate: date,
    }

    instance
      .acquireTokenSilent(request)
      .then((res: any) => {
        updatePatient(res.accessToken, handlePatient)
          .then((response) => {
            if (response.error) {
              setError(true)
            } else {
              const resPatient = response.response
              setError(false)
              update()
            }
          })
          .catch((err) => {
            console.error('Error occurred while updating patient', err)
            setError(true)
          })
      })
      .catch((error) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          updatePatient(res.accessToken, handlePatient)
            .then((response) => {
              if (response.error) {
                setError(true)
              } else {
                const resPatient = response.response
                setError(false)
              }
            })
            .catch((err) => {
              console.error('Error occurred while updating patient', err)
              setError(true)
              update()
            })
        })
      })

    handleClose()
  }

  return (
    <div>
      <Button
        style={{
          display: 'flex',
          marginLeft: 'auto',
          width: '36px',
          justifyContent: 'center',
        }}
        variant="success"
        onClick={handleShow}
      >
        <img alt="editicon" src={EditIcon}></img>
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Patient: {patient.firstName && patient.lastName}
          </Modal.Title>
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
                max={new Date().toISOString().split('T')[0]}
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
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default UpdatePatientModal
