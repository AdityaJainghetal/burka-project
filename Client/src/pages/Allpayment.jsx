// // import { useState } from 'react';

// // const AllPayment = () => {
 
// //   const [payments, setPayments] = useState([
// //     { id: 1, paymentMode: 'Online Transfer', amount: 20000, receivingDate: '28-Mar-2025', chequeDetail: '', chequeDate: '', status: 'Pending' },
   
// //   ]);

// //   const [formData, setFormData] = useState({
// //     amount: '',
// //     receivingDate: '',
// //     paymentMode: 'Choose Payment',
// //     remark: ''
// //   });

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     const newPayment = {
// //       id: payments.length + 1,
// //       paymentMode: formData.paymentMode,
// //       amount: formData.amount,
// //       receivingDate: formData.receivingDate || new Date().toLocaleDateString('en-GB'),
// //       chequeDetail: '',
// //       chequeDate: '',
// //       status: 'Pending'
// //     };
    
// //     setPayments([...payments, newPayment]);
// //     setFormData({
// //       amount: '',
// //       receivingDate: '',
// //       paymentMode: 'Online Transfer',
// //       remark: ''
// //     });
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       {/* Header */}
// //       <div className="flex justify-between items-center mb-8">
// //         <h1 className="text-2xl font-bold text-gray-800">Burka Payemnt</h1>
        
// //       </div>

// //       {/* Payment Form */}
// //       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
// //         <h2 className="text-xl font-semibold mb-4">Add Payment</h2>
        
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
// //               <input
// //                 type="number"
// //                 name="amount"
// //                 value={formData.amount}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
// //                 placeholder="Enter Amount"
// //                 required
// //               />
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Receiving Date</label>
// //               <input
// //                 type="date"
// //                 name="receivingDate"
// //                 value={formData.receivingDate}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
// //               />
// //             </div>
            
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
// //               <select
// //                 name="paymentMode"
// //                 value={formData.paymentMode}
// //                 onChange={handleChange}
// //                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
// //               >
// //                 <option value="Online Transfer">Online Transfer</option>
// //                 <option value="Cash">Cash</option>
// //                 <option value="Cheque">Cheque</option>
// //               </select>
// //             </div>
// //           </div>
          
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
// //             <textarea
// //               name="remark"
// //               value={formData.remark}
// //               onChange={handleChange}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md"
// //               placeholder="Enter remark..."
// //               rows="2"
// //             />
// //           </div>
          
// //           <button
// //             type="submit"
// //             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
// //           >
// //             Submit
// //           </button>
// //         </form>
// //       </div>

// //       {/* Payments Table */}
// //       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
// //         <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        
// //         <table className="min-w-full divide-y divide-gray-200">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Date</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque/Detail</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque Date</th>
// //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {payments.map((payment) => (
// //               <tr key={payment.id} className="hover:bg-gray-50">
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMode}</td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount.toLocaleString()}</td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.receivingDate}</td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.chequeDetail || '-'}</td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.chequeDate || '-'}</td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
// //                     ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
// //                     {payment.status}
// //                   </span>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AllPayment;






// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const AllPayment = () => {
//   const { id } = useParams(); // Get dynamic ID from URL
//   const [payments, setPayments] = useState([]);
//   const [formData, setFormData] = useState({
//     amount: '',
//     receivingDate: '',
//     paymentMode: 'Online Transfer',
//     remark: ''
//   });

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8080/order/orderdisplay/${id}`);
//         // Assuming the payments are stored in a 'payments' array in the order object
//         setPayments(res.data.payments || []);
//       } catch (err) {
//         console.error('Error fetching payments:', err);
//       }
//     };
    
//     fetchPayments();
//   }, [id]);
  
 
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axios.post(
//         `http://localhost:8080/order/orderdisplay/${id}/payments`,
//         formData
//       );
      
//       setPayments([...payments, res.data]);
//       setFormData({
//         amount: '',
//         receivingDate: '',
//         paymentMode: 'Online Transfer',
//         remark: ''
//       });
//     } catch (err) {
//       console.error('Error submitting payment:', err);
//     }
//   };
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-gray-800">Burka Payment</h1>
//       </div>

//       {/* Payment Form */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-semibold mb-4">Add Payment</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="Enter Amount"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Receiving Date</label>
//               <input
//                 type="date"
//                 name="receivingDate"
//                 value={formData.receivingDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
//               <select
//                 name="paymentMode"
//                 value={formData.paymentMode}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 <option value="Online Transfer">Online Transfer</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Cheque">Cheque</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
//             <textarea
//               name="remark"
//               value={formData.remark}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               placeholder="Enter remark..."
//               rows="2"
//             />
//           </div>

//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Submit
//           </button>
//         </form>
//       </div>

//       {/* Payments Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
//         <h2 className="text-xl font-semibold mb-4">Payment History</h2>

//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque/Detail</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {payments.map((payment) => (
//               <tr key={payment._id || payment.id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMode}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount.toLocaleString()}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.receivingDate}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.chequeDetail || '-'}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.chequeDate || '-'}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                     ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                     {payment.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllPayment;





// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const AllPayment = () => {
//   const { id } = useParams();
//   const [payments, setPayments] = useState([]);
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     amount: '',
//     receivingDate: '',
//     paymentMode: 'Online Transfer',
//     remark: ''
//   });

//   useEffect(() => {
//     const fetchOrderAndPayments = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8080/order/orderdisplay/${id}`);
//         setOrder(res.data);
//         setPayments(res.data.payments || []);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching order and payments:', err);
//         setLoading(false);
//       }
//     };
    
//     fetchOrderAndPayments();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(
//         `http://localhost:8080/order/orderdisplay/${id}/payments`,
//         formData
//       );
      
//       setPayments([...payments, res.data]);
//       setFormData({
//         amount: '',
//         receivingDate: '',
//         paymentMode: 'Online Transfer',
//         remark: ''
//       });
//     } catch (err) {
//       console.error('Error submitting payment:', err);
//     }
//   };

//   if (loading) {
//     return <div className="container mx-auto px-4 py-8">Loading...</div>;
//   }

//   if (!order) {
//     return <div className="container mx-auto px-4 py-8">Order not found</div>;
//   }

//   const { orderItems, totalPrice, totalPriceAfterDiscount } = order;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Order Summary Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Details</h1>
        
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Products</h2>
//           {orderItems.map((item, index) => (
//             <div key={index} className="flex items-center mb-4 p-3 border-b border-gray-200">
//               <img 
//                 src={item.productImage} 
//                 alt={item.productName} 
//                 className="w-16 h-16 object-cover rounded mr-4"
//               />
//               <div className="flex-1">
//                 <h3 className="font-medium">{item.productName}</h3>
//                 <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                 {item.discountPercentage > 0 && (
//                   <p className="text-sm text-gray-600">
//                     Discount: {item.discountPercentage}% ({item.discountName})
//                   </p>
//                 )}
//               </div>
//               <div className="text-right">
//                 {item.discountPercentage > 0 ? (
//                   <>
//                     <span className="line-through text-gray-400 mr-2">₹{item.price}</span>
//                     <span className="font-medium">₹{item.priceAfterDiscount}</span>
//                   </>
//                 ) : (
//                   <span className="font-medium">₹{item.price}</span>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-end">
//           <div className="bg-gray-50 p-4 rounded-lg w-full md:w-1/3">
//             <div className="flex justify-between mb-2">
//               <span className="font-medium">Subtotal:</span>
//               <span>₹{totalPrice}</span>
//             </div>
//             {totalPriceAfterDiscount < totalPrice && (
//               <div className="flex justify-between mb-2 text-green-600">
//                 <span className="font-medium">Discount:</span>
//                 <span>-₹{totalPrice - totalPriceAfterDiscount}</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 mt-2">
//               <span>Total:</span>
//               <span>₹{totalPriceAfterDiscount}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Section */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h2 className="text-xl font-semibold mb-4">Add Payment</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
//               <input
//                 type="number"
//                 name="amount"
//                 value={formData.amount}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="Enter Amount"
//                 required
//                 max={totalPriceAfterDiscount - payments.reduce((sum, p) => sum + p.amount, 0)}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Receiving Date</label>
//               <input
//                 type="date"
//                 name="receivingDate"
//                 value={formData.receivingDate}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
//               <select
//                 name="paymentMode"
//                 value={formData.paymentMode}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 <option value="Online Transfer">Online Transfer</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Cheque">Cheque</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
//             <textarea
//               name="remark"
//               value={formData.remark}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               placeholder="Enter remark..."
//               rows="2"
//             />
//           </div>

//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             Submit Payment
//           </button>
//         </form>
//       </div>

//       {/* Payments History */}
//       <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Payment History</h2>
//           <div className="text-lg font-medium">
//             Balance Due: ₹{Math.max(0, totalPriceAfterDiscount - payments.reduce((sum, p) => sum + p.amount, 0))}
//           </div>
//         </div>

//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Mode</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receiving Date</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {payments.length > 0 ? (
//               payments.map((payment) => (
//                 <tr key={payment._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMode}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount.toLocaleString()}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {new Date(payment.receivingDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.remark || '-'}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                       ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                       {payment.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
//                   No payments recorded yet
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllPayment;










import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from './PaymentFrom';

const AllPayment = () => {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderAndPayments = async () => {
      try {
        const orderRes = await axios.get(`http://localhost:8080/order/orderdisplay/${id}`);
        setOrder(orderRes.data);
        
        const paymentsRes = await axios.get(`http://localhost:8080/payments?orderId=${id}`);
        setPayments(paymentsRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    
    fetchOrderAndPayments();
  }, [id]);

  const handlePaymentSuccess = (newPayment) => {
    setPayments([...payments, newPayment]);
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!order) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }

  const { orderItems, totalPrice, totalPriceAfterDiscount } = order;
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      
      <PaymentForm 
        orderId={id}
        totalAmount={totalPriceAfterDiscount}
        paidAmount={paidAmount}
        onPaymentSuccess={handlePaymentSuccess}
      />

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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.receivingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.remark || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {payment.status}
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