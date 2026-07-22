'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Comment {
  id: string;
  author: string;
  authorLevel: number;
  text: string;
  likes: number;
  createdAt: string;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'Priya Sundaram',
    authorLevel: 6,
    text: 'Great verified hospital location! Emergency entrance is accessible directly from the main bypass road.',
    likes: 5,
    createdAt: '2 days ago',
  },
  {
    id: 'c2',
    author: 'Alex Chen',
    authorLevel: 5,
    text: 'Updated building footprint boundaries match recent high-resolution satellite imagery.',
    likes: 2,
    createdAt: '1 day ago',
  },
];

export const PlaceComments: React.FC<{ placeName: string }> = ({ placeName }) => {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      author: 'You (Local Explorer)',
      authorLevel: 3,
      text: newCommentText,
      likes: 0,
      createdAt: 'Just now',
    };

    setComments([newComment, ...comments]);
    setNewCommentText('');
  };

  const handleLike = (id: string) => {
    setComments(
      comments.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <MessageSquare className="text-cyan-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">
          Community Discussions for {placeName}
        </h3>
        <span className="text-xs text-slate-400 font-mono">({comments.length} comments)</span>
      </div>

      {/* Add Comment Input */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Share geographic insights or accessibility notes..."
          className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyan-500"
        />
        <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
          <Send className="w-3.5 h-3.5" /> Post
        </Button>
      </form>

      {/* Comment List */}
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  L{comment.authorLevel}
                </div>
                <span className="text-xs font-bold text-slate-200">{comment.author}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">{comment.createdAt}</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{comment.text}</p>

            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => handleLike(comment.id)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{comment.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
