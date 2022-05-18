import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/esm/Accordion";
import Alert from "react-bootstrap/esm/Alert";
import { CaregiverGraphProps, CaregiverProps } from "../../utilities/api/calls";
import { Searchbar } from "../searchbar";
import styles from "./caregivers.module.scss"
import { callMsGraph } from "../../utilities/api/graph";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import CaregiverTable from "./table";
import { CreatePatientGroupModal } from "../createPatientGroupModal";
import CaregiverDetailsModal from "../caregiverDetailsModal/caregiverDetailsModal";

const Caregivers = () => {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

    const [caregiver, setCaregiver] = useState<CaregiverGraphProps>();
    const [caregivers, setCaregivers] = useState<CaregiverGraphProps[]>([]);

  useEffect(() => {
    requestCaregivers()
  }, []);

  const requestCaregivers = () => {
    const graphRequest = {
      scopes: ["User.Read"],
      account: accounts[0],
    }

    instance.acquireTokenSilent(graphRequest).then((response: any) => {
      callMsGraph(response.accessToken).then((response: CaregiverGraphProps[]) => {
        setCaregivers(response)
      })
    }).catch((e: any) => {
      instance.acquireTokenPopup(graphRequest).then((response: any) => {
        callMsGraph(response.accessToken).then((response: any) => {
          setCaregivers(response)
        })
      });
    });
  }

    return(
        <div className={styles.container}>
            <div>
                <div className={styles.accordion}>
                    <Accordion defaultActiveKey="0">
                    {caregivers && caregivers.length ? (
                        <CaregiverTable caregivers={caregivers}/>
                    ) : (
                        <div>
                        <Alert variant="primary">No caregivers found</Alert>
                        </div>
                    )}
                    </Accordion>
                </div>
            </div> 
     </div>
    );
}

export default Caregivers