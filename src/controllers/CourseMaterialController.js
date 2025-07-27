import CourseMaterial from '../models/CourseMaterial.js';
import Course from '../models/Course.js';
import Profile from '../models/Profile.js';

class CourseMaterialController {
  getMaterialsByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      const materials = CourseMaterial.findByCourseId(courseId);
      res.json(materials);
    } catch (error) {
      console.error('Materials fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  createMaterial(req, res) {
    try {
      const { courseId } = req.params;
      const { title, type, file_url, youtube_url, youtube_embed_id, file_size, audio_url } = req.body;
      
      if (!title || !type) {
        return res.status(400).json({ error: 'Title and type are required' });
      }

      const validTypes = ['pdf', 'ppt', 'docx', 'youtube', 'image', 'audio'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid material type' });
      }

      const course = Course.findById(courseId);
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

      const materialId = CourseMaterial.create({
        course_id: courseId,
        title,
        type,
        file_url,
        youtube_url,
        youtube_embed_id,
        audio_url,
        file_size
      });

      res.status(201).json({ message: 'Material added successfully', materialId });
    } catch (error) {
      console.error('Material creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  updateMaterial(req, res) {
    try {
      const { courseId, materialId } = req.params;
      const updates = req.body;
      
      const material = CourseMaterial.findById(materialId, courseId);
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }

      const course = Course.findById(courseId);
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

      const fields = Object.keys(updates).filter(key => key !== 'id');
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const updatedMaterial = CourseMaterial.update(materialId, updates);
      if (!updatedMaterial) {
        return res.status(400).json({ error: 'Failed to update material' });
      }

      res.json(updatedMaterial);
    } catch (error) {
      console.error('Material update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  deleteMaterial(req, res) {
    try {
      const { courseId, materialId } = req.params;
      
      const material = CourseMaterial.findById(materialId, courseId);
      if (!material) {
        return res.status(404).json({ error: 'Material not found' });
      }

      const course = Course.findById(courseId);
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

      CourseMaterial.delete(materialId);
      res.json({ message: 'Material deleted successfully' });
    } catch (error) {
      console.error('Material deletion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CourseMaterialController(); 