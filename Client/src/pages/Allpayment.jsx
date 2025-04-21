import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from './PaymentForm';

const AllPayment = () => {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderAndPayments = async () => {
      try {
        const orderRes = await axios.get(`http://localhost:8080/order/${id}`);
        setOrder(orderRes.data.order);

        const paymentsRes = await axios.get(`http://localhost:8080/payments/${id}`);
        setPayments(paymentsRes.data.payments || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchOrderAndPayments();
  }, [id]);

  const handlePaymentSuccess = async (newPayment) => {
    try {
      // Add the new payment to the payments array
      setPayments([...payments, newPayment]);

      // Fetch the updated order to ensure consistency
      const orderRes = await axios.get(`http://localhost:8080/order/${id}`);
      setOrder(orderRes.data.order);
    } catch (err) {
      console.error('Error updating order after payment:', err);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  const { orderItems, totalPrice, totalPriceAfterDiscount, dueAmount, status } = order;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Order Summary Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h1>
        <div className="flex justify-between mb-4">
          <p className="text-sm text-gray-600">
            Order Status:{' '}
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : status === 'processing' || status === 'shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {status?.toUpperCase() || 'PENDING'}
            </span>
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          {orderItems.map((item, index) => (
            <div key={index} className="flex items-center mb-4 p-3 border-b border-gray-200">
              <img
                src={item.productImage || 'https://via.placeholder.com/64'}
                alt={item.productName || 'Product'}
                className="w-16 h-16 object-cover rounded mr-4"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.productName || 'Unknown Product'}</h3>
                <p className="text-sm text-gray-600">Quantity: {item.quantity || 0}</p>
              </div>
              <div className="text-right">
                {item.priceAfterDiscount && item.priceAfterDiscount < item.price ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">₹{item.price}</span>
                    <span className="font-medium">₹{item.priceAfterDiscount}</span>
                  </>
                ) : (
                  <span className="font-medium">₹{item.price || 0}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full">
          <div className="bg-gray-50 p-4 rounded-lg w-full md:w-1/3">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Subtotal:</span>
              <span>₹{totalPrice || 0}</span>
            </div>
            {totalPriceAfterDiscount && totalPriceAfterDiscount < totalPrice && (
              <div className="flex justify-between mb-2 text-green-600">
                <span className="font-medium">Discount:</span>
                <span>-₹{(totalPrice - totalPriceAfterDiscount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total:</span>
              <span>₹{totalPriceAfterDiscount || totalPrice || 0}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Due Amount:</span>
              <span>₹{dueAmount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form (Hidden if dueAmount is 0) */}
      {dueAmount > 0 && (
        <PaymentForm
          orderId={id}
          totalAmount={totalPriceAfterDiscount || totalPrice || 0}
          dueAmount={dueAmount || 0}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* Payments History */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMode || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.receivingDate
                      ? new Date(payment.receivingDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.remark || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No payments recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPayment;