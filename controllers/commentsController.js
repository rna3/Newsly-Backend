import Comment from '../models/Comment.js';

export const addComment = async (req, res, next) => {
  try {
    const { article_id, comment } = req.body;
    const user_id = req.user.id;
    const newComment = await Comment.create(user_id, article_id, comment);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { article_id } = req.query;
    if (!article_id) {
      const err = new Error('article_id is required');
      err.statusCode = 400;
      throw err;
    }
    const comments = await Comment.getByArticleId(article_id);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const { comment } = req.body;
    const user_id = req.user.id;
    const updatedComment = await Comment.update(commentId, user_id, comment);
    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const user_id = req.user.id;
    const deletedComment = await Comment.delete(commentId, user_id);
    res.json({ message: 'Comment deleted successfully', deletedComment });
  } catch (error) {
    next(error);
  }
};
