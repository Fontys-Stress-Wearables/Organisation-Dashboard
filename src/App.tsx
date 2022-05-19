import './App.css';
import {Routes, Route, Navigate} from "react-router-dom";
import {Header} from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Patients } from './components/patients';
import { Caregivers } from './components/caregivers';
import { PatientGroups } from './components/patient-groups';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/patients" element={<Patients/>}/>
        <Route path="/caregivers" element={<Caregivers/>}/>
        <Route path="/patient-groups" element={<PatientGroups/>}/>
        <Route
          path="*"
          element={<Navigate to="/patients" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
