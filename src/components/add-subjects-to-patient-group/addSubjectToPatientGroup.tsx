// import React, { useCallback, useEffect, useState } from "react";
// import Button from "react-bootstrap/esm/Button";
// import Form from "react-bootstrap/esm/Form";
// import Modal from "react-bootstrap/esm/Modal";
// import { CaregiverProps, createPatientGroup, PatientGroupProps } from "../../utilities/api/calls";
// import AddIcon from "./group_add.svg";
// import { useMsal } from "@azure/msal-react";
// import Dropdown from "react-bootstrap/esm/Dropdown";
// import { callMsGraph } from "../../utilities/api/graph";

// interface  ICreatePatientGroupModalProps {
//   update: boolean,
//   updatePatientGroupTable: (arg: boolean) => void
// }

// const CreatePatientGroupModal: React.FC<ICreatePatientGroupModalProps> = ({ update, updatePatientGroupTable }) => {
//     const [error, setError] = useState(false);
//     const [show, setShow] = useState(false);
//     const [patientGroup, setPatientGroup] = useState<PatientGroupProps>();
//     const handleClose = () => setShow(false);
//     const handleShow = () => setShow(true);
//     const { instance, accounts } = useMsal();
//     const [caregivers, setCaregivers] = useState<CaregiverProps[]>([]);
//     const [selectedCaregivers, setSelectedCaregivers] = useState([]);

//     const request = {
//       scopes: ["api://5720ed34-04b7-4397-9239-9eb8581ce2b7/access_as_caregiver", "User.Read"],
//       account: accounts[0]
//     };
    
//     useEffect(() => {
//       requestCaregivers()
//     }, [error]);

//     const requestCaregivers = () => {
//       const graphRequest = {
//         scopes: ["User.Read"],
//         account: accounts[0],
//       }
  
//       instance.acquireTokenSilent(graphRequest).then((response: any) => {
//         callMsGraph(response.accessToken).then((response: any) => {
//           if(response.error){
//             setError(true)
//           } else {
//             const resCaregivers = response.response
//             setError(false)
//             setCaregivers(resCaregivers)
//             console.log(caregivers)
//           }
//           console.log(response)
//         })
//       }).catch((e: any) => {
//         instance.acquireTokenPopup(graphRequest).then((response: any) => {
//           callMsGraph(response.accessToken).then((response: any) => {
//             if(response.error){
//               setError(true)
//             } else {
//               const resCaregivers = response.response
//               setError(false)
//               setCaregivers(resCaregivers)
//             }
//           })
//         });
//       });
//     }

//     function handleSubmit(){
      
//       setPatientGroup(handlePatientGroup);

//       instance.acquireTokenSilent(request).then((res: any) => {
//         console.log(patientGroup);
//         createPatientGroup(res.accessToken, handlePatientGroup).then((response) => {
//           if(response.error){
//             setError(true)
//           } else {
//             const resPatientGroup = response.response
//             setError(false)
//             setPatientGroup(resPatientGroup)
//             console.log(resPatientGroup)
//           }
//         }).catch((err) => {
//           console.error('Error occured while creating patient group', err)
//           setError(true)
//         })
//       }).catch((error) => {
//         instance.acquireTokenPopup(request).then((res: any) => {
//           createPatientGroup(res.accessToken, handlePatientGroup).then((response) => {
//             if(response.error){
//               setError(true)
//             } else {
//               const resPatientGroup = response.response
//               setError(false)
//               setPatientGroup(resPatientGroup)
//             }
//           }).catch((err) => {
//             console.error('Error occured while creating patient group', err)
//             setError(true)
//           })
//         });
//       });  

//       handleClose();
//     }

//     return (
//       <>
//         <Button variant="success" onClick={handleShow}>
//            Add patient-group <img src={AddIcon}></img> 
//         </Button>
//         <Modal show={show} onHide={handleClose}>
//           <Modal.Header closeButton>
//             <Modal.Title>Create a new patient-group in the system</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               <Form.Group className="mb-3" controlId="create-patient-group.caregiver">
//                 <Form.Label>Caregiver</Form.Label>
//                     <Dropdown>
//                       <Dropdown.Toggle variant="success" id="dropdown-basic">
//                         Select Caregivers
//                       </Dropdown.Toggle>

//                       <Dropdown.Menu>{caregivers.map((caregiver : CaregiverProps) =>(
//                         <Dropdown.Item>{caregiver.firstName}</Dropdown.Item>
//                       ))}
//                       </Dropdown.Menu>
//                     </Dropdown>

//               </Form.Group>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//               Close
//             </Button>
//             <Button variant="primary" onClick={() => handleSubmit()}>
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </>
//     );
//   }
  
// export default CreatePatientGroupModal

export default{}