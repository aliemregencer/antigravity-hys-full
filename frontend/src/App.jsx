import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AppointmentList from './pages/AppointmentList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/randevu/yeni" element={<Home />} />
            <Route path="/randevu/listesi" element={<AppointmentList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
