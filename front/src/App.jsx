import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage/RegistrationPage";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Footer } from "./components/Footer/Footer";
import { HomePage } from "./pages/HomePage/HomePage";
import { UserManagementPage } from "./pages/UserManagementPage/UserManagementPage";
import Content from "./routes/Content";
import Run from "./pages/Run/Run";
import Edit from "./pages/Edit/Edit";
import Results from "./pages/Results/Results";
import Surveys from "./pages/Surveys/Surveys";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import DashboardLayout from "./routes/DashboardLayout";
import ProfileSalesforce from "./pages/ProfileSalesforce/ProfileSalesforce";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200
                        dark:from-gray-900 dark:to-gray-800
                        transition-colors duration-300">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="run/:id" element={<Run />} />
                  <Route path="edit/:id" element={<Edit />} />
                </Route>
                <Route path="/user-management" element={<UserManagementPage />} />
                <Route path="/content" element={<Content />}>
                  <Route index element={<Surveys />} />
                  <Route path="run/:id" element={<Run />} />
                  <Route path="edit/:id" element={<Edit />} />
                  <Route path="results/:id" element={<Results />} />
                  <Route path="*" element={<div>404 - Not Found</div>} />
                </Route>
                <Route path="/profile/salesforce" element={<ProfileSalesforce />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;