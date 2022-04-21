import { API_URL } from '../environment'

interface ApiCalls {
    token?: String
    path: String
    method: 'POST' | 'GET' | 'PUT' | 'DELETE'
    body?: string | PatientProps
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
    patientGroups?: PatientGroup[]
}

export type CaregiverProps = {
    id: string,
    firstName: string,
    lastName: string,
    emailAddress: number,
    isActive: boolean,
    isGuest: boolean,
    role: string,
    patientGroups: PatientGroup[]
}

export type PatientGroup = {
    id: string,
    groupName: string,
    description: string,
    caregivers: CaregiverProps[],
    patients: PatientProps[],
}

interface PatientsPropsResponse extends BaseApiResponse {
    response: PatientProps[]
}

interface PatientPropsResponse {
    response: PatientProps
}

const callApi = async ({ token, path, method, body }: ApiCalls) => {
    const url = `${API_URL}/${path}`

    const fetchOptions: RequestInit = {
        method,
        headers: { 
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }
    }

    if (body) fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body)

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

export const createPatient = (PatientProps: PatientProps): Promise<PatientsPropsResponse> => {
    return callApi({ path: 'patients', method: 'POST', body: PatientProps })
}

export const getPatient = (id: string): Promise<PatientPropsResponse> => {
    return callApi({ path: 'patients', method: 'POST', body: id })
}

// export const getCaregivers = () : Promise<> =>{
//     return callApi({path: 'caregivers', method: 'GET'})
// }

// export const createCaregivers = () : Promise<> =>{
//     return callApi({path: 'caregivers', method: 'POST'})
// }

// export const getCaregiver = (id) : Promise<> =>{
//     return callApi({path: 'patients', method: 'GET'})
// }

// export const getPatientGroups = () : Promise<> =>{
//     return callApi({path: 'patient-groups', method: 'GET'})
// }

// export const createPatientGroup = () : Promise<> =>{
//     return callApi({path: 'patient-groups', method: 'POST'})
// }

// export const getPatientGroup = () : Promise<> =>{
//     return callApi({path: 'patient-groups', method: 'GET'})
// }

// export const addPatient = (id) : Promise<> =>{
//     return callApi({path: `patient-groups/${id}/patient`, method: 'POST'})
// }

// export const addCaregiver = (id) : Promise<> =>{
//     return callApi({path: `groups/${id}/caregiver`, method: 'POST'})
// }