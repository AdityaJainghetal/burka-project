import { useState, useEffect } from "react"
import { useCart } from "../CartContext"
import axios from "axios"
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
// Import icons directly if you're using luc_ide-react
// If not, you can replace these with any icon library you're using
import { Trash2, Plus, Minus, Save, AlertCircle, ShoppingCart } from "lucide-react"


const CartPage = () => {
  const { cart, fetchCart } = useCart()
  const [editedQuantities, setEditedQuantities] = useState({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [itemsBeingDeleted, setItemsBeingDeleted] = useState({})

  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text("Your Bill", 10, 10);
  
    // Define the columns for the table
    const columns = ["Product Name", "Price", "Quantity", "Total"];
  
    // Prepare the data for the table
    const data = cart.map((item) => [
        item.product?.name,
        `₹${item.product?.price}`,
        editedQuantities[item._id],
        `₹${(item.product?.price * editedQuantities[item._id]).toFixed(2)}`,
    ]);
  
    // Add the table to the PDF
    autoTable(doc, {
        head: [columns],
        body: data,
        startY: 20,
    });
  
    // Add the total amount at the end
    doc.setFontSize(14);
    doc.text(`Total: ₹${cartTotal.toFixed(2)}`, 10, doc.lastAutoTable.finalY + 10);
  
    // Save the PDF
    doc.save("bill.pdf");
  };

  // Initialize edited quantities with current cart quantities
  useEffect(() => {
    const initialQuantities = {}
    cart.forEach((item) => {
      initialQuantities[item._id] = item.quantity
    })
    setEditedQuantities(initialQuantities)
  }, [cart])

  // Handle quantity changes
  const handleQuantityChange = (product_id, newQuantity) => {
    if (newQuantity < 1) return // Ensure quantity is at least 1
    setEditedQuantities((prev) => ({
      ...prev,
      [product_id]: newQuantity,
    }))
  }

  // Check if any quantities have been modified
  const hasChanges = () => {
    return cart.some((item) => item.quantity !== editedQuantities[item._id])
  }

  // Save edited quantities
  const handleSave = async () => {
    setLoading(true)
    setError(null)

    try {
      // Loop through edited quantities and update the cart
      const updatePromises = cart
        .filter((item) => item.quantity !== editedQuantities[item._id])
        .map((item) =>
          axios.put(`http://localhost:8080/cart/update/${item.product._id}`, {
            quantity: editedQuantities[item._id],
          }),
        )

      await Promise.all(updatePromises)
      await fetchCart() // Refresh the cart after updating
    } catch (error) {
      setError("Failed to update cart. Please try again.")
      console.error("Error updating cart:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle product deletion
  const handleDelete = async (product_id) => {
    setItemsBeingDeleted((prev) => ({ ...prev, [product_id]: true }))
    setError(null)

    try {
      await axios.delete(`http://localhost:8080/cart/remove/${product_id}`)
      await fetchCart() // Refresh the cart after deletion
    } catch (error) {
      setError("Failed to delete product. Please try again.")
      console.error("Error deleting product:", error)
    } finally {
      setItemsBeingDeleted((prev) => ({ ...prev, [product_id]: false }))
    }
  }

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    return total + item.product?.price * editedQuantities[item._id]
  }, 0)

  return (
    <div className="max-w-4xl mx-auto p-1 md:p-6 text-black">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6" />
        <h1 className="text-2xl font-bold text-black">Your Cart</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="border rounded-lg shadow-sm">
          <div className="flex flex-col items-center justify-center py-10">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500">Your cart is empty</p>
            <button className="mt-4 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
              {cart.map((item) => (
              item.product &&
              <div key={item._id} className="border rounded-lg shadow-sm overflow-h_idden">
                <div className="flex flex-col sm:flex-row p-4 gap-4">
                  <div className="flex-grow">
                    <h2 className="font-medium text-lg">{item.product?.name}</h2>
                    <p className="text-gray-500 text-sm mb-2">₹{item.product?.price} per item</p>

                    <div className="flex items-center mt-2">
                      <button
                        className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 relative"
                        onClick={() => handleQuantityChange(item._id, editedQuantities[item._id] - 1)}
                        disabled={editedQuantities[item._id] <= 1}
                      >
                        <Minus className="h-6 w-6 absolute text-white hover:text-black" />
                      </button>
                      <input
                        type="number"
                        value={editedQuantities[item._id]}
                        onChange={(e) => handleQuantityChange(item._id, Number.parseInt(e.target.value) || 1)}
                        className="h-8 w-16 text-white border-t border-b border-gray-300 text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="1"
                      />
                      <button
                        className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-50"
                        onClick={() => handleQuantityChange(item._id, Number(editedQuantities[item._id]) + 1)}
                      >
                        <Plus className="h-3 w-3 h-6 w-6 absolute text-white hover:text-black" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end justify-between">
                    <p className="font-medium text-lg">₹{(item.product?.price * editedQuantities[item._id]).toFixed(2)}</p>

                    <button
                      className="mt-2 sm:mt-0 px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 flex items-center disabled:opacity-50"
                      onClick={() => handleDelete(item.product._id)}
                      disabled={itemsBeingDeleted[item._id]}
                    >
                      {itemsBeingDeleted[item._id] ? (
                        <span className="flex items-center">Removing...</span>
                      ) : (
                        <span className="flex items-center">
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border rounded-lg shadow-sm">
            <div className="p-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <hr className="my-2 border-gray-200" />

              <div className="flex justify-between items-center py-2">
                <span className="font-medium text-lg">Total</span>
                <span className="font-bold text-lg">₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <button
                  className={`w-full px-4 py-2 rounded-md flex items-center justify-center ${
                    loading || !hasChanges()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={handleSave}
                  disabled={loading || !hasChanges()}
                >
                  {loading ? (
                    <span className="flex items-center">Saving Changes...</span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="h-4 w-4 mr-2" /> Save Changes
                    </span>
                  )}
                </button>

                <button className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200" onClick={generatePDF}>
                  BrowserPDf
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage