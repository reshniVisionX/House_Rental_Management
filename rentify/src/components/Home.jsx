import React,{useEffect,useState} from 'react'
import '../Styles/Home.css'

const BASE_URL = 'http://localhost:4000';
const Home = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${BASE_URL}/user/userData`, {
            credentials: 'include' 
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchData();
    }, []);
  
  return (
    <div className='home'>
         {user ? (
        <div className='user-details'>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  )
}

export default Home