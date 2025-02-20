import Favorite from '../models/Favorite.js';

export const addFavorite = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const articleData = req.body;
    const favorite = await Favorite.create(user_id, articleData);
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === '23505') {
      error.statusCode = 400;
      error.message = 'This article is in your favorites';
    }
    next(error);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const favorites = await Favorite.getByUserId(user_id);
    res.json(favorites);
  } catch (error) {
    next(error);
  }
};

export const deleteFavorites = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      const err = new Error('Invalid ids provided');
      err.statusCode = 400;
      throw err;
    }
    const deletedFavorites = await Favorite.deleteByIds(user_id, ids);
    res.json({ deleted: deletedFavorites.length });
  } catch (error) {
    next(error);
  }
};
