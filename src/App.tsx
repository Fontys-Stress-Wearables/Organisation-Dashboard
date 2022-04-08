import './App.css';
import {Routes, Route} from "react-router-dom";
import {Header} from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SignIn } from './components/signin';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
      </Routes>
    </div>
  );
}

export default App;
