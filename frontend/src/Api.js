import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});



async function fetchGeneratedText(prompt) {
  try {
    const response = await api.post('/api/generate-text', { prompt });

    if (response.status !== 200) {
      throw new Error('Failed to generate text');
    }

    return response.data.text;
  } catch (err) {
    console.error(err);
  }
}

async function generateImage(prompt, trackName, artistName) {
  try {
    const response = await api.post('/api/generate-image', { prompt, trackName, artistName });
    if (response.status === 200) {
      return response.data.url;
    } else {
      console.error('Error generating image:', response.status, response.statusText);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getImages(trackName, artistName) {
  try {
    const response = await api.post('/api/get-images', { trackName, artistName });
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      console.error('Error getting images:', response.status, response.statusText);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}






export default {
  api,
  fetchGeneratedText,
  generateImage,
  getImages,
};
