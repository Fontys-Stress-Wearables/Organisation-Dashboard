import { useState } from 'react'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/esm/Modal'
import { CaregiverGraphProps } from '../../utilities/api/calls'

interface CaregiverDetailsProps {
  show: boolean
  closeModal: () => void
  caregiver: CaregiverGraphProps | undefined
}

const CaregiverDetailsModal: React.FC<CaregiverDetailsProps> = ({
  caregiver,
  show,
  closeModal,
}) => {
  return (
    <>
      <Modal
        size="xl"
        show={show}
        onHide={closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {caregiver && caregiver.givenName} {caregiver && caregiver.surname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Job title: </b>
            {caregiver && caregiver.jobTitle}
          </p>
          <p>
            <b>E-mail address: </b>
            {caregiver && caregiver.mail ? caregiver.mail : '-'}
          </p>
          <p>
            <b>Phone: </b>
            {caregiver && caregiver.mobilePhone ? caregiver.mobilePhone : '-'}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CaregiverDetailsModal
