import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import {
  patientJoinGroup, patientLeaveGroup,
  getPatientPatientGroups,
  getPatientGroups,
  PatientGroupProps,
  PatientProps
} from "../../utilities/api/calls";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import SearchIcon from "../caregivers/search_white_48dp.svg";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import AddIcon from "./group_add_white_24dp.svg";
import RemoveIcon from "./group_remove_white_24dp.svg";
import { REACT_APP_AUTH_REQUEST_SCOPE_URL } from "../../utilities/environment";

interface PatientDetailsProps {
  closeModal: () => void;
  show: boolean;
  patient: PatientProps | undefined;
}

const PatientPatientGroupModal: React.FC<PatientDetailsProps> = ({ patient, show, closeModal }) => {
  const { instance, accounts } = useMsal();
  const [search, setSearch] = useState("");
  const [searchAllResults, setSearchAllResults] = useState<PatientGroupProps[]>([]);
  const [searchPatientsResults, setSearchPatientsResults] = useState<PatientGroupProps[]>([]);

  const [patientGroups, setPatientGroups] = useState<PatientGroupProps[]>([]);
  const [patientsGroups, setPatientsGroups] = useState<PatientGroupProps[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {

    setSearchPatientsResults(patientsGroups.filter(p =>
      p.groupName.toLowerCase().includes(search.toLowerCase())
    ));

    var otherGroups = patientGroups.filter(pg =>
      pg.groupName.toLowerCase().includes(search.toLowerCase())
    ).filter(pg => patientsGroups.find(p => p.id === pg.id) === undefined);

    setSearchAllResults(otherGroups);
  }, [search, patientGroups, patientsGroups]);

  useEffect(() => {
    if(patient?.id){
      fetchPatientPatientGroups(patient.id);
      fetchPatientGroups();
    }
  }, [patient]);

  const request = {
    scopes: [REACT_APP_AUTH_REQUEST_SCOPE_URL, "User.Read"],
    account: accounts[0]
  };

  const fetchPatientGroups = () => {
    instance.acquireTokenSilent(request).then((res: any) => {
      getPatientGroups(res.accessToken).then((response) => {
        if (!response.error) {
          const foundPatientGroups = response.response;
          setPatientGroups([...foundPatientGroups]);
        }
      }).catch((err) => {
        console.error("Error occurred while fetching patient groups", err);
      });
    }).catch((e: any) => {
      instance.acquireTokenPopup(request).then((res: any) => {
        getPatientGroups(res.accessToken).then((response) => {
          if (!response.error) {
            const foundPatientGroups = response.response;
            setPatientGroups([...foundPatientGroups]);
          }
        }).catch((err) => {
          console.error("Error occurred while fetching patient groups", err);
        });
      });
    });
  };

  const fetchPatientPatientGroups = (patientId: string) => {
      instance.acquireTokenSilent(request).then((res: any) => {
        getPatientPatientGroups(res.accessToken, patientId).then((response) => {
          if (!response.error) {
            const foundPatientGroups = response.response;
            setPatientsGroups(foundPatientGroups);
          }
        }).catch((err) => {
          console.error("Error occurred while fetching patient groups", err);
        });
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          getPatientPatientGroups(res.accessToken, patientId).then((response) => {
            if (!response.error) {
              const foundPatientGroups = response.response;
              setPatientsGroups(foundPatientGroups);
            }
          }).catch((err) => {
            console.error("Error occurred while fetching patient groups", err);
          });
        });
      });
  };

  const joinGroup = (group: PatientGroupProps) => {
    instance.acquireTokenSilent(request).then((res: any) => {
      if (group.id != null && patient?.id != null) {
        patientJoinGroup(res.accessToken, group.id, patient.id).then((response) => {
          if (!response.error && patient?.id) {
            fetchPatientPatientGroups(patient.id);
            fetchPatientGroups();
          }
        }).catch((err) => {
          console.error("Error occurred while joining patient group", err);
        });
      }
    }).catch((e: any) => {
      instance.acquireTokenPopup(request).then((res: any) => {
        if (group.id != null && patient?.id != null) {
          patientJoinGroup(res.accessToken, group.id, patient.id).then((response) => {
            if (group.id != null && patient?.id != null) {
              fetchPatientPatientGroups(patient.id);
              fetchPatientGroups();
            }
          }).catch((err) => {
            console.error("Error occurred while joining patient group", err);
          });
        }
      });
    });
  }

  const leaveGroup = (group: PatientGroupProps) => {
    if(window.confirm(`Are you sure you want to remove ${patient?.firstName} from the ${group.groupName}?`)) {
        instance.acquireTokenSilent(request).then((res: any) => {
          if (group.id != null && patient?.id != null) {
            patientLeaveGroup(res.accessToken, group.id, patient?.id).then((response) => {
              if (!response.error) {
                fetchPatientPatientGroups(patient.id? patient.id : "1");
                fetchPatientGroups();
              }
            }).catch((err) => {
              console.error("Error occurred while leaving patient group", err);
            });
          }
        }).catch((e: any) => {
          instance.acquireTokenPopup(request).then((res: any) => {
            if (group.id != null && patient?.id != null) {
              patientLeaveGroup(res.accessToken, group.id, patient?.id).then((response) => {
                if (!response.error) {
                  fetchPatientPatientGroups(patient.id? patient.id : "1");
                  fetchPatientGroups();
                }
              }).catch((err) => {
                console.error("Error occurred while leaving patient group", err);
              });
            }
          });
        });
    }
  }

  return (
    <>
      <Modal size="xl" show={show} onHide={closeModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{patient && patient.firstName} {patient && patient.lastName}</Modal.Title>
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
              <th>{patient?.firstName}'s Groups</th>
              <th style={{ width: "10px" }}></th>
            </tr>
            </thead>
            <tbody>
            {searchPatientsResults.map((patientGroup: PatientGroupProps) => (
              <tr key={patientGroup.id}>
                <td>{patientGroup.groupName}</td>
                <td style={{display: "flex"}}><Button onClick={() => leaveGroup(patientGroup)} variant="danger" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} alt="removeicon" src={RemoveIcon}></img></Button></td>
              </tr>
            ))}
            </tbody>
          </Table>
          <Table responsive striped bordered hover>
            <thead>
            <tr>
              <th>Other Groups</th>
              <th style={{ width: "10px" }}></th>
            </tr>
            </thead>
            <tbody>
            {searchAllResults.map((patientGroup: PatientGroupProps) => (
              <tr key={patientGroup.id}>
                <td>{patientGroup.groupName}</td>
                <td style={{display: "flex"}}><Button onClick={() => joinGroup(patientGroup)} variant="success" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} alt="addicon" src={AddIcon}></img></Button></td>
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

export default PatientPatientGroupModal;