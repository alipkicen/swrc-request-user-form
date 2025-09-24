import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/TaskRequestForm";
import Executors from "./pages/RequestsDashboard";
import ExecutorMetrics from "./pages/ExecutorMetrics";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/executors" element={<Executors />} />
          <Route path="/metrics" element={<ExecutorMetrics />} />
          {/* Redirect all unknown routes to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
