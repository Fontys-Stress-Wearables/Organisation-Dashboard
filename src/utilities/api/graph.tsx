import { AUTH_CLIENT_ID, ROLE_ID } from '../environment'

export async function callMsGraph(accessToken: string) {
  const headers = new Headers()
  const bearer = `Bearer ${accessToken}`

  headers.append('Authorization', bearer)
  headers.append('ConsistencyLevel', 'eventual')

  const options = {
    method: 'GET',
    headers: headers,
  }

  var servicePrincipalRequest = await fetch(
    `https://graph.microsoft.com/v1.0/servicePrincipals?$count=true&$search="appId:${AUTH_CLIENT_ID}"&$select=id`,
    options,
  )
  var servicePrincipal = (await servicePrincipalRequest.json()).value[0].id

  var rolesResponse = await fetch(
    `https://graph.microsoft.com/v1.0/servicePrincipals/${servicePrincipal}/appRoleAssignedTo?$select=appRoleId,principalId`,
    options,
  )
  var roles = (await rolesResponse.json()).value.reduce(
    (acc: any, curr: any) => {
      acc[curr.principalId] = curr.appRoleId
      return acc
    },
    {},
  )

  var userResponse = await fetch(
    'https://graph.microsoft.com/v1.0/users',
    options,
  )
  var users = (await userResponse.json()).value.filter(
    (z: any) => roles[z.id] === ROLE_ID,
  )

  return users
}
