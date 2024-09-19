import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';
const BASE_URL = 'http://localhost:4000';

const Login = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleInput = (e) => {
    const { name, value } = e.target;
    setValues(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.message === 'Login successful') {
          console.log(data.token);
          console.log("Login success");
          navigate('/');
         
        } else {
          console.log("Invalid credentials");
          setErrorMessage('Invalid credentials');
        }
      })
      .catch(err => {
        console.log(err);
        setErrorMessage('Failed to login');
      });
  };

  return (
    <div className='login-group'>
      <div className='form-login'>
        <form onSubmit={handleSubmit}>
          <h3 className='login-title'>Login</h3>
          <br />
          <div className="email-login">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={values.email}
              onChange={handleInput}
            />
          </div>
          <br />
          <div className="password-login">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={values.password}
              onChange={handleInput}
            />
          </div>
          <br />
          <div className="submit-btn">
            <button type="submit" className="btn-login">
              Submit
            </button>
            <br />
          </div>
          {errorMessage && (
            <div className="error-message" role="alert">
              {errorMessage}
            </div>
          )}
          <br />
        </form>
      </div>
      <div className='picture-signup'>
        <div className="centered-content">
          <p>Haven't Registered Yet..!</p>
          <button className='btn-login' onClick={() => navigate('/signup')}>SignUp</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
