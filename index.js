const express = require('express');
const cors = require('cors');
const videoRoutes = require('./routes/videos');
const app = express();

app.use(express.static('public'));

app.use(cors());
app.use(express.json());
app.use('/videos', videoRoutes);

app.listen(8080, function(){
    console.log("Server is now listening at http://localhost:8080");
});


