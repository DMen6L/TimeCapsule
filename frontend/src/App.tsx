import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Registration from './Registration-Login/Registration.tsx'
import Login from "./Registration-Login/Login.tsx";
import VerifyEmailNotice from "./Registration-Login/VerifyEmailNotice.tsx";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-red-200 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-xl rounded-xl">
          <Routes>
            <Route path="/register" element={<Registration />} />
            <Route path="/verify-email" element={<VerifyEmailNotice />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/register" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
