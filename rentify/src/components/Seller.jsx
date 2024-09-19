import React, { useEffect, useState } from 'react';
import '../Styles/Seller.css';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:4000';

const Seller = () => {
  const Navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error,setError]=useState("");

  const [newProperty, setNewProperty] = useState({
    place: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    numberOfRooms: '',
    rentPerDay: '',
    sqft: '',
    placesNear: [''],
    status: 'available',
    picture: null,
    owner: ''
  });

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

        fetchUserProperties(userData.email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };


    fetchData();
  }, []);

  const fetchUserProperties = async (email) => {
    try {
      const response = await fetch(`${BASE_URL}/property/propertiesByOwner/${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      const propertiesData = await response.json();
      setProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      console.error('User data is not available.');
      return;
    }
  
    try {
      
      const formData = new FormData();
      formData.append('place', newProperty.place);
      formData.append('address', newProperty.address);
      formData.append('city', newProperty.city);
      formData.append('state', newProperty.state);
      formData.append('zipcode', newProperty.zipcode);
      formData.append('numberOfRooms', newProperty.numberOfRooms);
      formData.append('rentPerDay', newProperty.rentPerDay);
      formData.append('sqft', newProperty.sqft);
      formData.append('placesNear', JSON.stringify(newProperty.placesNear)); 
      formData.append('status', newProperty.status);
      formData.append('owner', user.email); 

      if (newProperty.picture) {
        formData.append('picture', newProperty.picture); 
      }
  
      const response = await fetch(`${BASE_URL}/property/addProperty`, {
        method: 'POST',
        body: formData, 
      });
  
      if (!response.ok) {
        setError(response.data.message);
        console.log(response.data.message);
        e.preventDefault()
        throw new Error('Failed to add property ',response.message);
      }else{
  
      const addedProperty = await response.json();
      setProperties([...properties, addedProperty]);
  
      setNewProperty({
        place: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        numberOfRooms: '',
        rentPerDay: '',
        sqft: '',
        placesNear: [''],
        status: 'available',
        picture: null,
        owner: ''
      });
    }
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value
    }));
  };

  const handleFileChange=(e)=>{
    const { name, files } = e.target;
    setNewProperty({
      ...newProperty,
      [name]: files[0],
    });
  }

  const handlePlacesNearChange = (index, value) => {
    const updatedPlacesNear = [...newProperty.placesNear];
    updatedPlacesNear[index] = value;
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      placesNear: updatedPlacesNear
    }));
  };

  const handleAddPlace = () => {
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      placesNear: [...prevProperty.placesNear, '']
    }));
  };

  const handleRemovePlace = (index) => {
    const updatedPlacesNear = newProperty.placesNear.filter((_, i) => i !== index);
    setNewProperty((prevProperty) => ({
      ...prevProperty,
      placesNear: updatedPlacesNear
    }));
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/property/deleteProperty/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      console.log('Property deleted successfully');
      fetchUserProperties(user.email);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };
  
  const showRequest = () => {
    Navigate('/booking', { state: { user } });
  };
  

  return (
    <div className='Seller'>
      <div className="seller-container">
        <div className="form-section">
          <h2>Add your Property</h2>
          <form  className="property-form">
            {error && <div className='error-message'>{error}</div>}
            <div className="form-group">
              <input
                type="text"
                id="place"
                name="place"
                value={newProperty.place}
                onChange={handleInputChange}
                placeholder='Enter the place'
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="address"
                name="address"
                value={newProperty.address}
                onChange={handleInputChange}
                placeholder='Enter the address'
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="city"
                name="city"
                value={newProperty.city}
                onChange={handleInputChange}
                placeholder='Enter the city'
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="state"
                name="state"
                value={newProperty.state}
                onChange={handleInputChange}
                placeholder='Enter the state'
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={newProperty.zipcode}
                onChange={handleInputChange}
                placeholder='Enter the zipcode'
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                id="numberOfRooms"
                name="numberOfRooms"
                value={newProperty.numberOfRooms}
                onChange={handleInputChange}
                placeholder='Enter the number of rooms available'
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                id="rentPerDay"
                name="rentPerDay"
                value={newProperty.rentPerDay}
                onChange={handleInputChange}
                placeholder='Enter the rent per day'
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                id="sqft"
                name="sqft"
                value={newProperty.sqft}
                onChange={handleInputChange}
                placeholder='Enter the total square feet'
                required
              />
            </div>
            <div className="form-group places-near-section">
              {newProperty.placesNear.map((place, index) => (
                <div key={index} className="places-near-input">
                  <input
                    type="text"
                    name={`placesNear-${index}`}
                    value={place}
                    onChange={(e) => handlePlacesNearChange(index, e.target.value)}
                    placeholder={`Places Nearby ${index + 1}`}
                    required
                  />
                  <span>
                  {index > 0 && (
                    <button type="button" onClick={() => handleRemovePlace(index)} className="remove-place-button">
                      -
                    </button>
                  )}</span>
                </div>
              ))}
              <button type="button" onClick={handleAddPlace} className="add-place-button">+</button>
            </div>
            <div className="form-group">
              <input
                type="file"
                id="picture"
                name="picture"
                onChange={handleFileChange}
                placeholder='Select image'
                required
              />
            </div>
            <button type="button" onClick={handleSubmit} className="submit-button">Add Property</button>
          </form>
        </div>

        <div className="profile-section">
          {user ? (
            <div className="user-details">
              <img
                src="https://www.citypng.com/public/uploads/small/11639594314mvt074h0zt5cijvfdn7gqxbrya72bzqulyd5bhqhemb5iasfe7gbydmr2jxk8lcclcp6qrgaoiuiavf4sendwc3jvwadddqmli2d.png"
                alt="Profile"
                className="profile-picture"
              />
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>

      {properties.length > 0 && (
        <div className="properties-section">
          <h2>Your Previous Added Properties</h2>
          
            {properties.map((property) => (
              <div key={property._id} className="property-item">
                
                <div className='prop-details'>
                <h3 className={`${property.status}`}>{property.place}</h3><br/>
                 <p>{property.address}, {property.city}, {property.state}, {property.zipcode}</p>
                 <p>Rooms: {property.numberOfRooms} | Sqft: {property.sqft}</p>


                </div>
                <div className='dlt' onClick={()=>handleDelete(property._id)}>
                   <h2>🗑️</h2>
                </div>
              </div>
             
            ))}
        
        </div>
       
      )}
      <div className='MyBooking' onClick={()=>showRequest()}>
         <button type ='button' onClick={()=>showRequest()}>View Rent Request</button>
        </div>
    </div>
  );
};

export default Seller;
