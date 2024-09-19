import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Styles/Cart.css';

const CartProp = () => {
  const location = useLocation();
  const { prop: wishProp = [], properties = [] } = location.state || {};
  const [mylist, setMylist] = useState([]);
  const Navigate = useNavigate();

  useEffect(() => {
    const filteredProperties = properties.filter(property =>
      wishProp.includes(property._id)
    );
    setMylist(filteredProperties);
  }, [wishProp, properties]);

  const NavigatePage=(id)=>{
    console.log('From cart',properties);
        Navigate(`/property/${id}`,{state: {properties}});
  }

  return (
    <div>
      <h1>Cart Property</h1>
      <div className="property-lists">
        {mylist.length > 0 ? (
          mylist.map((property) => (
            <div key={property._id} className="property-card">
              
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
                <div className="grp-desc">
                 <div className='amenities'>
                  <div className='places-list'>
                    {property.placesNear.map((place, index) => (
                      <div key={index} className='place-item'>
                        <i style={{ fontSize: "12px" }}>{place}</i> 
                      </div>
                    ))}
                   </div>
                  
                  </div>
                  <div className='description-btn'>
                      <button type ="button" onClick={()=>NavigatePage(property._id)}>View</button>
                   </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No properties found in wishlist.</p>
        )}
      </div>
    </div>
  );
};

export default CartProp;
