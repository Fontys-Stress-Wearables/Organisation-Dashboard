import { API_URL, ORGANIZATION_API_URL } from '../environment'

interface ApiCalls {
    token?: String
    apiUrl?: String
    path: String
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
    body?: string | PatientProps | OrganizationProps | PatientGroupProps
}

interface BaseApiResponse {
    error: boolean
    errorCode?: string | null
    errorMessage?: string
}

export type PatientProps = {
    id?: string,
    firstName: string,
    lastName: string,
    birthdate: string,
    isActive?: boolean,
    patientGroups?: PatientGroupProps[]
}

export type XPatientProps = {
    id: string,
    firstName: string,
    lastName: string,
    birthdate: string,
    isActive?: boolean,
    patientGroups?: PatientGroupProps[]
}

export type CaregiverProps = {
    id: string,
    firstName: string,
    lastName: string,
    emailAddress: number,
    isActive: boolean,
    isGuest: boolean,
    role: string,
    patientGroups: PatientGroupProps[]
    azureId: string
}

export type CaregiverGraphProps = {
    displayName: string,
    givenName: string,
    id: string,
    jobTitle: string,
    mail: string | null,
    mobilePhone: string | null,
    officeLocation: string | null,
    preferrendLanguage: string | null,
    surname: string,
    userPrincipalName: string
}

export type PatientGroupProps = {
    id?: string,
    groupName: string,
    description: string,
    caregivers?: CaregiverProps[],
    patients?: PatientProps[],
}

export type OrganizationProps = {
    id: string,
    name: string,
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
    const url = `${apiUrl ? apiUrl : API_URL}/${path}`

    const fetchOptions: RequestInit = {
        method,
        headers: { 
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }
    }

    if (body) fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)

    console.log(body)

    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok)
            throw Error(`${response.status}|${response.statusText}`);
        const response_1 = await response.text();
        return ({
            error: false,
            response: response_1 && response_1.length > 0 ? JSON.parse(response_1) : {}
        });
    } catch (e) {
        return {
            error: true,
            response: e
        };
    }
}

export const getPatients = (accessToken: string): Promise<PatientsPropsResponse> => {
    return callApi({ token: accessToken, path: 'patients', method: 'GET' })
}

export const createPatient = (accesToken: string, patientProps: PatientProps): Promise<PatientPropsResponse> => {
    return callApi({ token: accesToken, path: 'patients', method: 'POST', body: patientProps })
}

export const getPatient = (id: string): Promise<PatientPropsResponse> => {
    return callApi({ path: 'patients', method: 'POST', body: id })
}

export const updatePatient = (accesToken: string, patient: PatientProps) : Promise<PatientPropsResponse> => {
    return callApi({token: accesToken, path: `patients/${patient.id}`, method: 'PUT', body: patient})
}

export const createOrganization = (accesToken: string, organizationProps: OrganizationProps): Promise<OrganizationPropsResponse> => {
    return callApi({ apiUrl: ORGANIZATION_API_URL, token: accesToken, path: 'organizations', method: 'POST', body: organizationProps })
}

export const getOrganizations = (accessToken: string): Promise<OrganizationsPropsResponse> => {
    return callApi({ apiUrl: ORGANIZATION_API_URL, token: accessToken, path: 'organizations', method: 'GET' })
}

export const removeOrganization = (accessToken: string, id: string): Promise<OrganizationsPropsResponse> => {
    return callApi({ apiUrl: ORGANIZATION_API_URL, token: accessToken, path: `organizations/${id}`, method: 'DELETE' })
}

export const createPatientGroup = (accessToken: string, patientGroupProps: PatientGroupProps) : Promise<PatientGroupPropsResponse> =>{
    return callApi({token: accessToken, path: `patient-groups`, method: 'POST', body: patientGroupProps})
}

export const getPatientGroups = (accessToken: string) : Promise<PatientGroupsPropsResponse> =>{
    return callApi({token: accessToken, path: 'patient-groups', method: 'GET'})
}

export const updatePatientGroup = (accesToken: string, patientgroup: PatientGroupProps) : Promise<PatientGroupPropsResponse> => {
    return callApi({token: accesToken, path: `patient-groups/${patientgroup.id}`, method: 'PUT', body: patientgroup})
}

export const removePatientGroup = (accessToken: string, id: string) => {
    return callApi({token: accessToken, path: `patient-groups/${id}`, method: 'DELETE', body: id})
}

export const getCaregiverPatientGroups = (accessToken: string, caregiverId: string) : Promise<PatientGroupsPropsResponse> =>{
    return callApi({token: accessToken, path: `patient-groups/caregivers/${caregiverId}`, method: 'GET'})
}

export const getPatientGroupCaregivers = (accessToken: string, patientGroupId: string) : Promise<CaregiversPropsResponse> =>{
    return callApi({token: accessToken, path: `patient-groups/${patientGroupId}/caregivers`, method: 'GET'})
}

export const caregiverLeaveGroup = (accessToken: string, groupId: string, caregiverId: string) => {
    return callApi({token: accessToken, path: `patient-groups/${groupId}/caregiver`, method: 'DELETE', body: `"${caregiverId}"`})
}

export const caregiverJoinGroup = (accessToken: string, groupId: string, caregiverId: string) => {
      return callApi({token: accessToken, path: `patient-groups/${groupId}/caregivers`, method: 'POST', body: `"${caregiverId}"`})
}

export const getPatientPatientGroups = (accessToken: string, patientId: string) : Promise<PatientGroupsPropsResponse> =>{
    return callApi({token: accessToken, path: `patient-groups/patients/${patientId}`, method: 'GET'})
}

export const getPatientGroupPatients = (accessToken: string, patientGroupId: string) : Promise<PatientsPropsResponse> =>{
    return callApi({token: accessToken, path: `patient-groups/${patientGroupId}/patients`, method: 'GET'})
}

export const patientLeaveGroup = (accessToken: string, groupId: string, patientId: string) => {
    return callApi({token: accessToken, path: `patient-groups/${groupId}/patient`, method: 'DELETE', body: `"${patientId}"`})
}

export const patientJoinGroup = (accessToken: string, groupId: string, patientId: string) => {
    return callApi({token: accessToken, path: `patient-groups/${groupId}/patients`, method: 'POST', body: `"${patientId}"`})
}
