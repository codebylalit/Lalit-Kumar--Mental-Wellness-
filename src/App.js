import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import Dashboard from "./components/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
