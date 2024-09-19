import React, { useEffect, useState } from 'react';
import '../Styles/Property.css';
import { useLocation, useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:4000';
const Property = () => {
    const { id } = useParams();
    const location = useLocation();
    const { properties } = location.state || {};
    const [property, setProperty] = useState(null);
    
    const [propertyOwnerEmail , setPropertyOwnerEmail] = useState('');
  
    useEffect(() => {
        if (id && properties) {
            const foundProperty = properties.find((prop) => prop._id === id);
            if(foundProperty){
                setPropertyOwnerEmail(foundProperty.owner);
                setProperty(foundProperty);
            }
        }
    }, [properties, id]);

    if (!property) {
        return <div className="property-container"><h2>Loading Property Details....</h2></div>;
    }

    const handleBooking = (id) => {
        let propertyUserId, bookerId;
        fetch(`${BASE_URL}/user/getId/${propertyOwnerEmail}`, { credentials: 'include' })
          .then(response => {
            if (!response.ok) {
              return Promise.reject('Failed to fetch property owner ID');
            }
            return response.json();
          })
          .then(data => {
            propertyUserId = data.userId;
            console.log('Owner ID:', propertyUserId);
            return fetch(`${BASE_URL}/user/userData`, { credentials: 'include' });
          })
          .then(response => {
            if (!response.ok) {
              return Promise.reject('Failed to fetch booker data');
            }
            return response.json();
          })
          .then(bookerData => {
            console.log('Booker Email:', bookerData.email);
            return fetch(`${BASE_URL}/user/getId/${bookerData.email}`, { credentials: 'include' });
          })
          .then(response => {
            if (!response.ok) {
              return Promise.reject('Failed to fetch booker ID');
            }
            return response.json();
          })
          .then(data => {
            bookerId = data.userId; 
            console.log('Booker ID:', bookerId);
            return fetch(`${BASE_URL}/property/updateBooking/${id}`, {
              credentials: 'include',
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ bookingStatus: 'Pending' }),
            });
          })
          .then(response => {
            if (!response.ok) {
              return Promise.reject('Failed to update property booking');
            }
            return response.json();
          })
          .then(updateBooking => {
            if (updateBooking.status === 'ok') {
              const updatedBooking = {
                OwnerId: propertyUserId,
                UserId: bookerId, 
                PropertyId: id,
                bookingStatus: 'Pending',
              };
      
              console.log('Booking Data:', updatedBooking);

              return fetch(`${BASE_URL}/booking/create`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBooking),
              });
            } else {
              return Promise.reject('Failed to update booking status');
            }
          })
          .then(response => {
            if (response.ok) {
              console.log('Booking stored successfully');
              alert('Your booking is in progress');
            } else {
              return Promise.reject('Failed to store booking');
            }
          })
          .catch(error => {
            console.error('Error during booking process:', error);
          });
      };
      
    
    return (
        <div className='property-container'>
            <h1 className='property-title'>Property Description</h1>
            <div className="property-content">
                <img className="property-image" src={property.picture} alt="Property" />
                <div className="property-details">
                    <h2 className="property-city">{property.city}</h2>
                    <h3 className="property-place">{property.place}</h3>
                    <p className="property-rooms">Number of Rooms: {property.numberOfRooms}</p>
                    <p className="property-area">Area: {property.sqft} sqft</p>
                    
                    <h4 className="places-near-title">Places Near:</h4>
                    <ul className="places-near-list">
                        {property.placesNear.map((place, index) => (
                            <li key={index} className="places-near-item">{place}</li>
                        ))}
                    </ul>
                    
                    <p className="property-status">Status: {property.status}</p>
                    <p className="property-owner">Owner: {property.owner}</p>
                    <p className="property-booking">Booking Status: {property.booking}</p>

                    <button className="book-button"  onClick={()=>handleBooking(property._id)} type="button">Book Here</button>
                </div>
            </div>
        </div>
    );
}

export default Property;
