const express = require('express');
const videoRoutes = require('./routes/videos');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 8081;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3001";
app.use(express.static('public'));

app.use(cors({origin: CORS_ORIGIN}));
app.use(express.json());
app.use('/videos', videoRoutes);

app.listen(8080, function(){
    console.log(`Server is now listening on port ${PORT}`);
});


