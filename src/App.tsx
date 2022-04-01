import './App.css';
import {Routes, Route, Link} from "react-router-dom";
import SignIn from './components/signin/signin';
import Home from './components/home/home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/signin" element={<SignIn/>}/>
      </Routes>
    </div>
  );
}

export default App;
