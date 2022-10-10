import { useEffect, useState } from 'react'
import Alert from 'react-bootstrap/esm/Alert'
import { CaregiverGraphProps } from '../../utilities/api/calls'
import styles from './caregivers.module.scss'
import { callMsGraph } from '../../utilities/api/graph'
import CaregiverTable from './table'
import { useMsal } from '@azure/msal-react'

const Caregivers = () => {
  const { instance, accounts } = useMsal()
  const [caregivers, setCaregivers] = useState<CaregiverGraphProps[]>([])

  useEffect(() => {
    requestCaregivers()
  }, [])

  const requestCaregivers = () => {
    const graphRequest = {
      scopes: ['User.Read'],
      account: accounts[0],
    }

    instance
      .acquireTokenSilent(graphRequest)
      .then((response: any) => {
        callMsGraph(response.accessToken).then(
          (response: CaregiverGraphProps[]) => {
            setCaregivers(response)
          },
        )
      })
      .catch((e: any) => {
        instance.acquireTokenPopup(graphRequest).then((response: any) => {
          callMsGraph(response.accessToken).then((response: any) => {
            setCaregivers(response)
          })
        })
      })
  }

  return (
    <div className={styles.container}>
      <div className={styles.Table}>
        {caregivers && caregivers.length ? (
          <CaregiverTable caregivers={caregivers} />
        ) : (
          <div>
            <Alert variant="primary">No caregivers found</Alert>
          </div>
        )}
      </div>
    </div>
  )
}

export default Caregivers
