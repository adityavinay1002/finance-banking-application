import React, { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  _id: string;
  senderId: string;
  receiverId?: string;
  type: 'credit' | 'debit' | 'transfer';
  amount: number;
  status: 'success' | 'failed';
  description: string;
  reason?: string;
  createdAt: string;
}

const TransactionHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await API.get('/transactions');
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.senderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.receiverId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-white text-center py-10">Loading transactions...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Transaction History</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by ID, type or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-white border border-gray-700 focus:border-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Transaction</th>
                <th className="p-4 font-medium">Partner / ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.map((t) => {
                const isOutgoing = t.senderId === user?.userId && t.type !== 'credit';
                const partner = isOutgoing ? t.receiverId : (t.type === 'credit' ? 'Self (Wallet)' : t.senderId);
                
                return (
                  <tr key={t._id} className="hover:bg-gray-750 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          t.type === 'credit' ? 'bg-green-500/10 text-green-500' : 
                          isOutgoing ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {t.type === 'credit' ? <ArrowDownLeft size={20} /> : 
                           isOutgoing ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                        </div>
                        <div>
                          <p className="text-white font-medium capitalize">{t.type}</p>
                          <p className="text-gray-500 text-xs">{t.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 font-mono text-sm">{partner}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock size={14} />
                        {new Date(t.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        t.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {t.status === 'success' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {t.status}
                      </span>
                      {t.status === 'failed' && <p className="text-[10px] text-red-400/70 mt-1">{t.reason}</p>}
                    </td>
                    <td className={`p-4 text-right font-bold ${
                      t.status === 'failed' ? 'text-gray-500' :
                      isOutgoing ? 'text-blue-400' : 'text-green-400'
                    }`}>
                      {isOutgoing ? '-' : '+'}₹{t.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="py-20 text-center space-y-3">
              <div className="bg-gray-700/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-gray-500">
                <Clock size={32} />
              </div>
              <p className="text-gray-400">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
