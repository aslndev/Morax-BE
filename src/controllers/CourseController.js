import Course from '../models/Course.js';
import Profile from '../models/Profile.js';
import { thumbnailSizeLimit } from '../config/upload.js';

class CourseController {
  getAllCourses(req, res) {
    try {
      const { status } = req.query;
      const courses = Course.findAll(status);
      res.json(courses);
    } catch (error) {
      console.error('Courses fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  getCourseById(req, res) {
    try {
      const { id } = req.params;
      const course = Course.findById(id);
      
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      
      res.json(course);
    } catch (error) {
      console.error('Course fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  createCourse(req, res) {
    try {
      const { title, description, content, category, thumbnail_url } = req.body;
      
      if (!title || !description || !content || !category) {
        return res.status(400).json({ error: 'Title, description, content, and category are required' });
      }

      if (thumbnail_url && thumbnail_url.length > thumbnailSizeLimit) {
        return res.status(400).json({ error: 'Thumbnail size too large. Please use a smaller image.' });
      }

      const courseId = Course.create({
        title,
        description,
        content,
        category,
        thumbnail_url,
        author_id: req.user.userId
      });

      res.status(201).json({ message: 'Course created successfully', courseId });
    } catch (error) {
      console.error('Course creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  updateCourse(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const course = Course.findById(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const profile = Profile.findById(req.user.userId);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      if (course.author_id !== req.user.userId && profile.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      if (updates.thumbnail_url && updates.thumbnail_url.length > thumbnailSizeLimit) {
        return res.status(400).json({ error: 'Thumbnail size too large. Please use a smaller image.' });
      }

      const updatedCourse = Course.update(id, updates);
      if (!updatedCourse) {
        return res.status(400).json({ error: 'Failed to update course' });
      }

      res.json(updatedCourse);
    } catch (error) {
      console.error('Course update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  deleteCourse(req, res) {
    try {
      const { id } = req.params;
      
      const course = Course.findById(id);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const profile = Profile.findById(req.user.userId);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      if (course.author_id !== req.user.userId && profile.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      Course.delete(id);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Course deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  updateCourseStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const profile = Profile.findById(req.user.userId);
      if (!profile || profile.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      const validStatuses = ['draft', 'pending', 'approved', 'rejected'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      
      Course.updateStatus(id, status, req.user.userId);
      res.json({ message: 'Course status updated successfully' });
    } catch (error) {
      console.error('Course status update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CourseController(); 