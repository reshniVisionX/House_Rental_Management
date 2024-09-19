import React, { useState, useEffect } from 'react';
import '../Styles/Booking.css';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'http://localhost:4000';

const Booking = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [userId, setUserId] = useState(null);
  const [bookingsWithDetails, setBookingsWithDetails] = useState([]);
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      fetch(`${BASE_URL}/user/getId/${user.email}`, { credentials: 'include' })
        .then(response => {
          if (!response.ok) {
            return Promise.reject('Failed to fetch user ID');
          }
          return response.json();
        })
        .then(data => {
          setUserId(data.userId); 
          console.log('User ID:', data.userId);

          let ownerId = data.userId;
          return fetch(`${BASE_URL}/booking/getBookingsByOwner/${ownerId}`, { credentials: 'include' });
        })
        .then(response => {
          if (!response.ok) {
            return Promise.reject('Failed to fetch bookings');
          }
          return response.json();
        })
        .then(bookingData => {
        
          if (bookingData.length > 0) {
            setBooking(bookingData);
         
          }
        })
        .catch(error => {
          console.error('Error during data fetching process:', error);
        });
       
        fetchData();
    }
  }, [user]);

 
  const fetchData = () => {
    console.log('Fetching from ',booking);
    if (booking.length > 0) {
      const fetchDetails = async () => {
        try {
          const bookingDetailsPromises = booking.map(async (bookingItem) => {
            console.log('BookingItem', bookingItem);
            const currentBooking = bookingItem;
            if (currentBooking) {
              
              console.log('Booking details:', currentBooking.UserId, currentBooking.PropertyId);
  
              const bookedUser = await fetch(`${BASE_URL}/user/getUserById/${currentBooking.UserId}`, { credentials: 'include' })
                .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch booked user details'));
  
              const bookedProperty = await fetch(`${BASE_URL}/property/getPropertyById/${currentBooking.PropertyId}`, { credentials: 'include' })
                .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch booked property details'));
  
              return {
                booking: currentBooking,
                bookedUser,
                bookedProperty,
              };
            }
            return null;
          });
  
          const bookingDetails = await Promise.all(bookingDetailsPromises);
          setBookingsWithDetails(bookingDetails.filter(detail => detail)); 
          console.log('Booking Details:', bookingDetails);
        } catch (error) {
          console.error('Error fetching user/property details:', error);
        }
      };
  
      fetchDetails();
    }else{
      console.log("Booking is Empty");
    }
  };
  
  const handlePropertyStatus = (propertyId, bookingId) => {
    console.log(`Approving booking with ID: ${bookingId} and Property ID: ${propertyId}`);
  
    fetch(`${BASE_URL}/property/updateBooking/${propertyId}`, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingStatus: 'Booked' }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error while updating booking status');
        }
        return response.json(); 
      })
      .then(data => {
        console.log('Booking status updated successfully:', data);
        handleBookingStatus(bookingId,"Booked");
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  

  const handleBookingStatus = (bookingId, status) => {
    console.log(`Updating booking with ID: ${bookingId} to status: ${status}`);
  
    fetch(`${BASE_URL}/booking/updateStatus/${bookingId}`, {
      credentials: 'include',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingStatus: status }), 
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error while updating booking status');
        }
        return response.json(); 
      })
      .then(data => {
        console.log('Booking status updated successfully:', data);
       
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };
  
  return (
    <div className='Booking'>
      <h1 className='BookingTitle'>MY RENT REQUEST</h1>
      <div className='BookingList'>
        {bookingsWithDetails.length === 0 ? (
          <p className='NoBookings'>No bookings found</p>
        ) : (
          bookingsWithDetails.map(({ booking, bookedUser, bookedProperty }) => (
            <div key={booking._id} className='BookingCard'>
              <h3 className='BookingCardTitle'>Booking Details</h3>
              <p><strong className="header-font">Status:</strong> {booking.bookingStatus}</p>
              <h4 className='UserDetailsTitle'>User Details</h4>
              <p><strong className="header-font">Name:</strong> {bookedUser.name || 'Unknown'}</p>
              <p><strong className="header-font">Email:</strong> {bookedUser.email || 'Unknown'}</p>
              <p><strong className="header-font">Mobile:</strong> {bookedUser.mobile || 'Unknown'}</p>
              <h4 className='PropertyDetailsTitle'>Property Details</h4>
              <p><strong className="header-font">Property Name:</strong> {bookedProperty.place || 'Unknown'}</p>
              <p>{bookedProperty.city}</p>
              <p><strong className="header-font">Address:</strong> {bookedProperty.address || 'Unknown'}</p>
              <div className='BookingActions'>
                <button className='ApproveButton' onClick={() => handlePropertyStatus(bookedProperty._id,booking._id)}>Approve</button>
                <button className='RejectButton' onClick={() => handleBookingStatus(booking._id,"Cancelled")}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Booking;