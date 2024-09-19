import React, { useState } from 'react';
import '../Styles/Register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000'; 
axios.defaults.withCredentials = true; 

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    mobile: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword:'',
    mobile: '',
    exist:''
  });

  const handleValidation = () => {
    let errors = {};
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(values.email)) {
      errors.email = 'Invalid email format';
      setErrors(errors);
      return false;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/;
    if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
      setErrors(errors);
      return false;
    } else if (!passwordRegex.test(values.password)) {
      errors.password = 'Password must contain at least 1 uppercase, 1 lowercase, and 1 special character';
      setErrors(errors);
      return false;
    }
  
    if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Password and confirm password don't match";
      setErrors(errors);
      return false;
    }
  
    if (values.mobile.length !== 10) {
      errors.mobile = 'Mobile number must be 10 digits long';
      setErrors(errors);
      return false;
    }
  
    setErrors({});
    return true;
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      axios.post('/user/register', values)
        .then((res) => {
          if (res.data.Status === "success") {
            console.log("Registration success");
            navigate('/login');
          } else {
           
            console.log(res.data.message);
            alert(`Error: ${res.data.message}`);
          }
        })
        .catch((err) => {
          console.error('Error:', err.message);
          setErrors({exist:"User already exist"});
        });
    } else {
      console.log(errors);
    }
  }

  return (
    <div className='signup-container'>
      <div className='signup-img'>
        <div className='signup-content'>
          <br />
          <h2>Welcome! If you have already registered, you can sign in directly.</h2>
          <Link to='/login' className="forgot-password">
            Already registered? <a href="/sign-in">Sign in</a>
          </Link><br />
          <button type="button" onClick={() => navigate('/login')} className="signin-btn">
            Sign In
          </button>
        </div>
      </div>
      <div className='form-signup'>
        <form onSubmit={handleSubmit}>
          <h3 className='signup-title'>Sign Up</h3>

          <div className="signup-name">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              onChange={e => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <br />

          <div className="signup-email">
            <input
              type="email"
              name='email'
              className="form-control"
              placeholder="Enter email"
              onChange={e => setValues({ ...values, email: e.target.value })}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          <br />

          <div className="signup-password" style={{ position: 'relative' }}>
  <input
    type={showPassword ? 'text' : 'password'}
    name='password'
    className="form-control"
    placeholder="Enter password"
    onChange={e => setValues({ ...values, password: e.target.value })}
  />
  
  <span
    onClick={togglePasswordVisibility}
    style={{
      position: 'absolute',
      right: '25px',
      top: '60%',
      transform: 'translateY(-50%)',
      cursor: 'pointer',
    }}
  >
    {showPassword ? (
        <img 
        src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/3251032/eye-open-icon-sm.png" 
        alt="Show Password" 
        className='password-eye'
      />
    ) : (
      <img 
      src="https://static.thenounproject.com/png/23005-200.png" 
      alt="Hide Password"  
      className='password-eye' 
    />
   
    )}
  </span>
  {errors.password && <div className="error-message">{errors.password}</div>}
</div>

          <br/>
          <div className="signup-password">
            <input
              type="password"
              name='confirmPassword'
              className="form-control"
              placeholder="Retype Password"
              onChange={e => setValues({ ...values, confirmPassword: e.target.value })}
            />
            {errors.confirmPassword && <div className='error-message'>{errors.confirmPassword}</div>}
          </div>
          <br />

          <div className="signup-mobile">
            <input
              type="text"
              name='mobile'
              className="form-control"
              placeholder="Enter mobile number"
              onChange={e => setValues({ ...values, mobile: e.target.value })}
            />
            {errors.mobile && <div className="error-message">{errors.mobile}</div>}
          </div>
         

          <div className="signup-button">
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </div>
          {errors.exist && <div className="error-message">{errors.exist}</div>}
        </form>
      </div>
    </div>
  );
}

export default Register;
