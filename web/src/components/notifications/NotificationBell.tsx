'use client';

import React, { useState } from 'react';
import { SAMPLE_NOTIFICATIONS, NotificationItem } from '@geoatlas/core';
import { Bell, CheckCircle2, Award, Zap, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(SAMPLE_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition"
        title="In-App Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Bell className="w-4 h-4 text-cyan-400" /> Notifications
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-cyan-400 hover:underline font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 flex items-start gap-3 transition ${
                    n.isRead ? 'bg-slate-900/40 opacity-70' : 'bg-slate-900 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {n.type === 'edit_approved' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : n.type === 'badge_unlocked' ? (
                      <Award className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Zap className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-200">{n.title}</div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{n.message}</p>
                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-500 font-mono">
                      <span>{n.createdAt}</span>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setIsOpen(false)}
                          className="text-cyan-400 hover:underline"
                        >
                          View details $\rightarrow$
                        </Link>
                      )}
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
};
