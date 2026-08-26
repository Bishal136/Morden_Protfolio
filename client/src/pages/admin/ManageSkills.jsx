import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import {
  useGetAllSkillsAdminQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} from '../../features/skills/skillsApiSlice';
import Modal from '../../components/common/Modal';
import { getSkillIcon } from '../../components/common/SkillCard';
import { Skeleton } from '../../components/common/Skeleton';

export const ManageSkills = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: skills, isLoading } = useGetAllSkillsAdminQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createSkill, { isLoading: isCreating }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: isUpdating }] = useUpdateSkillMutation();
  const [deleteSkill, { isLoading: isDeleting }] = useDeleteSkillMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const categories = ['Frontend', 'Backend', 'Database', 'Language', 'Tools', 'Other'];

  const initialFormState = {
    name: '',
    icon: '',
    proficiency: 80,
    category: 'Frontend',
    order: 0,
    isVisible: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  const openCreateModal = () => {
    setEditingSkillId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkillId(skill._id);
    setFormData({
      name: skill.name || '',
      icon: skill.icon || '',
      proficiency: skill.proficiency || 80,
      category: skill.category || 'Frontend',
      order: skill.order !== undefined ? skill.order : 0,
      isVisible: skill.isVisible !== undefined ? skill.isVisible : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    try {
      if (editingSkillId) {
        await updateSkill({ id: editingSkillId, ...formData }).unwrap();
        setFeedback({ type: 'success', message: 'Skill updated successfully!' });
      } else {
        await createSkill(formData).unwrap();
        setFeedback({ type: 'success', message: 'Skill created successfully!' });
      }
      setIsModalOpen(false);
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      const detailedErrors = err?.data?.errors?.map((e) => e.message).join(', ');
      setFeedback({
        type: 'error',
        message: detailedErrors || err?.data?.message || 'Operation failed.',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSkill(id).unwrap();
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: 'Skill removed successfully.' });
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err?.data?.message || 'Failed to delete skill.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Manage Skills</h1>
          <p className="text-xs text-slate-400 mt-1">
            Update technical proficiencies, icon indicators, and skill order.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/30"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
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

      {/* Skills Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : skills && skills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-mono uppercase tracking-wider">
                  <th className="py-3.5 px-4">Skill</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Proficiency</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {skills.map((skill) => (
                  <tr
                    key={skill._id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center">
                          {getSkillIcon(skill.icon || skill.name, 16)}
                        </div>
                        <span className="font-bold text-slate-100 text-sm">
                          {skill.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {skill.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-blue-400 text-xs w-8">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {skill.order}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="p-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300 transition-colors"
                          title="Edit Skill"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(skill._id)}
                          className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 transition-colors"
                          title="Delete Skill"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            No skills found. Click "Add Skill" to create one.
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkillId ? 'Edit Skill' : 'Create New Skill'}
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. React.js, Node.js, C Language"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min={0}
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Proficiency Percentage *
              </label>
              <span className="font-mono font-bold text-blue-400 text-xs">
                {formData.proficiency}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={formData.proficiency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  proficiency: parseInt(e.target.value) || 0,
                })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
                className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
              />
              <span>Visible on Public Portfolio</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 disabled:opacity-50"
            >
              {isCreating || isUpdating
                ? 'Saving...'
                : editingSkillId
                ? 'Save Changes'
                : 'Create Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Confirm Skill Deletion"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete this skill?
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

export default ManageSkills;
