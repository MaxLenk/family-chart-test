import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import FamilyTree from './pages/familyTree';
import Pictures from './pages/pictures';
import Picture from './pages/picture';
  
function App() {
return (
    <Router>
    <Navbar />
    <Routes>
        <Route path='/family-tree' element={<FamilyTree/>} />
        <Route path='/pictures' element={<Pictures/>} />
        <Route path='/picture' element={<Picture/>} />
    </Routes>
    </Router>
);
}
  
export default App;