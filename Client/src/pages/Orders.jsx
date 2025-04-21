import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const printRef = React.useRef();
  const navigate = useNavigate();

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/order");
      setOrders(res.data.orders);
      setFilteredOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment details for a specific order
  const fetchPaymentDetails = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:8080/payments/${orderId}`);
      setPaymentDetails(res.data.payments || []);
    } catch (err) {
      console.error("Failed to fetch payment details:", err);
      setPaymentDetails([]);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus, dueAmount) => {
    try {
      // Client-side validation
      if (dueAmount > 0 && newStatus !== "pending") {
        alert("Order status cannot be updated to anything other than pending while due amount is greater than 0");
        return;
      }
      if (dueAmount === 0 && newStatus === "pending") {
        alert("Order status cannot be set to pending when due amount is 0");
        return;
      }

      await axios.put(`http://localhost:8080/order/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  // Handle print functionality
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // View order details and fetch payments
  const viewOrderDetails = async (order) => {
    setSelectedOrder(order);
    await fetchPaymentDetails(order._id);
  };

  // Close modal
  const closeModal = () => {
    setSelectedOrder(null);
    setPaymentDetails([]);
  };

  // Navigate to AllPayment page for the specific order
  const navigateToPayments = (orderId) => {
    navigate(`/allpayment/${orderId}`);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search
  useEffect(() => {
    const result = orders.filter((order) => {
      const searchLower = search.toLowerCase();
      return (
        order._id?.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower) ||
        new Date(order.createdAt).toLocaleDateString().toLowerCase().includes(searchLower) ||
        `${order.totalPriceAfterDiscount ?? order.totalPrice}`.toLowerCase().includes(searchLower) ||
        order.status?.toLowerCase().includes(searchLower) ||
        order.paymentStatus?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredOrders(result);
  }, [search, orders]);

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row._id.slice(-6).toUpperCase(),
      sortable: true,
      width: "120px",
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
      width: "120px",
    },
    {
      name: "Customer",
      selector: (row) => row.user?.name || "Guest",
      sortable: true,
      width: "150px",
    },
    {
      name: "Total",
      selector: (row) => `₹${row.totalPriceAfterDiscount ?? row.totalPrice}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Due Amount",
      selector: (row) => `₹${row.dueAmount ?? row.totalPriceAfterDiscount ?? row.totalPrice}`,
      sortable: true,
      width: "120px",
    },
    {
      name: "Payment Status",
      cell: (row) => {
        const paymentStatus = row.paymentStatus || "pending";
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${paymentStatus === "paid" ? "bg-green-100 text-green-800" : 
                paymentStatus === "partially_paid" ? "bg-blue-100 text-blue-800" : 
                "bg-yellow-100 text-yellow-800"}`}
          >
            {paymentStatus.toUpperCase()}
          </span>
        );
      },
      width: "120px",
    },
    {
      name: "Order Status",
      cell: (row) => {
        const status = row.status || "pending";
        return (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
              ${status === "delivered" ? "bg-green-100 text-green-800" : 
                status === "processing" || status === "shipped" ? "bg-blue-100 text-blue-800" : 
                status === "cancelled" ? "bg-red-100 text-red-800" : 
                "bg-yellow-100 text-yellow-800"}`}
          >
            {status.toUpperCase()}
          </span>
        );
      },
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => viewOrderDetails(row)}
            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100"
          >
            View
          </button>
          <select
            value={row.status || "pending"}
            onChange={(e) => updateOrderStatus(row._id, e.target.value, row.dueAmount)}
            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="pending">Pending</option>
            {row.dueAmount === 0 && (
              <>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </>
            )}
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Payment",
      cell: (row) => (
        <button
          onClick={() => navigateToPayments(row._id)}
          className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100"
        >
          {row.paymentStatus === "paid" ? "View Payments" : "Add Payment"}
        </button>
      ),
      width: "120px",
    },
    {
      name: "Print",
      cell: (row) => (
        <button
          onClick={() => {
            viewOrderDetails(row);
            setTimeout(handlePrint, 500);
          }}
          className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded hover:bg-purple-100"
        >
          Print
        </button>
      ),
      width: "100px",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredOrders}
          progressPending={loading}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          highlightOnHover
          striped
          responsive
          noDataComponent={
            <div className="p-4 text-center text-gray-500">
              No orders found. Try adjusting your search or create a new order.
            </div>
          }
        />
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6" ref={printRef}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold">
                    Order #{selectedOrder._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2 text-gray-700">
                    Customer Information
                  </h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedOrder.user?.name || "Guest"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedOrder.shippingAddress?.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {selectedOrder.shippingAddress?.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">City:</span>{" "}
                      {selectedOrder.shippingAddress?.city || "N/A"},{" "}
                      {selectedOrder.shippingAddress?.state || "N/A"}{" "}
                      {selectedOrder.shippingAddress?.zipCode || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-bold mb-2 text-gray-700">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order Status:</span>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${selectedOrder.status === "delivered" ? "bg-green-100 text-green-800" : 
                            selectedOrder.status === "processing" || selectedOrder.status === "shipped" ? "bg-blue-100 text-blue-800" : 
                            selectedOrder.status === "cancelled" ? "bg-red-100 text-red-800" : 
                            "bg-yellow-100 text-yellow-800"}`}
                      >
                        {(selectedOrder.status || "pending").toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{selectedOrder.totalPrice || 0}</span>
                    </div>
                    {selectedOrder.totalPriceAfterDiscount && (
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="text-red-500">
                          -₹
                          {selectedOrder.totalPrice -
                            selectedOrder.totalPriceAfterDiscount}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>
                        ₹
                        {selectedOrder.totalPriceAfterDiscount ||
                          selectedOrder.totalPrice ||
                          0}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2">
                      <span>Due Amount:</span>
                      <span>₹{selectedOrder.dueAmount || 0}</span>
                    </div>

                    <h4 className="font-bold mt-4 mb-2 text-gray-700">
                      Payment Information
                    </h4>
                    {paymentDetails.length > 0 ? (
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Payment Status:</span>{" "}
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${selectedOrder.paymentStatus === "paid"
                                ? "bg-green-100 text-green-800"
                                : selectedOrder.paymentStatus ===
                                  "partially_paid"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"}`}
                          >
                            {(selectedOrder.paymentStatus || "pending").toUpperCase()}
                          </span>
                        </p>
                        <button
                          onClick={() => navigateToPayments(selectedOrder._id)}
                          className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded hover:bg-green-100"
                        >
                          View/Add Payments
                        </button>
                      </div>
                    ) : (
                      <p className="text-yellow-600">No payment details found</p>
                    )}
                  </div>
                </div>
              </div>

              {paymentDetails.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold mb-2 text-gray-700">
                    Payment History
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment Mode
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Remark
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentDetails.map((payment) => (
                          <tr key={payment._id}>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {payment.paymentMode || "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              ₹{payment.amount?.toLocaleString() || 0}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {payment.receivingDate
                                ? new Date(payment.receivingDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {payment.remark || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold mb-2 text-gray-700">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.orderItems?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded object-cover"
                                  src={
                                    item.productImage ||
                                    "https://via.placeholder.com/40"
                                  }
                                  alt={item.productName || "Product"}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.productName || "Product"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            ₹{item.priceAfterDiscount || item.price || 0}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.quantity || 0}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            ₹
                            {(item.priceAfterDiscount || item.price || 0) *
                              (item.quantity || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;