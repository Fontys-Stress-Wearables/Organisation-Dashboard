import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import SWSPApp from './swspAdminApp'
import App from './App'
import { TENANT_ID } from './utilities/environment'

export function AppGuard(props) {
  const { instance } = useMsal()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isSwsp, setIsSwsp] = useState(false)

  const handleLogout = () => {
    // eslint-disable-next-line no-console
    instance.logoutRedirect().catch(console.error)
  }

  useEffect(() => {
    const accounts = instance.getAllAccounts()

    if (accounts.length > 0) {
      instance.setActiveAccount(accounts[0])
    }

    const currentAccount = instance.getActiveAccount()

    if (currentAccount && currentAccount.tenantId === TENANT_ID) {
      setIsSwsp(true)
    } else if (currentAccount && currentAccount.idTokenClaims.roles) {
      // eslint-disable-next-line react/prop-types
      const intersection = props.roles.filter((role) =>
        currentAccount.idTokenClaims.roles.includes(role),
      )

      if (intersection.length > 0) {
        setIsAuthorized(true)
      }
    }
    // eslint-disable-next-line react/prop-types
  }, [instance, props.roles])

  if (isSwsp) return <SWSPApp />
  if (isAuthorized) return <App />
  return (
    <div>
      <p>
        You are not authorized to view this page. Please contact your
        administrator.
      </p>
      <button type="button" onClick={handleLogout}>
        logout
      </button>
    </div>
  )
}
