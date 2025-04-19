import { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  AlertCircle,
  CreditCard,
} from "lucide-react";

const CartPage = () => {
  const { cart, fetchCart } = useCart();
  const [editedQuantities, setEditedQuantities] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemsBeingDeleted, setItemsBeingDeleted] = useState({});
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [discount, setDiscount] = useState(0);

  // Checkout & payment states
  const [modalOpen, setModalOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Initialize quantities
  useEffect(() => {
    const initial = {};
    cart.forEach((item) => {
      initial[item._id] = item.quantity;
    });
    setEditedQuantities(initial);
  }, [cart]);

  // Load vendors
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/user");
        setVendors(res.data);
      } catch {
        setError("Failed to load vendors.");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // Apply vendor discount
  useEffect(() => {
    const vendor = vendors.find((v) => v._id === selectedVendor);
    setDiscount(vendor?.discount || 0);
  }, [selectedVendor, vendors]);

  // Calculate totals
  const calculateTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * editedQuantities[item._id],
      0
    );
    const discAmt = (subtotal * discount) / 100;
    return { subtotal, discount: discAmt, total: subtotal - discAmt };
  };
  const { subtotal, discount: discountAmount, total } = calculateTotal();

  // Generate PDF invoice
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice", 10, 10);

    const cols = ["Product", "Price", "Qty", "Subtotal"];
    const rows = cart.map((item) => [
      item.product.name,
      `₹${item.product.price}`,
      editedQuantities[item._id],
      `₹${(
        item.product.price *
        editedQuantities[item._id]
      ).toFixed(2)}`,
    ]);

    autoTable(doc, { head: [cols], body: rows, startY: 20 });
    const startY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 10, startY);
    doc.text(
      `Discount (${discount}%): ₹${discountAmount.toFixed(2)}`,
      10,
      startY + 10
    );
    doc.setFontSize(14);
    doc.text(`Total: ₹${total.toFixed(2)}`, 10, startY + 20);
    doc.save("invoice.pdf");
  };

  // Change quantity
  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    setEditedQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  // Remove single item
  const handleDelete = async (id) => {
    setItemsBeingDeleted((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`http://localhost:8080/cart/remove/${id}`);
      await fetchCart();
    } catch {
      setError("Failed to delete.");
    } finally {
      setItemsBeingDeleted((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Checkout modal controls
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // Process payment and clear cart
  const handlePayment = () => {
    setProcessingPayment(true);
    setError(null);

    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);

      // Remove all items after success
      Promise.all(
        cart.map((item) =>
          axios.delete(
            `http://localhost:8080/cart/remove/${item.product._id}`
          )
        )
      )
        .then(() => fetchCart())
        .finally(() => {
          setTimeout(() => {
            closeModal();
            setCheckoutDone(true);
          }, 1000);
        });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-black">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {/* Empty State */}
      {cart.length === 0 ? (
        <div className="border rounded shadow-sm flex flex-col items-center py-10">
          <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
          <p className="text-lg text-gray-500">Your cart is empty</p>
          <button className="mt-4 px-4 py-2 border rounded hover:bg-gray-50">
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="border rounded shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4"
              >
                <div>
                  <h2 className="font-medium text-lg">
                    {item.product.name}
                  </h2>
                  <p className="text-gray-500">
                    ₹{item.product.price} each
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      disabled={editedQuantities[item._id] <= 1}
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          editedQuantities[item._id] - 1
                        )
                      }
                      className="h-8 w-8 border rounded-l hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Minus className="h-5 w-5 m-auto" />
                    </button>
                    <input
                      type="number"
                      value={editedQuantities[item._id]}
                      onChange={(e) =>
                        handleQuantityChange(
                          item._id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      min="1"
                      className="h-8 w-16 text-center border-t border-b"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item._id,
                          editedQuantities[item._id] + 1
                        )
                      }
                      className="h-8 w-8 border rounded-r hover:bg-gray-50"
                    >
                      <Plus className="h-5 w-5 m-auto" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="font-medium text-lg">
                    ₹
                    {(
                      item.product.price *
                      editedQuantities[item._id]
                    ).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(item.product._id)}
                    disabled={itemsBeingDeleted[item._id]}
                    className="mt-2 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                  >
                    {itemsBeingDeleted[item._id]
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Actions */}
          <div className="mt-6 border rounded shadow-sm p-4">
            <div className="mb-4">
              <label className="block text-sm mb-1">
                Select Vendor
              </label>
              <select
                value={selectedVendor}
                onChange={(e) =>
                  setSelectedVendor(e.target.value)
                }
                className="w-full border rounded px-4 py-2"
              >
                <option value="">Select a vendor</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.firmName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">Discount</label>
              <input
                readOnly
                value={discount > 0 ? `${discount}%` : ""}
                className="w-full border rounded bg-gray-100 px-4 py-2"
              />
              {discount > 0 && (
                <p className="text-green-600 text-sm mt-1">
                  {discount}% applied!
                </p>
              )}
            </div>
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-1">
                <span>Discount</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between py-1 font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex gap-2">
              {!checkoutDone ? (
                <button
                  onClick={openModal}
                  disabled={!selectedVendor}
                  className={`w-full px-4 py-2 rounded flex items-center justify-center ${
                    !selectedVendor
                      ? "bg-gray-300 text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout
                </button>
              ) : (
                <button
                  onClick={generatePDF}
                  className="w-full px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                >
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              Confirm Payment
            </h2>

            <div className="space-y-2 mb-4 text-sm">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between"
                >
                  <span>
                    {item.product.name} (x{editedQuantities[item._id]})
                  </span>
                  <span>
                    ₹
                    {(
                      item.product.price *
                      editedQuantities[item._id]
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                disabled={processingPayment}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 flex items-center"
              >
                {processingPayment
                  ? "Processing..."
                  : paymentSuccess
                  ? "Payment Success"
                  : "Pay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;


