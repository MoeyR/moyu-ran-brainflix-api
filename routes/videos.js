const express = require('express');
const fs = require('fs');
const router = express.Router();
const {v4:uuidv4} = require('uuid');

const VIDEOS_FILE_PATH = "./data/video-details.json";

function getVideos(){
    const videosJson = fs.readFileSync(VIDEOS_FILE_PATH);
    return JSON.parse(videosJson);
}

function setVideos(videos){
    const videoJson = JSON.stringify(videos);
    fs.writeFileSync(VIDEOS_FILE_PATH, videoJson);
}

    module.exports = router;