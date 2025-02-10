import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage/RegistrationPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;