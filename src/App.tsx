{/* I'll provide the complete updated App.tsx content with the requested changes. However, due to length, I need to split it into multiple parts for readability */}

{/* First part of App.tsx */}
import React, { useState, useEffect } from 'react';
import { Landmark, Home, History, SendHorizontal, Settings, User, LogOut, Eye, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Bank {
  name: string;
  accountNo: string;
  balance: number;
}

interface Transaction {
  from: string;
  to: string;
  amount: number;
  date: string;
  bankName: string;
}

interface User {
  fullName: string;
  email: string;
  password: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showTotalSpent, setShowTotalSpent] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [showBankDetails, setShowBankDetails] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [bankPasswordError, setBankPasswordError] = useState('');
  const [bankDetailsVisible, setBankDetailsVisible] = useState<{[key: string]: boolean}>({});

  const [banks, setBanks] = useState<Bank[]>([
    { name: 'Union Bank', accountNo: '1234567890', balance: 50000 },
    { name: 'Axis Bank', accountNo: '2345678901', balance: 75000 },
    { name: 'HDFC Bank', accountNo: '3456789012', balance: 60000 },
    { name: 'ICICI Bank', accountNo: '4567890123', balance: 80000 }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      
      const savedTransactions = localStorage.getItem(`transactions_${user.email}`);
      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
      
      const savedBanks = localStorage.getItem(`banks_${user.email}`);
      if (savedBanks) {
        setBanks(JSON.parse(savedBanks));
      }
    }
  }, []);

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === loginEmail && u.password === loginPassword);
    
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowLogin(false);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      const userTransactions = localStorage.getItem(`transactions_${user.email}`);
      if (userTransactions) {
        setTransactions(JSON.parse(userTransactions));
      }
      
      const userBanks = localStorage.getItem(`banks_${user.email}`);
      if (userBanks) {
        setBanks(JSON.parse(userBanks));
      }
      
      setLoginEmail('');
      setLoginPassword('');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((u: User) => u.email === signupEmail);
    
    if (userExists) {
      toast.error('User already exists');
      return;
    }
    
    const newUser = {
      fullName: signupFullName,
      email: signupEmail,
      password: signupPassword
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem(`banks_${signupEmail}`, JSON.stringify(banks));
    localStorage.setItem(`transactions_${signupEmail}`, JSON.stringify([]));
    
    setShowSignup(false);
    toast.success('Account created successfully');
    
    setSignupFullName('');
    setSignupEmail('');
    setSignupPassword('');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setActiveTab('home');
    setShowProfileMenu(false);
  };

  const handleTransfer = () => {
    if (!isLoggedIn) {
      toast.error('Please login to transfer funds');
      return;
    }

    if (!selectedBank || !transferAmount || !recipientName) {
      toast.error('Please fill all fields');
      return;
    }

    if (bankPassword !== currentUser?.password) {
      setBankPasswordError('Incorrect password');
      return;
    }

    const amount = parseFloat(transferAmount);
    const updatedBanks = banks.map(bank => {
      if (bank.name === selectedBank) {
        if (bank.balance < amount) {
          toast.error('Insufficient balance');
          return bank;
        }
        return { ...bank, balance: bank.balance - amount };
      }
      return bank;
    });

    const newTransaction = {
      from: selectedBank,
      to: recipientName,
      amount: amount,
      date: new Date().toISOString(),
      bankName: selectedBank
    };

    setBanks(updatedBanks);
    setTransactions([...transactions, newTransaction]);

    if (currentUser) {
      localStorage.setItem(`banks_${currentUser.email}`, JSON.stringify(updatedBanks));
      localStorage.setItem(`transactions_${currentUser.email}`, JSON.stringify([...transactions, newTransaction]));
    }

    toast.success(`Transferred ${amount} successfully`);
    setSelectedBank('');
    setTransferAmount('');
    setRecipientName('');
    setBankPassword('');
    setBankPasswordError('');
    setShowPasswordPrompt(false);
  };

  const handleChangePassword = () => {
    if (currentPassword !== currentUser?.password) {
      toast.error('Current password is incorrect');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => {
      if (u.email === currentUser.email) {
        return { ...u, password: newPassword };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    if (currentUser) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    toast.success('Password updated successfully');
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleChangeEmail = () => {
    if (currentPassword !== currentUser?.password) {
      toast.error('Password is incorrect');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => {
      if (u.email === currentUser.email) {
        return { ...u, email: newEmail };
      }
      return u;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    if (currentUser) {
      const updatedUser = { ...currentUser, email: newEmail };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    toast.success('Email updated successfully');
    setShowChangeEmail(false);
    setCurrentPassword('');
    setNewEmail('');
  };

  const handleViewBankDetails = (bankName: string) => {
    if (bankPassword === currentUser?.password) {
      setBankDetailsVisible(prev => ({
        ...prev,
        [bankName]: true
      }));
      setBankPasswordError('');
      setBankPassword('');
      setShowPasswordPrompt(false);
    } else {
      setBankPasswordError('Incorrect password');
    }
  };

  const calculateTotalSpent = () => {
    const today = new Date().toISOString().split('T')[0];
    return transactions
      .filter(t => t.date.startsWith(today))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const filteredTransactions = transactions.filter(t => 
    t.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.bankName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Landmark size={24} />
          <h1 className="text-2xl font-bold">BLUE WAVE BANKING</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <button onClick={() => setShowLogin(true)} className="px-4 py-2 bg-blue-600 rounded">Login</button>
              <button onClick={() => setShowSignup(true)} className="px-4 py-2 bg-green-600 rounded">Sign Up</button>
            </>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <span>{currentUser?.fullName}</span>
                <User size={24} />
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-lg p-2">
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded w-full">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 p-2 rounded ${activeTab === 'home' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Home size={20} />
              <span>Home</span>
            </button>
            
            <button
              onClick={() => isLoggedIn ? setActiveTab('banks') : toast.error('Please login to view banks')}
              className={`flex items-center gap-2 p-2 rounded ${activeTab === 'banks' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Landmark size={20} />
              <span>My Banks</span>
            </button>
            
            <button
              onClick={() => isLoggedIn ? setActiveTab('history') : toast.error('Please login to view history')}
              className={`flex items-center gap-2 p-2 rounded ${activeTab === 'history' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <History size={20} />
              <span>Transaction History</span>
            </button>
            
            <button
              onClick={() => isLoggedIn ? setActiveTab('transfer') : toast.error('Please login to transfer funds')}
              className={`flex items-center gap-2 p-2 rounded ${activeTab === 'transfer' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <SendHorizontal size={20} />
              <span>Transfer Funds</span>
            </button>
            
            <button
              onClick={() => isLoggedIn ? setActiveTab('settings') : toast.error('Please login to access settings')}
              className={`flex items-center gap-2 p-2 rounded ${activeTab === 'settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'home' && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Welcome to Blue Wave Banking</h2>
              <p className="text-lg mb-8">
                Blue Wave Banking is your all-in-one solution for secure and seamless financial management. 
                Our platform manages your finances with ease and security. Connect your banks, track transactions, 
                and transfer funds seamlessly.
              </p>
              <img
                src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=1000&q=80"
                alt="Banking"
                className="mx-auto rounded-lg shadow-lg max-w-2xl"
              />
            </div>
          )}

          {activeTab === 'banks' && isLoggedIn && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Banks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {banks.map(bank => (
                  <div key={bank.name} className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">{bank.name}</h3>
                    {!bankDetailsVisible[bank.name] ? (
                      <>
                        <button
                          onClick={() => {
                            setShowBankDetails(bank.name);
                            setShowPasswordPrompt(true);
                            setBankPassword('');
                            setBankPasswordError('');
                          }}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                        >
                          <Eye size={18} />
                          <span>View Details</span>
                        </button>
                        
                        {showBankDetails === bank.name && showPasswordPrompt && (
                          <div className="mt-4">
                            {bankPasswordError && (
                              <p className="text-red-500 text-sm mb-2">{bankPasswordError}</p>
                            )}
                            <input
                              type="password"
                              placeholder="Enter password"
                              value={bankPassword}
                              onChange={(e) => setBankPassword(e.target.value)}
                              className="w-full p-2 mb-2 bg-gray-700 rounded"
                            />
                            <button
                              onClick={() => handleViewBankDetails(bank.name)}
                              className="bg-blue-600 px-4 py-2 rounded"
                            >
                              Submit
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="mt-4">
                        <p className="mb-2">Account: {bank.accountNo}</p>
                        <p className="mb-4">Balance: ₹{bank.balance}</p>
                        <button
                          onClick={() => setBankDetailsVisible(prev => ({
                            ...prev,
                            [bank.name]: false
                          }))}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Hide Details
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && isLoggedIn && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
              <div className="mb-4">
                <div className="flex items-center gap-2 bg-gray-800 rounded p-2">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search by recipient or bank name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent outline-none w-full"
                  />
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-700">
                      <th className="p-4 text-left">Date</th>
                      <th className="p-4 text-left">Bank</th>
                      <th className="p-4 text-left">Recipient</th>
                      <th className="p-4 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t, i) => (
                      <tr key={i} className="border-t border-gray-700">
                        <td className="p-4">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="p-4">{t.from}</td>
                        <td className="p-4">{t.to}</td>
                        <td className="p-4">₹{t.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transfer' && isLoggedIn && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Transfer Funds</h2>
              <div className="bg-gray-800 p-6 rounded-lg max-w-md">
                <div className="mb-4">
                  <label className="block mb-2">Select Bank</label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                  >
                    <option value="">Select a bank</option>
                    {banks.map(bank => (
                      <option key={bank.name} value={bank.name}>{bank.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter recipient name"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Amount</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter amount"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-2">Password</label>
                  {bankPasswordError && (
                    <p className="text-red-500 text-sm mb-2">{bankPasswordError}</p>
                  )}
                  <input
                    type="password"
                    value={bankPassword}
                    onChange={(e) => setBankPassword(e.target.value)}
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="Enter your password"
                  />
                </div>
                
                <button
                  onClick={handleTransfer}
                  className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700"
                >
                  Transfer
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && isLoggedIn && (
            <div>
              <h2 className="text-2xl font-bold mb-6"></h2>
              <div className="bg-gray-800 p-6 rounded-lg max-w-md">
                <div className="mb-6">
                  <h3 className="text-xl mb-2"></h3>
                  <p>Name: {currentUser?.fullName}</p>
                  <p>Email: {currentUser?.email}</p>
                </div>
                
                <div className="mb-6">
                  <button
                    onClick={() => setShowTotalSpent(!showTotalSpent)}
                    className="bg-blue-600 px-4 py-2 rounded mb-2"
                  >
                    Total Spendings Today
                  </button>
                  {showTotalSpent && (
                    <p>Total spent today: ₹{calculateTotalSpent()}</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full bg-gray-700 p-2 rounded hover:bg-gray-600"
                  >
                    Change Password
                  </button>
                  
                  <button
                    onClick={() => setShowChangeEmail(true)}
                    className="w-full bg-gray-700 p-2 rounded hover:bg-gray-600"
                  >
                    Update Email
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex gap-4">
              <button
                onClick={handleLogin}
                className="flex-1 bg-blue-600 p-2 rounded hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setLoginEmail('');
                  setLoginPassword('');
                }}
                className="flex-1 bg-gray-700 p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <input
              type="text"
              placeholder="Full Name"
              value={signupFullName}
              onChange={(e) => setSignupFullName(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex gap-4">
              <button
                onClick={handleSignup}
                className="flex-1 bg-green-600 p-2 rounded hover:bg-green-700"
              >
                Create Account
              </button>
              <button
                onClick={() => {
                  setShowSignup(false);
                  setSignupFullName('');
                  setSignupEmail('');
                  setSignupPassword('');
                }}
                className="flex-1 bg-gray-700 p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex gap-4">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-blue-600 p-2 rounded hover:bg-blue-700"
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setCurrentPassword('');
                  setNewPassword('');
                }}
                className="flex-1 bg-gray-700 p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Email Modal */}
      {showChangeEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Update Email</h2>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 rounded"
            />
            <div className="flex gap-4">
              <button
                onClick={handleChangeEmail}
                className="flex-1 bg-blue-600 p-2 rounded hover:bg-blue-700"
              >
                Update Email
              </button>
              <button
                onClick={() => {
                  setShowChangeEmail(false);
                  setCurrentPassword('');
                  setNewEmail('');
                }}
                className="flex-1 bg-gray-700 p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;