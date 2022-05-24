import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import {
  CaregiverGraphProps, caregiverJoinGroup, caregiverLeaveGroup,
  getCaregiverPatientGroups,
  getPatientGroups,
  PatientGroupProps,
} from "../../utilities/api/calls";
import { REACT_APP_AUTH_REQUEST_SCOPE_URL } from "../../utilities/environment";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import SearchIcon from "../caregivers/search_white_48dp.svg";
import Table from "react-bootstrap/Table";
import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import AddIcon from "./group_add_white_24dp.svg";
import RemoveIcon from "./group_remove_white_24dp.svg";

interface CaregiverDetailsProps {
  closeModal: () => void;
  show: boolean;
  caregiver: CaregiverGraphProps | undefined;
}

const CaregiverPatientGroupModal: React.FC<CaregiverDetailsProps> = ({ caregiver, show, closeModal }) => {
  const { instance, accounts } = useMsal();

  const [search, setSearch] = useState("");
  const [searchAllResults, setSearchAllResults] = useState<PatientGroupProps[]>([]);
  const [searchCaregiversResults, setSearchCaregiversResults] = useState<PatientGroupProps[]>([]);


  const [patientGroups, setPatientGroups] = useState<PatientGroupProps[]>([]);
  const [caregiversGroups, setCaregiversGroups] = useState<PatientGroupProps[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  useEffect(() => {

    setSearchCaregiversResults(caregiversGroups.filter(p =>
      p.groupName.toLowerCase().includes(search.toLowerCase())
    ));

    var otherGroups = patientGroups.filter(p =>
      p.groupName.toLowerCase().includes(search.toLowerCase())
    ).filter(p => caregiversGroups.find(c => c.id === p.id) === undefined);

    setSearchAllResults(otherGroups);
  }, [search, patientGroups, caregiversGroups]);

  useEffect(() => {
    if(caregiver !== undefined) {
      fetchCaregiverPatientGroups(caregiver.id);
      fetchPatientGroups();
    }
  }, [caregiver]);

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

  const fetchCaregiverPatientGroups = (caregiverId: string) => {
      instance.acquireTokenSilent(request).then((res: any) => {
        getCaregiverPatientGroups(res.accessToken, caregiverId).then((response) => {
          if (!response.error) {
            const foundPatientGroups = response.response;
            setCaregiversGroups(foundPatientGroups);
          }
        }).catch((err) => {
          console.error("Error occurred while fetching patient groups", err);
        });
      }).catch((e: any) => {
        instance.acquireTokenPopup(request).then((res: any) => {
          getCaregiverPatientGroups(res.accessToken, caregiverId).then((response) => {
            if (!response.error) {
              const foundPatientGroups = response.response;
              setCaregiversGroups(foundPatientGroups);
            }
          }).catch((err) => {
            console.error("Error occurred while fetching patient groups", err);
          });
        });
      });
  };

  const joinGroup = (group: PatientGroupProps) => {
    instance.acquireTokenSilent(request).then((res: any) => {
      if (group.id != null && caregiver?.id != null) {
        joinGroupRequest(res.accessToken, group.id, caregiver.id);
      }
    }).catch((e: any) => {
      instance.acquireTokenPopup(request).then((res: any) => {
        if (group.id != null && caregiver?.id != null) {
          joinGroupRequest(res.accessToken, group.id, caregiver.id);
        }
      });
    });
  }

  const joinGroupRequest = (accessToken: string, groupId: string, caregiverId: string) => {
    caregiverJoinGroup(accessToken, groupId, caregiverId).then((response) => {
      if (!response.error) {
        fetchCaregiverPatientGroups(caregiverId);
        fetchPatientGroups();
      }
    }).catch((err) => {
      console.error("Error occurred while joining patient group", err);
    });
  }

  const leaveGroup = (group: PatientGroupProps) => {
    if(window.confirm(`Are you sure you want to remove ${caregiver?.givenName} from the ${group.groupName}?`)) {
        instance.acquireTokenSilent(request).then((res: any) => {
          if (group.id != null && caregiver?.id != null) {
            caregiverLeaveGroup(res.accessToken, group.id, caregiver?.id).then((response) => {
              if (!response.error) {
                fetchCaregiverPatientGroups(caregiver.id);
                fetchPatientGroups();
              }
            }).catch((err) => {
              console.error("Error occurred while leaving patient group", err);
            });
          }
        }).catch((e: any) => {
          instance.acquireTokenPopup(request).then((res: any) => {
            if (group.id != null && caregiver?.id != null) {
              caregiverLeaveGroup(res.accessToken, group.id, caregiver?.id).then((response) => {
                if (!response.error) {
                  fetchCaregiverPatientGroups(caregiver.id);
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
          <Modal.Title>{caregiver && caregiver.givenName} {caregiver && caregiver.surname}</Modal.Title>
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
              <th>{caregiver?.givenName}'s Groups</th>
              <th style={{ width: "10px" }}></th>
            </tr>
            </thead>
            <tbody>
            {searchCaregiversResults.map((patientGroup: PatientGroupProps) => (
              <tr key={patientGroup.id}>
                <td>{patientGroup.groupName}</td>
                <td style={{display: "flex"}}><Button onClick={() => leaveGroup(patientGroup)} variant="danger" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} src={RemoveIcon}></img></Button></td>
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
                <td style={{display: "flex"}}><Button onClick={() => joinGroup(patientGroup)} variant="success" style={{display: "flex", marginLeft: "auto", width: "36px", justifyContent: "center"}}><img style={{margin: "auto"}} src={AddIcon}></img></Button></td>
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

export default CaregiverPatientGroupModal;