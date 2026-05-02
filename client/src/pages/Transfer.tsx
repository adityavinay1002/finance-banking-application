import React, { useState } from 'react';
import { SendHorizontal, User, IndianRupee, MessageSquare, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
  const [receiverIdOrEmail, setReceiverIdOrEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverIdOrEmail || !amount || Number(amount) <= 0) {
      toast.error('Please provide valid receiver and amount');
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.post('/transactions/transfer', {
        receiverIdOrEmail,
        amount: Number(amount),
        description
      });
      toast.success(data.message);
      await refreshUser();
      navigate('/history');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <SendHorizontal className="text-blue-500" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Transfer Money</h2>
            <p className="text-gray-400 text-sm">Send funds instantly to any Blue Wave user</p>
          </div>
        </div>

        <form onSubmit={handleTransfer} className="space-y-6">
          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <User size={14} /> Receiver User ID or Email
            </label>
            <input
              type="text"
              value={receiverIdOrEmail}
              onChange={(e) => setReceiverIdOrEmail(e.target.value)}
              className="w-full p-4 bg-gray-700/50 rounded-xl text-white border border-gray-600 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. USER12345 or john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <IndianRupee size={14} /> Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-4 bg-gray-700/50 rounded-xl text-white border border-gray-600 focus:border-blue-500 outline-none transition-all"
              placeholder="Enter amount to send"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <MessageSquare size={14} /> Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-gray-700/50 rounded-xl text-white border border-gray-600 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="What is this for?"
              rows={3}
            />
          </div>

          <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-800/30 flex gap-3 items-start">
            <ShieldCheck className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-200/70">
              Funds will be transferred instantly. Please verify the receiver's identity before proceeding.
            </p>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing Transfer...' : 'Confirm Transfer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
