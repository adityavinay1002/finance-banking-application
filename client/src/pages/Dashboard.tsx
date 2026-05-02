import React, { useState } from 'react';
import { Landmark, Eye, PlusCircle, Wallet, Lock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [showBalance, setShowBalance] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/user/verify-password', { password });
      setShowBalance(true);
      setShowPasswordModal(false);
      setPassword('');
    } catch (error: any) {
      toast.error('Invalid password');
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addAmount || Number(addAmount) <= 0) return;
    setLoading(true);
    try {
      await API.post('/transactions/credit', { amount: addAmount });
      toast.success(`Successfully added ₹${addAmount}`);
      setAddAmount('');
      await refreshUser();
    } catch (error: any) {
      toast.error('Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-white">Welcome, {user?.name}!</h2>
          <p className="text-blue-400 font-mono mt-1">User ID: {user?.userId}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Current Balance</p>
          <div className="flex items-center gap-3 justify-end mt-1">
            <h3 className="text-2xl font-bold text-white">
              {showBalance ? `₹${user?.currentBalance?.toLocaleString()}` : '••••••'}
            </h3>
            <button
              onClick={() => showBalance ? setShowBalance(false) : setShowPasswordModal(true)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-blue-400"
            >
              {showBalance ? <X size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Money Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <PlusCircle className="text-green-500" />
            <h3 className="text-xl font-semibold text-white">Add Money to Wallet</h3>
          </div>
          <form onSubmit={handleAddMoney} className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                placeholder="Enter amount"
                required
              />
            </div>
            <button
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded transition-all flex items-center justify-center gap-2"
            >
              <Wallet size={18} />
              {loading ? 'Processing...' : 'Add Money'}
            </button>
          </form>
        </div>

        {/* Info Cards or Quick Links */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex flex-col justify-center text-center space-y-4">
          <Landmark size={48} className="mx-auto text-blue-500" />
          <h3 className="text-xl font-semibold text-white">Secure Transactions</h3>
          <p className="text-gray-400">All your transfers are protected with end-to-end encryption and real-time monitoring.</p>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <Lock className="text-blue-500" />
                <h2 className="text-2xl font-bold text-white">Security Check</h2>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-400 mb-6">Please enter your login password to view your account balance.</p>
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-700 rounded-xl text-white border border-gray-600 focus:border-blue-500 outline-none"
                autoFocus
                required
              />
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20">
                Confirm & View
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
