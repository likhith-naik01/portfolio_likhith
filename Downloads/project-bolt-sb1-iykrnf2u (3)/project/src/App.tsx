import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer-section';
import { Contact } from '@/pages/Contact';
import { Services } from '@/pages/Services';
import { Home } from '@/pages/Home';
import './styles/loader.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;