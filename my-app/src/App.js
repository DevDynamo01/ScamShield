import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import { FirebaseContext } from "./ContextFol/FirebaseProvider";
import Signup from "./ComponentsFol/Signup";
import Login from "./ComponentsFol/Login";
import HomePage from "./ComponentsFol/HomePage";
import Navbar from "./ComponentsFol/Navbar";
import DetectionOptions from "./ComponentsFol/DetectionOptions";
import AudioFraudDetection from "./ComponentsFol/AudioFraudDetection";
import Transcription from "./components/Transcription";
import Dictaphone from "./Components2/Dictaphone";
import { SocketProvider } from "./AppContext/SocketContext";

const App = () => {
  const { user, logout } = useContext(FirebaseContext);

  return (
    <>
      <Navbar />
      <Router>
        {/* <nav>
        {user ? (
          <Navbar />
        ) : (
          <div>
            <Link to="/signup">Signup</Link>
            <Link to="/login">Login</Link>
          </div>
        )}
      </nav> */}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              user ? <h1>Dashboard</h1> : <Navigate to="/login" replace />
            }
          />
          {user && <Route path="/home" element={<HomePage />} />}
          <Route path="/detection" element={<DetectionOptions />} />
          <Route path="/audio-detection" element={<Transcription />} />
          <Route
            path="/live-detection"
            element={
              <SocketProvider>
                <Dictaphone></Dictaphone>
              </SocketProvider>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
