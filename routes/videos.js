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

//Middleware to validate POST /videos request
const postVideoValidator = (req, res, next)=>{
    const {
        title,
        description,
        image
    } = req.body;

    if(!title){
        return res.status(400).json({error: "Video title is missing!"});
    }

    if(!description){
        return res.status(400).json({error: "Video description is missing!"})
    }

    next();
}

//Middleware to find video by videoId
const findVideoById =(req, res, next)=>{
        const {videoId} = req.params;
        const videos = getVideos();
        const foundVideo = videos.find((video)=>{
            return video.id === videoId;
        });

        if(!foundVideo) {
            return res.status(404).json({error: "No video with that id exists"});
        }

        req.foundVideo = foundVideo;
        next();
    
}


router
    .route('/')
    .get((_req, res)=>{
        const videos = getVideos();
        let videosArr=[];
        videos.forEach(video => {
            videoItem = {
                id: video.id,
                title: video.title,
                channel: video.channel,
                image: video.image
            }
            videosArr.push(videoItem);
        });
        
        res.status(200).json(videosArr);
    })
    .post(postVideoValidator, (req, res)=>{
        const {title, description, image} = req.body;
        const videos = getVideos();
        const newVideo = {
            id: uuidv4(),
            title,
            description,
            image
        }

        videos.push(newVideo);
        setVideos(videos);
        res.status(201).json(newVideo);
    })



router
    .route('/:videoId')
    .get(findVideoById, (req, res)=>{
        const {foundVideo} = req;
        return res.status(200).json(foundVideo);
    })   

router
    .route('/:videoId/comments')
    .post(findVideoById,(req, res)=>{
        const {name, comment} = req.body;
        const videos = getVideos();
        const {foundVideo} = req;
        const comments = foundVideo.comments;
        const newComment = {
            id: uuidv4(),
            name,
            comment,
            timestamp: new Date().getTime()
        }
        comments.push(newComment);
        const updatedVideos = videos.map((video) => {
            if (video.id === foundVideo.id) {
                foundVideo.comments = comments;
                return foundVideo;
            } else {
                return video;
            }
        });
        setVideos(updatedVideos);
        
        res.status(201).json(newComment);

    })

router
    .route('/:videoId/comments/:commentId')
    .delete(findVideoById, (req, res)=>{
        const {commentId} = req.params;
        const {foundVideo} = req;
         const videos = getVideos();
        const comments = foundVideo.comments;
        const foundCommentIndex = comments.findIndex((comment)=>{
            return comment.id === commentId;
        });
        if(foundCommentIndex === -1){
            return res.status(404).json({error: "Comment not found"});
        }

        comments.splice(foundCommentIndex, 1);
        const updatedVideos = videos.map((video) => {
            if (video.id === foundVideo.id) {
                foundVideo.comments = comments;
                return foundVideo;
            } else {
                return video;
            }
        });
        setVideos(updatedVideos);
        
        return res.status(204).send();
    })

    module.exports = router;