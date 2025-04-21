// PaymentForm.jsx
import { useState } from 'react';
import axios from 'axios';

const PaymentForm = ({ orderId, totalAmount, paidAmount, onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    receivingDate: '',
    paymentMode: 'Online Transfer',
    remark: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/payments`,
        { ...formData, orderId }
      );
      
      onPaymentSuccess(res.data);
      setFormData({
        amount: '',
        receivingDate: '',
        paymentMode: 'Online Transfer',
        remark: ''
      });
    } catch (err) {
      console.error('Error submitting payment:', err);
    }
  };

  const balanceDue = totalAmount - paidAmount;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">Add Payment</h2>
      <p className="text-sm text-gray-600 mb-4">Balance Due: ₹{balanceDue}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Amount"
              required
              max={balanceDue}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Receiving Date</label>
            <input
              type="date"
              name="receivingDate"
              value={formData.receivingDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Online Transfer">Online Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter remark..."
            rows="2"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;