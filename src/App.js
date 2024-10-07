import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs.js';
import ContactUs from './pages/ContactUs.js';
import Login from './pages/Login.js';
import { AppProvider } from './AppContext.js';
import Explore from './pages/Explore.js';
import Profile from './pages/Profile.js';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/contact-us' element={<ContactUs />} />
          <Route path='/login' element={<Login />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
