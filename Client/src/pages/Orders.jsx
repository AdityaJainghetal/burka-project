import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/order"); // Adjust endpoint if needed
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/order/update-order/${orderId}`, { status: newStatus });
      fetchOrders(); // Refresh data after update
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white shadow-md p-5 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order #{index + 1}</p>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 border p-2 rounded-md">
                    <img
                      src={item.productImage || "https://via.placeholder.com/100"}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} | ₹{item.priceAfterDiscount ?? item.price}
                        {item.priceAfterDiscount && item.priceAfterDiscount !== item.price && (
                          <span className="line-through text-xs text-gray-400 ml-2">
                            ₹{item.price}
                          </span>
                        )}
                      </p>
                      {item.discountName && (
                        <p className="text-xs text-green-600">
                          Discount: {item.discountName} ({item.discountPercentage}% off)
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex justify-between items-center">
                <p className="text-gray-600">
                  <span className="font-medium">Total:</span> ₹{order.totalPriceAfterDiscount ?? order.totalPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
