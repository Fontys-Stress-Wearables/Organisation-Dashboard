import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/esm/Alert'
import {
  getPatientGroups,
  PatientGroupProps,
  removePatientGroup,
} from '../../utilities/api/calls'
import styles from './patient-groups.module.scss'
import BasicPgTable from './table'
import { CreatePatientGroupModal } from '../createPatientGroupModal'
import { AUTH_REQUEST_SCOPE_URL } from '../../utilities/environment'

const PatientGroups: React.FC = () => {
  const [patientGroups, setPatientGroups] = useState<PatientGroupProps[]>([])
  const [error, setError] = useState(false)
  const { instance, accounts } = useMsal()

  const request = {
    scopes: [AUTH_REQUEST_SCOPE_URL, 'User.Read'],
    account: accounts[0],
  }

  useEffect(() => {
    fetchPatientGroups()
  }, [])

  const onRemove = (id: string) => {
    instance.acquireTokenSilent(request).then((res: any) => {
      removePatientGroup(res.accessToken, id)
        .then(() => {
          fetchPatientGroups()
        })
        .catch((err) => {
          console.error('Error occurred while removing patient-group', err)
          setError(true)
        })
    })
  }

  const fetchPatientGroups = () => {
    instance.acquireTokenSilent(request).then((res: any) => {
      getPatientGroups(res.accessToken)
        .then((response) => {
          if (response.error) {
            setError(true)
          } else {
            const foundPatientGroups = response.response
            setError(false)
            setPatientGroups(foundPatientGroups)
          }
        })
        .catch((err) => {
          console.error('Error occurred while fetching patient groups', err)
          setError(true)
        })
    })
  }

  return (
    <div>
      {!error ? (
        <div className={styles.container}>
          <div className={styles.createPatientGroupModal}>
            <CreatePatientGroupModal update={fetchPatientGroups} />
          </div>
          <div className={styles.Table}>
            {patientGroups && patientGroups.length ? (
              <BasicPgTable
                onRemove={onRemove}
                patientGroups={patientGroups}
                update={fetchPatientGroups}
              />
            ) : (
              <div>
                <Alert variant="primary">No patient-groups found</Alert>
              </div>
            )}
          </div>
        </div>
      ) : (
        <h2>ERROR PLEASE RELOAD PAGE</h2>
      )}
    </div>
  )
}

export default PatientGroups
