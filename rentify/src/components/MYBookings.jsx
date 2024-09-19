import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../Styles/MyBooking.css'
const BASE_URL = 'http://localhost:4000';

const MYBookings = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (email) {
      fetch(`${BASE_URL}/user/getId/${email}`, { credentials: 'include' })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch user ID'))
        .then(data => {
          setUserId(data.userId);
          return fetch(`${BASE_URL}/booking/getBookingsByUser/${data.userId}`, { credentials: 'include' });
        })
        .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch bookings'))
        .then(bookingData => {
          setBookings(bookingData);
          const propertyIds = bookingData.map(booking => booking.PropertyId);
          return Promise.all(propertyIds.map(id => fetch(`${BASE_URL}/property/getPropertyById/${id}`, { credentials: 'include' })));
        })
        .then(responses => Promise.all(responses.map(response => response.ok ? response.json() : Promise.reject('Failed to fetch property details'))))
        .then(propertiesData => setProperties(propertiesData))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [email]);

  return (
    <div className='my-bookings'>
      <h1>My Bookings</h1><br/>
      {properties.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        properties.map((property, index) => (
          <div key={index} className='booking-card'>
            <div className='Booking-left'>
              <img src={property.picture} className="booking-image" alt="image1"></img>
            </div>
            <div className='Booking-right'>
              <h2>{property.city}</h2>
              <p><strong className="header-text">Place : </strong> {property.place}</p>
              <p><strong className="header-text">Address : </strong> {property.address}</p>
              <p><strong className="header-text">Square Feet : </strong> {property.sqft}</p>
              <p><strong className="header-text">Price per Night : </strong> {property.rentPerDay}</p>
              <p><strong className="header-text">Status : </strong> {property.booking}</p>
            </div>
          </div>
          
        ))
      )}
    </div>
  );
}

export default MYBookings;
