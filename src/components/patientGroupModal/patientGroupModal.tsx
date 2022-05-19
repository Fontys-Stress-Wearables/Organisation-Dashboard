import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import {
  CaregiverGraphProps,
  caregiverLeaveGroup,
  CaregiverProps,
  getPatientGroupCaregivers, getPatientGroupPatients,
  PatientGroupProps, patientLeaveGroup, PatientProps
} from "../../utilities/api/calls";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import SearchIcon from "../caregivers/search_white_48dp.svg";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import AddIcon from "./group_add_white_24dp.svg";
import RemoveIcon from "./person_remove_white_24dp.svg";
import { callMsGraph } from "../../utilities/api/graph";

interface CaregiverDetailsProps {
  closeModal: () => void;
  show: boolean;
  patientGroup: PatientGroupProps | undefined;
}

const PatientGroupModal: React.FC<CaregiverDetailsProps> = ({ patientGroup, show, closeModal }) => {
  const { instance, accounts } = useMsal();

  const [search, setSearch] = useState("");
  const [searchPatientResults, setSearchPatientsResults] = useState<PatientProps[]>([]);
  const [searchCaregiversResults, setSearchCaregiversResults] = useState<CaregiverGraphProps[]>([]);

  const [patients, setPatients] = useState<PatientProps[]>([]);
  const [caregivers, setCaregivers] = useState<CaregiverGraphProps[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    setSearchCaregiversResults(caregivers.filter(p =>
      p.givenName.toLowerCase().includes(search.toLowerCase()) || p.surname.toLowerCase().includes(search.toLowerCase())
    ));

    setSearchPatientsResults(patients.filter(p =>
      p.firstName.toLowerCase().includes(search.toLowerCase()) || p.lastName.toLowerCase().includes(search.toLowerCase())
    ));
  }, [search, patients, caregivers]);

  useEffect(() => {
    if(patientGroup !== undefined && patientGroup.id !== undefined) {
      fetchPatientGroupCaregivers(patientGroup.id);
      fetchPatientGroupPatients(patientGroup.id);
    }
    else {
      setPatients([]);
      setCaregivers([]);
    }
  }, [patientGroup]);

  const request = {
    scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
    account: accounts[0]
  };

  const fetchPatientGroupCaregivers = (patientGroupId: string) => {
    instance.acquireTokenSilent(request).then((res: any) => {
      fetchPatientGroupCaregiversRequest(res.accessToken, patientGroupId)
    }).catch((e: any) => {
      instance.acquireTokenPopup(request).then((res: any) => {
        fetchPatientGroupCaregiversRequest(res.accessToken, patientGroupId)
      });
    });
  };

  const requestCaregivers = () : Promise<CaregiverGraphProps[]>=> {
    return new Promise<CaregiverGraphProps[]>((resolve, reject) => {
      const graphRequest = {
        scopes: ["User.Read"],
        account: accounts[0],
      }

      instance.acquireTokenSilent(graphRequest).then((response: any) => {
        callMsGraph(response.accessToken).then((response: CaregiverGraphProps[]) => {
          resolve(response);
        })
      }).catch((e: any) => {
        instance.acquireTokenPopup(graphRequest).then((response: any) => {
          callMsGraph(response.accessToken).then((response: any) => {
            resolve(response);
          })
        });
      });

    });
  }

  const fetchPatientGroupCaregiversRequest = (accessToken: string, patientGroupId: string) => {
    getPatientGroupCaregivers(accessToken, patientGroupId).then((response) => {
      if (!response.error) {
        const foundCaregivers = response.response;

        requestCaregivers().then((response: CaregiverGraphProps[]) => {
          const filteredCaregivers = response.filter(c => foundCaregivers.find(f => f.azureId === c.id) !== undefined);
          console.log(filteredCaregivers)
          setCaregivers([...filteredCaregivers]);
        });
      }
    }).catch((err) => {
      console.error("Error occurred while fetching caregivers for patient group", err);
    });
  }

  const fetchPatientGroupPatients = (patientGroupId: string) => {
      instance.acquireTokenSilent(request).then((res: any) => {
        fetchPatientGroupPatientsRequest(res.accessToken, patientGroupId)
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          fetchPatientGroupPatientsRequest(res.accessToken, patientGroupId)
        });
      });
  };

  const fetchPatientGroupPatientsRequest = (accessToken: string, patientGroupId: string) => {
    getPatientGroupPatients(accessToken, patientGroupId).then((response) => {
      if (!response.error) {
        const foundPatients = response.response;
        setPatients([...foundPatients]);
      }
    }).catch((err) => {
      console.error("Error occurred while fetching patients for patient group", err);
    });
  }

  const removeCaregiver = (caregiver: CaregiverGraphProps, patientGroup: PatientGroupProps) => {
    if(window.confirm(`Are you sure you want to remove ${caregiver.givenName} ${caregiver.surname} from the ${patientGroup.groupName}?`)) {
      instance.acquireTokenSilent(request).then((res: any) => {
        removeCaregiverRequest(res.accessToken, patientGroup.id!, caregiver.id!);
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          removeCaregiverRequest(res.accessToken, patientGroup.id!, caregiver.id!);
        });
      });
    }
  }

  const removeCaregiverRequest = (accessToken: string, patientGroupId: string, caregiverId: string) => {
      caregiverLeaveGroup(accessToken, patientGroupId, caregiverId).then((response) => {
        if (!response.error) {
            fetchPatientGroupCaregivers(patientGroupId);
            fetchPatientGroupPatients(patientGroupId);
        }
      }).catch((err) => {
        console.error("Error occurred while leaving patient group", err);
      });
  }

  const removePatient = (patient: PatientProps, patientGroup: PatientGroupProps) => {
    if(window.confirm(`Are you sure you want to remove ${patient?.firstName} ${patient?.lastName} from the ${patientGroup.groupName}?`)) {
      instance.acquireTokenSilent(request).then((res: any) => {
        removePatientRequest(res.accessToken, patientGroup.id!, patient.id!);
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          removePatientRequest(res.accessToken, patientGroup.id!, patient.id!);
        });
      });
    }
  }

  const removePatientRequest = (accessToken: string, patientGroupId: string, patientId: string) => {
    patientLeaveGroup(accessToken, patientGroupId, patientId).then((response) => {
      if (!response.error) {
          fetchPatientGroupCaregivers(patientGroupId);
          fetchPatientGroupPatients(patientGroupId);
      }
    }).catch((err) => {
      console.error("Error occurred while removing patient", err);
    });
  }

  return (
    <>
      <Modal size="xl" show={show} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{patientGroup && patientGroup.groupName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <InputGroup className="mb-3">
              <FormControl
                aria-label="Search"
                aria-describedby="basic-addon1"
                onChange={handleSearch}
              />
              <Button>
                <img src={SearchIcon}></img>
              </Button>
            </InputGroup>
          </div>
          <Table responsive striped bordered hover>
            <thead>
            <tr>
              <th>Caregivers</th>
              <th style={{ width: "10px" }}></th>
            </tr>
            </thead>
            <tbody>
            {searchCaregiversResults.map((caregiver: CaregiverGraphProps) => (
              <tr key={caregiver.id}>
                <td>{caregiver.givenName} {caregiver.surname}</td>
                <td style={{display: "flex"}}><Button onClick={() => removeCaregiver(caregiver, patientGroup!)} variant="danger" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} src={RemoveIcon}></img></Button></td>
              </tr>
            ))}
            </tbody>
          </Table>
          <Table responsive striped bordered hover>
            <thead>
            <tr>
              <th>Patients</th>
              <th style={{ width: "10px" }}></th>
            </tr>
            </thead>
            <tbody>
            {searchPatientResults.map((patient: PatientProps) => (
              <tr key={patient.id}>
                <td>{patient.firstName} {patient.lastName}</td>
                <td style={{display: "flex"}}><Button onClick={() => removePatient(patient, patientGroup!)} variant="danger" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} src={RemoveIcon}></img></Button></td>
              </tr>
            ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PatientGroupModal;