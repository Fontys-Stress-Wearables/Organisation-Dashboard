import './App.css';
import {Routes, Route} from "react-router-dom";
import {Header} from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SignIn } from './components/signin';
import { Home } from './components/home';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
