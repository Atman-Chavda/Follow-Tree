import React from 'react';
import Login from './pages/login.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Post from './pages/post.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </Router>
  );
}

export default App;
