import './App.css';
import {Routes, Route} from "react-router-dom";
import {Header} from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SignIn } from './components/signin';
import { Patients } from './components/patients';
import { Caregivers } from './components/caregivers';
import { PatientGroups } from './components/patient-groups';
import { Home } from './components/home';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/patients" element={<Patients/>}/>
        <Route path="/caregivers" element={<Caregivers/>}/>
        <Route path="/patient-groups" element={<PatientGroups/>}/>
      </Routes>
    </div>
  );
}

export default App;
