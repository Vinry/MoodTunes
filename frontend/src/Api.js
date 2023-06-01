import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});



async function registerUser(username, password) {
  try {
    const response = await api.post('/auth/register', { username, password });
    if (response.status === 200) {
      console.log('User registration successful');
      return response.data;
    } else {
      console.error('Error registering user:', response.status, response.statusText);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function loginUser(username, password) {
  try {
    const response = await api.post('/auth/login', { username, password });
    if (response.status === 200) {
      console.log('User login successful');
      return response.data;
    } else {
      console.error('Error logging in:', response.status, response.statusText);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
}

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

async function saveImage(username, imageId) {
  console.log(username);
  console.log(imageId);
  try {
    const response = await api.post('/api/save-image', { username, imageId });

    if (response.status !== 200) {
      throw new Error('Failed to save image');
    }

    return response.data;
  } catch (err) {
    console.error(err);
  }
}

async function getSavedImages(username) {
  try {
    const response = await api.get('/api/saved-images', { params: { username } });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error getting saved images:', response.status, response.statusText);
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
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
    console.log("kommer hit5");
    //return null;
    const response = await api.post('/api/get-images', { trackName, artistName });
    console.log(response);
    if (response.status === 200) {
      const { imageUrl, imageId } = response.data;
      console.log(imageId);
      return { imageUrl, imageId };
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
  registerUser,
  loginUser,
  saveImage,
  getSavedImages,
};
