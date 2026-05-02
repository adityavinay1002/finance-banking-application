import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  // States for forms
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First verify password
      await API.post('/user/verify-password', { password: emailPassword });
      await API.put('/user/change-email', { newEmail });
      toast.success('Email updated successfully');
      setNewEmail('');
      setEmailPassword('');
      await refreshUser();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.put('/user/change-password', { oldPassword, newPassword });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password change failed');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/user/verify-password', { password: deletePassword });
      await API.delete('/user/delete-account');
      toast.success('Account deleted successfully');
      logout();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Deletion failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-gray-800 rounded-xl">
          <User className="text-blue-500" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Account Settings</h2>
          <p className="text-gray-400 text-sm">Manage your security and profile preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Email Section */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <Mail className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Update Email</h3>
          </div>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">New Email Address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-3 bg-gray-900/50 rounded-xl text-white border border-gray-700 focus:border-blue-500 outline-none"
                placeholder="new@example.com"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Confirm Password</label>
              <input
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                className="w-full p-3 bg-gray-900/50 rounded-xl text-white border border-gray-700 focus:border-blue-500 outline-none"
                placeholder="Enter password to save"
                required
              />
            </div>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
              Update Email
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg space-y-6">
          <div className="flex items-center gap-3">
            <Lock className="text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-white">Change Password</h3>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-3 bg-gray-900/50 rounded-xl text-white border border-gray-700 focus:border-blue-500 outline-none"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 bg-gray-900/50 rounded-xl text-white border border-gray-700 focus:border-blue-500 outline-none"
                placeholder="Min. 8 characters"
                required
              />
            </div>
            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
              Change Password
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/10 p-8 rounded-2xl border border-red-900/20 space-y-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="text-red-500" size={24} />
          <h3 className="text-xl font-bold text-white">Danger Zone</h3>
        </div>
        <p className="text-gray-400 text-sm max-w-2xl">
          Deleting your account will permanently remove all your personal information, current balance, and full transaction history. This action cannot be undone.
        </p>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <Trash2 size={18} />
            Delete My Account
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="max-w-md space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 mb-4">
              <p className="text-red-200 text-xs flex gap-2">
                <ShieldCheck size={14} className="shrink-0" />
                Final Confirmation: Please enter your password to permanently delete account.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="flex-1 p-3 bg-gray-900 rounded-xl text-white border border-red-900/30 focus:border-red-500 outline-none"
                placeholder="Confirm password"
                autoFocus
                required
              />
              <button
                disabled={loading}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-3 bg-gray-800 text-gray-400 font-bold rounded-xl hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
