import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Edit, Trash2, XCircle } from 'lucide-react';

// --- Mock Data ---
const initialTransactions = [
  { id: 1, description: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary', date: '2023-10-01' },
  { id: 2, description: 'Groceries', amount: 150, type: 'expense', category: 'Food', date: '2023-10-03' },
  { id: 3, description: 'Internet Bill', amount: 60, type: 'expense', category: 'Bills', date: '2023-10-05' },
  { id: 4, description: 'Freelance Project', amount: 750, type: 'income', category: 'Freelance', date: '2023-10-07' },
  { id: 5, description: 'Dinner Out', amount: 45, type: 'expense', category: 'Food', date: '2023-10-08' },
];

// --- Main App Component ---
export default function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const handleShowForm = (transaction = null) => {
    setTransactionToEdit(transaction);
    setIsFormVisible(true);
  };

  const handleHideForm = () => {
    setIsFormVisible(false);
    setTransactionToEdit(null);
  };

  const handleAddOrUpdateTransaction = (transactionData) => {
    if (transactionToEdit) {
      // Update existing transaction
      setTransactions(transactions.map(t => 
        t.id === transactionToEdit.id ? { ...t, ...transactionData } : t
      ));
    } else {
      // Add new transaction
      const transactionWithId = { 
        ...transactionData, 
        id: Date.now() 
      };
      setTransactions([transactionWithId, ...transactions]);
    }
    handleHideForm();
  };

  const handleDeleteTransaction = (idToDelete) => {
    setTransactions(transactions.filter(t => t.id !== idToDelete));
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Header />
      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
        <DashboardMetrics transactions={transactions} />
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Transactions</h2>
            {!isFormVisible && (
              <button
                onClick={() => handleShowForm()}
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
              >
                <PlusCircle size={20} />
                Add Transaction
              </button>
            )}
          </div>

          {isFormVisible && (
            <TransactionForm 
              onSubmit={handleAddOrUpdateTransaction}
              onCancel={handleHideForm}
              initialData={transactionToEdit}
            />
          )}
          
          <TransactionList 
            transactions={transactions} 
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleShowForm}
          />
        </div>
      </main>
    </div>
  );
}

// --- Sub-components ---

function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl font-bold text-indigo-600">Personal Finance Dashboard</h1>
      </div>
    </header>
  );
}

function DashboardMetrics({ transactions }) {
    const metrics = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;
        return { income, expenses, balance };
    }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard 
        title="Total Income" 
        amount={metrics.income} 
        icon={<TrendingUp className="text-green-500" size={28} />} 
      />
      <MetricCard 
        title="Total Expenses" 
        amount={metrics.expenses} 
        icon={<TrendingDown className="text-red-500" size={28} />} 
      />
      <MetricCard 
        title="Current Balance" 
        amount={metrics.balance} 
        icon={<span className="text-indigo-500 font-bold text-2xl">∑</span>}
      />
    </div>
  );
}

function MetricCard({ title, amount, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transform hover:scale-105 transition-transform duration-300">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-3xl font-bold ${amount < 0 ? 'text-red-600' : 'text-gray-800'}`}>
          ${amount.toLocaleString()}
        </p>
      </div>
      <div className={`bg-gray-100 p-3 rounded-full`}>
        {icon}
      </div>
    </div>
  );
}

function TransactionForm({ onSubmit, onCancel, initialData }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  const isEditing = !!initialData;

  useEffect(() => {
    if (isEditing) {
      setDescription(initialData.description);
      setAmount(initialData.amount);
      setType(initialData.type);
      setCategory(initialData.category);
      setDate(initialData.date);
    } else {
      // Set defaults for new transaction
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [initialData, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!description || !amount || !category || !date) {
      alert('Please fill out all fields.');
      return;
    }
    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8 animate-fade-in-down">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{isEditing ? 'Edit Transaction' : 'Add New Transaction'}</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <XCircle size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description" 
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
        />
        <input 
          type="number" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount" 
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
        />
        <select 
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input 
          type="text" 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category" 
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
        />
        <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" 
        />
        <button 
          type="submit" 
          className="md:col-span-2 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
        >
          {isEditing ? 'Save Changes' : 'Add Transaction'}
        </button>
      </form>
    </div>
  );
}

function TransactionList({ transactions, onDeleteTransaction, onEditTransaction }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide">Description</th>
              <th className="p-3 text-sm font-semibold tracking-wide">Amount</th>
              <th className="p-3 text-sm font-semibold tracking-wide hidden sm:table-cell">Category</th>
              <th className="p-3 text-sm font-semibold tracking-wide hidden md:table-cell">Date</th>
              <th className="p-3 text-sm font-semibold tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3">
                  <p className="font-bold">{t.description}</p>
                </td>
                <td className={`p-3 font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                </td>
                <td className="p-3 hidden sm:table-cell">
                  <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">{t.category}</span>
                </td>
                <td className="p-3 text-gray-600 hidden md:table-cell">{t.date}</td>
                <td className="p-3 flex items-center gap-2">
                  <button onClick={() => onEditTransaction(t)} className="text-gray-500 hover:text-indigo-600">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteTransaction(t.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
