import './App.css';
import {Routes, Route, Link} from "react-router-dom";
import {Header} from './components/header';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
        <Header/>
      {/* <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/signin" element={<SignIn/>}/>
      </Routes> */}
    </div>
  );
}

export default App;
