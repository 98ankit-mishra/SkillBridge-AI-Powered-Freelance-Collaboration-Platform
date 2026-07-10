import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    if (!user) return;
    
    // Fetch initial notifications
    api.get('/notifications').then(res => {
      setNotifications(res.data.data);
      setUnreadCount(res.data.data.filter(n => !n.isRead).length);
    }).catch(console.error);
    
    // Setup socket connection
    const token = localStorage.getItem('token');
    const socket = io('http://localhost:5000', {
      auth: { token }
    });
    
    socket.on('notification:new', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });
    
    return () => socket.disconnect();
  }, [user]);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative flex items-center justify-center w-12 h-12 border-4 border-black transition-colors ${isOpen ? 'bg-[var(--color-swiss-red)] text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
      >
        <span className="font-black text-xl leading-none">!</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[var(--color-swiss-red)] text-white text-xs font-bold px-2 py-1 border-2 border-black">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center border-b-4 border-black p-4 bg-muted swiss-noise">
            <h3 className="font-black text-lg tracking-widest uppercase">ALERTS</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs font-bold uppercase tracking-widest hover:text-[var(--color-swiss-red)] transition-colors">
                MARK ALL READ
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm font-bold uppercase tracking-widest opacity-50">
                NO SYSTEM ALERTS.
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`p-4 border-b-2 border-black last:border-b-0 hover:bg-muted transition-colors ${!notification.isRead ? 'border-l-8 border-l-[var(--color-swiss-red)]' : 'border-l-8 border-l-transparent'}`}
                >
                  <p className="text-sm font-medium mb-3">{notification.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                    <div className="flex gap-4">
                      {!notification.isRead && (
                        <button onClick={() => markAsRead(notification._id)} className="text-xs font-bold uppercase tracking-widest hover:text-[var(--color-swiss-red)] transition-colors">
                          READ
                        </button>
                      )}
                      <Link 
                        to={notification.link} 
                        onClick={() => {
                          markAsRead(notification._id);
                          setIsOpen(false);
                        }}
                        className="text-xs font-bold uppercase tracking-widest text-white bg-black px-2 py-1 hover:bg-[var(--color-swiss-red)] transition-colors"
                      >
                        VIEW
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
