const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateText(prompt) {
  try {
    console.log(prompt);



    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
          {role: 'system', content: 'You are an AI designed to generate prompts for an Image generation AI to create images that match the mood of the song lyrics you are given. Give only the prompt.'},
          {role: 'user', content: prompt},
      ],
      //prompt: prompt,
      max_tokens: 2000,
      //n: 1,
      stop: null,
      temperature: 1,
    });

    const assistantMessage = response.data.choices[0].message;
    console.log(assistantMessage);
    return assistantMessage.content;

  } catch (err) {
    console.error('Error calling OpenAI API:', err.message);
    console.error('Error details:', err);
  }
}

async function generateImage(prompt) {
  try {
    console.log(prompt);

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '512x512',
    });

    const imageUrls = response.data.data.map((image) => image.url);
    console.log(imageUrls);
    return imageUrls;

  } catch (err) {
    console.error(err);
  }
}


module.exports = {
  generateText,
  generateImage,
};

