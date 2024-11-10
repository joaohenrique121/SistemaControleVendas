import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Login.jsx";
import {AuthProvider} from "./authentication/AuthProvider.jsx";
import ProtectedRoute from "./authentication/ProtectedRoute.jsx";
import Dashboard from "./Dashboard.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/"/>
                    <Route path="login" element={<Login />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
