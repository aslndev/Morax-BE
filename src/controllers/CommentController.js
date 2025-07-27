import Comment from '../models/Comment.js';
import Profile from '../models/Profile.js';

class CommentController {
  getCommentsByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      const comments = Comment.findByCourseId(courseId);
      res.json(comments);
    } catch (error) {
      console.error('Comments fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  createComment(req, res) {
    try {
      const { courseId } = req.params;
      const { content, parent_id } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      const commentId = Comment.create({
        course_id: courseId,
        user_id: req.user.userId,
        parent_id,
        content
      });
      
      res.status(201).json({ message: 'Comment created successfully', commentId });
    } catch (error) {
      console.error('Comment creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  updateComment(req, res) {
    try {
      const { courseId, commentId } = req.params;
      const { content } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }
      
      const comment = Comment.findById(commentId, courseId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      const profile = Profile.findById(req.user.userId);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      if (comment.user_id !== req.user.userId && profile.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      const updatedComment = Comment.update(commentId, { content });
      if (!updatedComment) {
        return res.status(400).json({ error: 'Failed to update comment' });
      }
      
      res.json({ message: 'Comment updated successfully' });
    } catch (error) {
      console.error('Comment update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  deleteComment(req, res) {
    try {
      const { courseId, commentId } = req.params;
      
      const comment = Comment.findById(commentId, courseId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      const profile = Profile.findById(req.user.userId);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      if (comment.user_id !== req.user.userId && profile.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      Comment.delete(commentId);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Comment deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CommentController(); 