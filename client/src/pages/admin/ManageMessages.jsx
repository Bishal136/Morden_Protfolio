import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Reply,
  Check,
  RotateCcw,
  Clock,
  Inbox,
} from 'lucide-react';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import {
  useGetAllMessagesAdminQuery,
  useToggleMessageReadMutation,
  useDeleteMessageMutation,
} from '../../features/messages/messagesApiSlice';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import useDocumentTitle from '../../hooks/useDocumentTitle';

export const ManageMessages = () => {
  useDocumentTitle('Direct Messages | Admin Console');

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const { data: responseData, isLoading } = useGetAllMessagesAdminQuery(
    { filter },
    { skip: !isAuthenticated }
  );

  const messages = responseData?.data || [];
  const unreadCount = responseData?.unreadCount ?? 0;
  const totalCount = responseData?.totalCount ?? 0;

  const [toggleRead, { isLoading: isToggling }] = useToggleMessageReadMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  const [activeMessage, setActiveMessage] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await toggleRead(id).unwrap();
      showFeedback('success', `Message marked as ${currentStatus ? 'unread' : 'read'}.`);
      if (activeMessage && activeMessage._id === id) {
        setActiveMessage({ ...activeMessage, isRead: !currentStatus });
      }
    } catch (err) {
      showFeedback('error', err?.data?.message || 'Failed to update message status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id).unwrap();
      setDeleteConfirmId(null);
      if (activeMessage && activeMessage._id === id) {
        setActiveMessage(null);
      }
      showFeedback('success', 'Message deleted successfully.');
    } catch (err) {
      showFeedback('error', err?.data?.message || 'Failed to delete message.');
    }
  };

  const handleOpenMessage = async (msg) => {
    setActiveMessage(msg);
    if (!msg.isRead) {
      try {
        await toggleRead(msg._id).unwrap();
      } catch {
        // Soft fail
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Direct Inquiries</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/40 text-xs font-mono font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review, reply, and manage direct messages submitted through the public Contact page.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 p-1 rounded-xl self-start sm:self-center">
          <span className="text-[11px] font-mono text-slate-500 px-2 uppercase font-semibold hidden md:inline">
            Filter:
          </span>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'unread'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'read'
                ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Read ({Math.max(0, totalCount - unreadCount)})
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500/30 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Messages List Container */}
      <div className="bg-slate-900/60 border border-white/[0.08] rounded-3xl overflow-hidden backdrop-blur-md">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        ) : messages.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !msg.isRead
                    ? 'bg-sky-950/20 hover:bg-sky-950/30 border-l-4 border-l-sky-400'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Message Overview */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-2xl border flex items-center justify-center font-bold text-sm shrink-0 font-mono ${
                      !msg.isRead
                        ? 'bg-sky-950/80 border-sky-400/50 text-sky-300'
                        : 'bg-slate-800/80 border-white/10 text-slate-400'
                    }`}
                  >
                    {(msg.name || 'U').charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-100 truncate">{msg.name}</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-sky-400 hover:underline font-mono"
                      >
                        &lt;{msg.email}&gt;
                      </a>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-mono font-bold border border-sky-400/30">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-300 truncate">
                      {msg.subject || 'General Inquiry'}
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-500">
                      <Clock size={11} />
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleOpenMessage(msg)}
                    className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="View Full Message"
                  >
                    <Eye size={14} className="text-sky-400" />
                    <span>View</span>
                  </button>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(
                      msg.subject || 'Portfolio Inquiry'
                    )}`}
                    className="p-2 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-400/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Reply via Email"
                  >
                    <Reply size={14} />
                    <span className="hidden sm:inline">Reply</span>
                  </a>

                  <button
                    onClick={() => handleToggleRead(msg._id, msg.isRead)}
                    disabled={isToggling}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center transition-colors ${
                      msg.isRead
                        ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200'
                        : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                    }`}
                    title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {msg.isRead ? <RotateCcw size={14} /> : <Check size={14} />}
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(msg._id)}
                    disabled={isDeleting}
                    className="p-2 rounded-xl bg-white/[0.02] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-white/10 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-sky-950/50 border border-sky-800/40 flex items-center justify-center text-sky-400 mx-auto">
              <Inbox size={24} />
            </div>
            <p className="text-base font-bold text-slate-200">No Direct Messages Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {filter === 'unread'
                ? 'You have answered all incoming inquiries! No unread messages.'
                : 'Direct messages submitted through the public Contact page will appear here.'}
            </p>
          </div>
        )}
      </div>

      {/* VIEW FULL MESSAGE MODAL */}
      <Modal
        isOpen={Boolean(activeMessage)}
        onClose={() => setActiveMessage(null)}
        title="Direct Inquiry Details"
        maxWidth="max-w-xl"
      >
        {activeMessage && (
          <div className="space-y-5 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    From
                  </span>
                  <span className="font-bold text-white text-sm">{activeMessage.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                    Date
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    {new Date(activeMessage.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  Email Address
                </span>
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="text-sky-400 hover:underline font-mono text-xs"
                >
                  {activeMessage.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block">
                  Subject
                </span>
                <span className="text-slate-200 font-semibold">{activeMessage.subject}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold block">
                Message Content
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-xs sm:text-sm">
                {activeMessage.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <button
                onClick={() => handleToggleRead(activeMessage._id, activeMessage.isRead)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {activeMessage.isRead ? <RotateCcw size={13} /> : <Check size={13} />}
                <span>{activeMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                    activeMessage.subject
                  )}`}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Reply size={14} />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Inquiry"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-300">
            Are you sure you want to permanently delete this message? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirmId)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-md shadow-rose-600/30"
            >
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageMessages;
