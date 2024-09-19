import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Buyer.css';
const BASE_URL = 'http://localhost:4000';


const Buyer = () => {
  const [city, setCity] = useState('');
  const [noOfRooms, setNoOfRooms] = useState('');
  const [place, setPlace] = useState('');
  const [rent, setRent] = useState(0);
  const [facility, setFacility] = useState('');
  const [properties, setProperties] = useState([]);
  const [email,setEmail]=useState('');

  const [wishProp, setWishProp] = useState(() => {
    const storedWishlist = localStorage.getItem('wishProp');
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  });
  const navigate = useNavigate();

  const toggleLike = (propertyId) => {
    setWishProp((prevWishlist) => {
      let updatedWishlist;
      if (prevWishlist.includes(propertyId)) {
        updatedWishlist = prevWishlist.filter(id => id !== propertyId);
      } else {
        updatedWishlist = [...prevWishlist, propertyId];
      }
      localStorage.setItem('wishProp', JSON.stringify(updatedWishlist));
      console.log('Updated wishProp:', updatedWishlist);

      return updatedWishlist;
    });
  };

  useEffect(() => {
    
    const fetchData = () => {
    
      fetch(`${BASE_URL}/user/userData`, {
         credentials: 'include', 
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then((userData) => {
          const userEmail = userData.email;
          setEmail(userEmail);
          
          return fetch(`${BASE_URL}/property/properties`, {
            credentials: 'include',
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to fetch properties');
              }
              return response.json();
            })
            .then((allProperties) => {
             
              const filtered = allProperties.filter(
                (property) => property.owner !== userEmail
              );
              setProperties(filtered);
             
            });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    };

    fetchData();
  }, []); 

  const filteredProperties = properties.filter(
    (property) =>
      property.city.toLowerCase().includes(city.toLowerCase()) &&
      (!noOfRooms || property.numberOfRooms >= parseInt(noOfRooms)) &&
      (!place || property.place.toLowerCase().includes(place.toLowerCase())) &&
      (rent <= 0 || property.rentPerDay <= rent) &&
      (!facility || property.placesNear.some(placeNear => placeNear.toLowerCase().includes(facility.toLowerCase())))
  );

 const ViewBookings = ()=>{
      navigate('/mybookings',{state:{email}});
 }

  return (
    <div className="buyer-container">
      <h1>Pick Your Place From the Filters</h1>
      <div className="buyer-bar">
        <input
          type="text"
          className='search-bar'
          placeholder="Search by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          className='search-bar'
          placeholder="Search by place"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        />
        <input
          type="number"
          className='search-bar'
          placeholder="Enter the max rent per day"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
        />
        <input
          type="number"
          className='search-bar'
          placeholder="Search by number of rooms"
          value={noOfRooms}
          onChange={(e) => setNoOfRooms(e.target.value)}
        />
        <input
          type="text"
          className='search-bar'
          placeholder="Search for facility"
          value={facility}
          onChange={(e) => setFacility(e.target.value)}
        />

        <div className='cart-prop'>
          <img
            src="https://clipart.info/images/ccovers/1531011033purple-heart-emoji-png.png"
            alt="cart"
            className="cart-item"
            onClick={() => {
              console.log('Navigating with:', { prop: wishProp, properties });
              navigate('/cartProp', { state: { prop: wishProp, properties} });
            }}
          />
        </div>
        <div className='MyBookings'>
          <button type='button' onClick={()=>ViewBookings()}>My Bookings</button>
        </div>
      </div>

      <div className="property-lists">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div key={property._id} className="property-card">
              <div onClick={() => toggleLike(property._id)} className='like'
                  style={{ cursor: 'pointer', fontSize: '20px' }}>
                  <span style={{ color: wishProp.includes(property._id) ? 'red' : 'grey' }}>
                    {wishProp.includes(property._id) ? '❤️' : '🤍'}
                  </span>
                </div>
              <div className='image-left'>
                <img src={property.picture} alt={property.place} className="property-image" />
              </div>
              <div className='property-right'>
                <h3><span className='property-span'>₹: </span> {property.rentPerDay}</h3> <br />
                <h3>{property.place} <span className='city-name'> {property.city}</span></h3><br />
                <div className='small-grp'>
                  <p><span className='property-span'>Address: </span> {property.address}</p>
                  <p><span className='property-span'>Rooms: </span> {property.numberOfRooms}</p>
                  <p><span className='property-span'>Sqft: </span> {property.sqft}</p>
                </div>
                <div className='amenities'>
                  <div className='places-list'>
                    {property.placesNear.map((place, index) => (
                      <div key={index} className='place-item'>
                       <i style={{fontSize:"12px"}}>{place}</i> 
                      </div>
                    ))}
                  </div>
                </div>
                
              </div>
            </div>
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default Buyer;
