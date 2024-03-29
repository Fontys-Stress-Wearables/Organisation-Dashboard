import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { useMsal } from '@azure/msal-react'
import { getPatients, PatientProps } from '../../utilities/api/calls'
import { AUTH_REQUEST_SCOPE_URL } from '../../utilities/environment'
import styles from './patients.module.scss'
import { CreatePatientModal } from '../modals/createPatientModal'
import BasicTable from '../table/table'

const Patients: React.FC = () => {
  const [error, setError] = useState(false)
  const [patients, setPatients] = useState<PatientProps[]>([])
  const { instance, accounts } = useMsal()

  const updatePatientTable = (): void => {
    fetchPatients()
  }

  const request = {
    scopes: [AUTH_REQUEST_SCOPE_URL, 'User.Read'],
    account: accounts[0],
  }

  useEffect(() => {
    fetchPatients()
  })

  const fetchPatients = () => {
    instance.acquireTokenSilent(request).then((res: any) => {
      getPatients(res.accessToken)
        .then((response) => {
          if (response.error) {
            setError(true)
          } else {
            const foundPatients = response.response
            setError(false)
            setPatients(foundPatients)
          }
        })
        .catch((err) => {
          console.error('Error occurred while fetching patients', err)
          setError(true)
        })
    })
  }

  return (
    <div>
      {!error ? (
        <div className={styles.container}>
          <div className={styles.createPatientModal}>
            <CreatePatientModal updateTable={updatePatientTable} />
          </div>
          <div className={styles.Table}>
            {patients && patients.length ? (
              <BasicTable patients={patients} update={fetchPatients} />
            ) : (
              <div>
                <Alert variant="primary">No patients found</Alert>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h2> ERROR PLEASE RELOAD PAGE</h2>
      )}
    </div>
  )
}

export default Patients
