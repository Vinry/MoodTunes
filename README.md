Link to screencast:
https://youtu.be/jc18fTbAjZ0

# Functional Specification

## Project Vision

MoodTunes is a web application that aims to provide users with an immersive music experience by playing songs from Spotify and generating mood-based background images based on the analyzed sentiment of the lyrics. My hope is that this can be used to create a personalized and visually appealing environment, enhancing the user's connection to the music.

## Core Functions

1. **User Authentication and Authorization:**
   - Allow users to sign in using their Spotify account

2. **Music Search and Playback:**
   - Enable users to search for songs, artists, or albums using Spotify
   - Provide controls for playing, pausing, and skipping tracks.
   - Display the song's metadata, such as track name, artist, and album cover.

3. **Lyrics Retrieval:**
   - Fetch the lyrics of the currently playing song using the song's metadata (track name and artist) via an API, lyrst or MusixMatch.
   - Option to display the lyrics.

4. **Sentiment Analysis:**
   - Perform sentiment analysis on the fetched lyrics using a natural language processing API (GPT4 most likely).
   - Determine the mood of the song based on the sentiment analysis results by generating a prompt that captures the mood/feeling of the song.

5. **Background Image Generation or Selection:**
   - Generate an image or collection of images using AI-driven image generation APIs (Dall-e, stable diffusion etc) based on the generated prompt.
   - Display the image (or slideshow of images) as the background while the song plays, hopefully creating an immersive visual experience.

6. **Responsive Design:**
   - Ensure that the web app offers a responsive design, adapting to various screen sizes and devices for an optimal user experience.

## Additional Functions/Wishlist

1. **Ability to regenerate an image if user does not feel it matches.**
2. **Ability to save song or playlist with matching image/slideshow.**
3. **Reverse the flow: create/upload image and get song recommendations.**

# Technical Specification

## Overview

With this web app, I want to try to use a modern stack with React as the frontend, Node.js with Express.js for the backend, and MongoDB as the database. My goal is to also integrate various APIs, such as Spotify, a lyrics API like Lyrist or MusixMatch. I also want to use APIs for GPT4, stable diffusion or DALL-E separately or use some service that can combine the calls I want to make in one place, maybe MindsDB (unsure) for sentiment analysis and image generation.

## Frontend

**React:** A popular and powerful JavaScript library for building user interfaces. React offers a component-based approach, which I hope will make it easy to manage and scale my app.

## Backend

**Node.js:** A JavaScript runtime that should be a good fit together with react, providing a consistent development experience between frontend and backend.

**Express.js:** Framework for Node.js that I hope will make it easy to mange the various API endpoints in the app.

## Database

**MongoDB:** NoSQL database that should pair well with Node.js. Not sure if Mongoose could also be used for management.

## APIs and Services

**Spotify API:** Integrate Spotify's API to enable users to search, play songs, and fetch the song's metadata.

- Spotify API: https://developer.spotify.com/documentation/web-api

**Lyrics API:** Use a lyrics API, such as Musixmatch, Lyrics.ovh, or Lyrist to fetch the lyrics of the currently playing song. Still undecided.

- Musixmatch API:  https://developer.musixmatch.com/
- Lyrics.ovh API: https://lyricsovh.docs.apiary.io/
- Lyrist API: https://github.com/asrvd/lyrist

**AI Services:**

- **GPT-4:** Sentiment analysis or prompt generation for image generation.
- **Stable diffusion/DALL-E:** Use stable diffusion or DALL-E for image generation based on the analyzed sentiment of the lyrics.
- **MindsDB or other:** Alternatively, I might try using MindsDB or other service to consolidate AI tasks if possible.
