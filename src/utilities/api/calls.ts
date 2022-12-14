import { API_URL, ORGANIZATION_API_URL } from '../environment'

interface ApiCalls {
  token?: string
  apiUrl?: string
  path: string
  method: 'POST' | 'GET' | 'PUT' | 'DELETE'
  body?: string | PatientProps | OrganizationProps | PatientGroupProps
}

interface BaseApiResponse {
  error: boolean
  errorCode?: string | null
  errorMessage?: string
}

export type PatientProps = {
  id?: string
  firstName: string
  lastName: string
  birthdate: string
  isActive?: boolean
  role?: string
  patientGroups?: PatientGroupProps[]
}

export type XPatientProps = {
  id: string
  firstName: string
  lastName: string
  birthdate: string
  isActive?: boolean
  role?: string
  patientGroups?: PatientGroupProps[]
}

export type CaregiverProps = {
  id: string
  firstName: string
  lastName: string
  emailAddress: number
  isActive: boolean
  isGuest: boolean
  role: string
  patientGroups: PatientGroupProps[]
  azureId: string
}

export type CaregiverGraphProps = {
  displayName: string
  givenName: string
  id: string
  jobTitle: string
  mail: string | null
  mobilePhone: string | null
  officeLocation: string | null
  preferrendLanguage: string | null
  surname: string
  userPrincipalName: string
}

export type PatientGroupProps = {
  id?: string
  groupName: string
  description: string
  caregivers?: CaregiverProps[]
  patients?: PatientProps[]
}

export type OrganizationProps = {
  id: string
  name: string
}

interface OrganizationsPropsResponse extends BaseApiResponse {
  response: OrganizationProps[]
}

interface CaregiversPropsResponse extends BaseApiResponse {
  response: CaregiverProps[]
}

interface PatientsPropsResponse extends BaseApiResponse {
  response: PatientProps[]
}

interface PatientPropsResponse extends BaseApiResponse {
  response: PatientProps
}

interface PatientGroupsPropsResponse extends BaseApiResponse {
  response: PatientGroupProps[]
}

interface PatientGroupPropsResponse extends BaseApiResponse {
  response: PatientGroupProps
}

interface OrganizationPropsResponse extends BaseApiResponse {
  response: OrganizationProps
}

const callApi = async ({ token, apiUrl, path, method, body }: ApiCalls) => {
  const url = `${apiUrl || API_URL}/${path}`

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }

  if (body)
    fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)

  console.log(body)

  try {
    const response = await fetch(url, fetchOptions)
    if (!response.ok) throw Error(`${response.status}|${response.statusText}`)
    const responseText = await response.text()
    return {
      error: false,
      response:
        responseText && responseText.length > 0 ? JSON.parse(responseText) : {},
    }
  } catch (e) {
    return {
      error: true,
      response: e,
    }
  }
}

export const getPatients = (
  accessToken: string,
): Promise<PatientsPropsResponse> =>
  callApi({ token: accessToken, path: 'users', method: 'GET' })

export const createPatient = (
  accesToken: string,
  patientProps: PatientProps,
): Promise<PatientPropsResponse> =>
  callApi({
    token: accesToken,
    path: 'users',
    method: 'POST',
    body: patientProps,
  })

export const getPatient = (id: string): Promise<PatientPropsResponse> =>
  callApi({ path: 'users', method: 'POST', body: id })

export const updatePatient = (
  accesToken: string,
  patient: PatientProps,
): Promise<PatientPropsResponse> =>
  callApi({
    token: accesToken,
    path: `users/${patient.id}`,
    method: 'PUT',
    body: patient,
  })

export const createOrganization = (
  accesToken: string,
  organizationProps: OrganizationProps,
): Promise<OrganizationPropsResponse> =>
  callApi({
    apiUrl: ORGANIZATION_API_URL,
    token: accesToken,
    path: 'organizations',
    method: 'POST',
    body: organizationProps,
  })

export const getOrganizations = (
  accessToken: string,
): Promise<OrganizationsPropsResponse> =>
  callApi({
    apiUrl: ORGANIZATION_API_URL,
    token: accessToken,
    path: 'organizations',
    method: 'GET',
  })

export const removeOrganization = (
  accessToken: string,
  id: string,
): Promise<OrganizationsPropsResponse> =>
  callApi({
    apiUrl: ORGANIZATION_API_URL,
    token: accessToken,
    path: `organizations/${id}`,
    method: 'DELETE',
  })

export const createPatientGroup = (
  accessToken: string,
  patientGroupProps: PatientGroupProps,
): Promise<PatientGroupPropsResponse> =>
  callApi({
    token: accessToken,
    path: `patient-groups`,
    method: 'POST',
    body: patientGroupProps,
  })

export const getPatientGroups = (
  accessToken: string,
): Promise<PatientGroupsPropsResponse> =>
  callApi({ token: accessToken, path: 'patient-groups', method: 'GET' })

export const updatePatientGroup = (
  accesToken: string,
  patientgroup: PatientGroupProps,
): Promise<PatientGroupPropsResponse> =>
  callApi({
    token: accesToken,
    path: `patient-groups/${patientgroup.id}`,
    method: 'PUT',
    body: patientgroup,
  })

export const removePatientGroup = (accessToken: string, id: string) =>
  callApi({
    token: accessToken,
    path: `patient-groups/${id}`,
    method: 'DELETE',
    body: id,
  })

export const getCaregiverPatientGroups = (
  accessToken: string,
  userId: string,
): Promise<PatientGroupsPropsResponse> =>
  callApi({
    token: accessToken,
    path: `patient-groups/caregivers/${userId}`,
    method: 'GET',
  })

export const getPatientGroupCaregivers = (
  accessToken: string,
  patientGroupID: string,
): Promise<CaregiversPropsResponse> =>
  callApi({
    token: accessToken,
    path: `patient-groups/${patientGroupID}/caregivers`,
    method: 'GET',
  })

export const caregiverLeaveGroup = (
  accessToken: string,
  groupId: string,
  userId: string,
) =>
  callApi({
    token: accessToken,
    path: `patient-groups/${groupId}/user`,
    method: 'DELETE',
    body: `"${userId}"`,
  })

export const caregiverJoinGroup = (
  accessToken: string,
  patientGroupID: string,
  userId: string,
) =>
  callApi({
    token: accessToken,
    path: `patient-groups/${patientGroupID}/user`,
    method: 'POST',
    body: `"${userId}"`,
  })

export const getPatientPatientGroups = (
  accessToken: string,
  userId: string,
): Promise<PatientGroupsPropsResponse> =>
  callApi({
    token: accessToken,
    path: `patient-groups/patients/${userId}`,
    method: 'GET',
  })

export const getPatientGroupPatients = (
  accessToken: string,
  patientGroupID: string,
): Promise<PatientsPropsResponse> =>
  callApi({
    token: accessToken,
    path: `patient-groups/${patientGroupID}/patients`,
    method: 'GET',
  })

export const patientLeaveGroup = (
  accessToken: string,
  groupId: string,
  userId: string,
) =>
  callApi({
    token: accessToken,
    path: `patient-groups/${groupId}/user`,
    method: 'DELETE',
    body: `"${userId}"`,
  })

export const patientJoinGroup = (
  accessToken: string,
  patientGroupID: string,
  userId: string,
) =>
  callApi({
    token: accessToken,
    path: `patient-groups/${patientGroupID}/user`,
    method: 'POST',
    body: `"${userId}"`,
  })
