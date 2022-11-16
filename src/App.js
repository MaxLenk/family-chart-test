import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { HashRouter as Router, Routes, Route}
    from 'react-router-dom';
import Login from './pages/login';
import FamilyTree from './pages/familyTree';
import Pictures from './pages/pictures';
import Picture from './pages/picture';
import People from './pages/people';
import Person from './pages/person';
  
function App() {
    const [loginToken, setLoginToken] = useState(localStorage.getItem("auth"));

    const authstore = localStorage.getItem("auth");

    useEffect(() => {
        localStorage.setItem('auth', loginToken)
    }, [loginToken]);

    if(!authstore) {
        return (
            <>
                <Login setLoginToken={setLoginToken} />
            </>
        );
    }

    return (
        <Router>
        <Navbar />
        <Routes>
            <Route path='/family-tree' element={<FamilyTree/>} />
            <Route path='/pictures' element={<Pictures/>} />
            <Route path='/picture' element={<Picture/>} />
            <Route path='/people' element={<People/>} />
            <Route path='/person' element={<Person/>} />
        </Routes>
        </Router>
    );
}
  
export default App;