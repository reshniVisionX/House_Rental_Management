const express = require('express');
const Property = require('../Models/Property'); 
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');


router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find({
      status: 'available', 
      booking: { $ne: 'Booked' } 
    });
    res.json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ message: err.message });
  }
});
const imgUploadDir = path.join(__dirname, '../../rentify/public/uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imgUploadDir); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); 
    const filename = `${Date.now()}${ext}`; // Generate filename with current timestamp and extension
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

router.post('/addProperty', upload.single('picture'), async (req, res) => {
  try {
    const {
      place,
      address,
      city,
      state,
      zipcode,
      numberOfRooms,
      rentPerDay,
      sqft,
      placesNear,
      status,
      owner
    } = req.body;

    if (!place || !address || !city || !state || !zipcode || !numberOfRooms || !rentPerDay || !sqft || !placesNear || !status || !owner) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    console.log(req.body);
      
      const existingProperty = await Property.findOne({ address });
      if (existingProperty) {
        console.log("Property exist");
        return res.status(400).json({ message: 'Property with this address already exists' });
      }
    const pictureFilename = req.file.filename;

    const newProperty = new Property({
      place,
      address,
      city,
      state,
      zipcode,
      numberOfRooms,
      rentPerDay: Number(rentPerDay),
      sqft,
      placesNear: JSON.parse(placesNear), 
      status,
      picture: pictureFilename,
      owner,
      booking: 'Not Booked'
    });

    await newProperty.save();
    console.log('Property added');
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



  router.get('/propertiesByOwner/:email', async (req, res) => {
    const userEmail = req.params.email;
    try {
      const properties = await Property.find({ owner: userEmail });
      if (!properties) {
        return res.status(404).json({ message: 'No properties found for this user.' });
      }
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching properties', error });
    }
  });

router.delete('/deleteProperty/:id', async (req, res) => {
  const propertyId = req.params.id;

  try {
    const result = await Property.findByIdAndDelete(propertyId);

    if (!result) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/updateBooking/:id', async(req,res)=>{
   try{
      const propertyId = req.params.id;
      const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { booking:req.body.bookingStatus },
        { new: true }
      );
      if(!updatedProperty){
        return res.status(404).json({ message: 'Property not found' });
      }
      res.json({status:"ok" });
   }catch(error){
    res.status(500).json({ message: 'Server error' });
   }
  
})

router.get('/getPropertyById/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid Property ID format' });
    }

    // Fetch the property from the database
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
     console.log('sending Property ',property);
    res.json(property);
  } catch (error) {
    console.error('Error fetching property details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
