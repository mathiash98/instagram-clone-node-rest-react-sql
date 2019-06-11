import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { library as fa_library } from '@fortawesome/fontawesome-svg-core';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart, faComment } from '@fortawesome/free-regular-svg-icons';
import './App.css';

import Header from './components/header/Header';
import Upload from './components/upload/Upload';
import Index from './views/index/Index';
import Login from './views/login/Login';
import Profile from './views/profile/Profile';

// Add the fontAwesome icons
fa_library.add(fasHeart, farHeart, faComment);

function App() {
  return (
    <Router>
      <Header></Header>
      <Route path="/" exact component={Index}></Route>
      <Route path="/user/:id" exact component={Profile}></Route>
      <Route path="/login" exact component={Login}></Route>
      <Route path="/upload" exact component={Upload}></Route>
    </Router>
  );
}

export default App;
