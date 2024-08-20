import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Components/HomeComponent/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./Components/LoginComponent/Login";
import Registration from "./Components/RegistrationComponent/Registration";
import ProfileCard from "./Components/ProfileComponent/ProfileCard";
import Navbar from "./Components/NavbarComponent/Navbar";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App-container">
          <div className="App card">
            <div className="navbar-wrapper">
              <Navbar />
            </div>
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/profile" element={<ProfileCard />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
