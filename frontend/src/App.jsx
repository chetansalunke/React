import { Routes, Route, Link } from "react-router-dom";
import Teams from "./pages/Teams";
import Employees from "./pages/Employees";

function App() {
  return (
    <div>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Teams
        </Link>
        <Link to="/employees">Employees</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Teams />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>
    </div>
  );
}

export default App;
