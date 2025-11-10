import React, { useState, useEffect } from 'react';
import { 
  IconButton, Badge, Menu, MenuItem, Typography, Box, Divider 
} from '@mui/material';
import { Notifications, NotificationsNone } from '@mui/icons-material';
import api from '../../services/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      fetchNotifications();
      // Fetch notifications every 5 minutes instead of constantly
      const interval = setInterval(fetchNotifications, 300000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await api.get('/api/notifications');
      
      const notifs = response.data.notifications || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/notifications/${notificationId}/read`, {});
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { width: 320, maxHeight: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        
        {(!notifications || notifications.length === 0) ? (
          <MenuItem>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          (notifications || []).slice(0, 5).map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                if (!notification.read) {
                  markAsRead(notification.id);
                }
                handleClose();
              }}
              sx={{ 
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                whiteSpace: 'normal',
                py: 1
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={notification.read ? 'normal' : 'bold'}>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;