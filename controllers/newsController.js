import axios from 'axios';

// Search for news articles using NewsAPI
export const searchNews = async (req, res) => {
  const { q } = req.query; // the query term
  const apiKey = process.env.NEWS_API_KEY;
  try {
    // Make a request to the NewsAPI
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q,
        apiKey,
        language: 'en',
      },
    });
    // Return the articles found
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching news' });
  }
};