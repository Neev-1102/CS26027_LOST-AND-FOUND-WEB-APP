import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Bell, CheckCheck, Trash2, Sparkles, FileCheck, Info } from 'lucide-react';
import { timeAgo } from '../../utils/formatters';

const StudentNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map((n) => ((n._id || n.id) === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications(notifications.filter((n) => (n._id || n.id) !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'match': return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'claim': return <FileCheck className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Notifications</h1>
          <p className="text-xs text-slate-500">Alerts for match suggestions, claim updates, and custody handovers.</p>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllRead} icon={CheckCheck}>
            Mark All Read
          </Button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are completely caught up! We will alert you when matches or claim status updates occur."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const notifId = notif._id || notif.id;
            return (
              <div
                key={notifId}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  notif.isRead
                    ? 'bg-white border-slate-200'
                    : 'bg-blue-50/40 border-blue-200 shadow-xs ring-1 ring-blue-100'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 mt-0.5">{getIcon(notif.type)}</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {notif.title}
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                    <span className="text-[11px] font-semibold text-slate-400 block mt-2">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notifId)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg text-xs"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notifId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentNotificationsPage;
