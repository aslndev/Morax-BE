import Notification from '../models/Notification.js';

class NotificationController {
  getNotifications(req, res) {
    try {
      const notifications = Notification.findByUserId(req.user.userId);
      res.json(notifications);
    } catch (error) {
      console.error('Notifications fetch error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  markAsRead(req, res) {
    try {
      const { id } = req.params;
      
      Notification.markAsRead(id, req.user.userId);
      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Notification update error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new NotificationController(); 