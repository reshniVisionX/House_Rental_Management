import React,{useState} from 'react';
import '../Styles/NavBar.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
axios.defaults.baseURL = 'http://localhost:4000'; 
axios.defaults.withCredentials = true; 

const Navbar = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleLogout = () => {
   
    axios.post('/user/logout')
      .then(res => {
        if (res.data.success) {
        
          setName('');
          localStorage.removeItem('wishProp');
          navigate('/login');
          alert('You are logged out successfully...');
        } else {
          console.log('Logout failed');
        }
      })
      .catch(err => {
        console.error('Error:', err);
      });
  };
  
  const handleLogin=()=>{
    navigate('/login');
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <img src="https://graphicsfamily.com/wp-content/uploads/edd/2020/04/house-apartment-logo-blue-png-transparent.png" onClick={()=>navigate('/')} alt="Company Logo" className="logo" />
          <span className="company-name"><span className='logo-span'>R</span >ent-<span className='logo-span'>E</span>asy</span>
        </div>

        <div className="navbar-right">
            <Link to="/buyer">Buyer</Link>
            <Link to="/seller">Seller</Link>
            <Link to="/contact">Contact</Link>

        </div>
        <div className='nav-btn'>
         <button className='btn' type='button' onClick={() => handleLogin()}>LogIn</button>
         <button className='btn' type='button' onClick={() => handleLogout()}>LogOut</button>
        </div>
      </nav>

      
    </div>
  );
};

export default Navbar;
