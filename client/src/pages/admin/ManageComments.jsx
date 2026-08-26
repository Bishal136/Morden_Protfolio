import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  CheckCircle,
  EyeOff,
  Eye,
  Trash2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import {
  useGetAllCommentsAdminQuery,
  useToggleCommentApprovalMutation,
  useDeleteCommentMutation,
} from '../../features/comments/commentsApiSlice';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';

export const ManageComments = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: comments, isLoading } = useGetAllCommentsAdminQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleApproval, { isLoading: isToggling }] = useToggleCommentApprovalMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const handleToggle = async (id) => {
    try {
      const res = await toggleApproval(id).unwrap();
      setFeedback({ type: 'success', message: res.message || 'Updated status.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.data?.message || 'Failed to update comment status.',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteComment(id).unwrap();
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: 'Comment deleted successfully.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.data?.message || 'Failed to delete comment.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Comment Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review, approve, hide, or delete public visitor comments across all projects.
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/80 border border-red-800 text-red-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Comments List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : comments && comments.length > 0 ? (
          <div className="divide-y divide-slate-800/80">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="p-5 hover:bg-slate-800/30 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center font-bold text-xs text-blue-300">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-sm">
                          {comment.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({comment.role || 'Visitor'})
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {comment.project && (
                      <Link
                        to={`/projects/${comment.project.slug}`}
                        target="_blank"
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800"
                      >
                        <span>{comment.project.title}</span>
                        <ExternalLink size={12} />
                      </Link>
                    )}

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        comment.approved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {comment.approved ? 'Visible' : 'Hidden'}
                    </span>

                    <button
                      onClick={() => handleToggle(comment._id)}
                      disabled={isToggling}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title={comment.approved ? 'Hide Comment' : 'Approve Comment'}
                    >
                      {comment.approved ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(comment._id)}
                      className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            No visitor comments found.
          </div>
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Comment Deletion"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to permanently delete this comment?
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmId(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirmId)}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md shadow-red-600/30"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageComments;
