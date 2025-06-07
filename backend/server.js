const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Album = require('./models/Album.js');
const { v4: uuidv4 } = require('uuid');

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(require('cors')());

app.post('/albums', async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Album name required' });

  try {
    const album = new Album({ name, description, photos: [] });
    await album.save();
    res.json(album);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create album', details: err.message });
  }
});

app.post('/albums/:albumId/photos', upload.array('images', 10), async (req, res) => {
  const { albumId } = req.params;
  const { name, description } = req.body;

  try {
    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ error: 'Album not found' });

    const photos = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      const photo = {
        id: uuidv4(),
        name: name || file.originalname,
        description: description || '',
        url: result.secure_url,
      };

      album.photos.push(photo);
      photos.push(photo);

      fs.unlinkSync(file.path);
    }

    await album.save();
    res.json({ photos });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload photos', details: err.message });
  }
});

app.get('/albums', async (req, res) => {
  const albums = await Album.find();
  res.json(albums);
});

app.get('/albums/:albumId', async (req, res) => {
  const album = await Album.findById(req.params.albumId);
  if (!album) return res.status(404).json({ error: 'Album not found' });
  res.json(album);
});


mongoose.connection.once('open', () =>
  console.log('✅ Connected to MongoDB')
);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
