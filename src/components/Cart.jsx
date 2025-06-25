import { useSelector, useDispatch } from "react-redux";
import {
  FaPrint,
  FaFileAlt,
  FaPalette,
  FaCopy,
  FaTrash,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";
import axios from "axios";
import { removeCartItem } from "@/app/slices/cartSlice";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useCartFiles } from "@/contexts/CartFileContext.jsx";
import { useNavigate } from "react-router-dom";
import { API } from "@/utils/api";
import Header from "./Header";

// Stripe public key - Replace with your actual public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Cart = () => {
  const { getCartFile, clearCartFiles } = useCartFiles();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [cartTotal, setCartTotal] = useState(0);

  // Calculate total cost for all cart items
  const calculateTotalCost = () => {
    return cartItems.reduce((total, item) => {
      const estimatedCost = item.printOptions?.estimatedCost || 0;
      return total + estimatedCost;
    }, 0);
  };
  let files = getCartFile();
  useEffect(() => {
    console.log(cartItems);
    console.log(files);

    setCartTotal(calculateTotalCost());
  }, [cartItems]);

  // Function to handle removal of a cart item
  const handleRemove = async (index) => {
    try {
      // Optimistically update Redux state first
      dispatch(removeCartItem(index));

      // Then make the API call (optional, depends on your backend)
      await axios.post(
        API.REMOVE_FROM_CART,
        { index },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error removing item from cart", error);
    }
  };

  // Proceed to checkout (Stripe integration)
  const handleCheckout = async () => {
    const totalCost = calculateTotalCost();
    console.log(totalCost);

    try {
      // Call your backend to create a Stripe checkout session
      const response = await axios.post(
        API.CREATE_CHECKOUT_SESSION,
        {
          amount: totalCost,
          cartItems: cartItems,
        },
        { withCredentials: true }
      );

      const { sessionId } = response.data;

      // Redirect to Stripe checkout page
      const stripe = await stripePromise;
      stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Function to handle going back to main page
  const handleGoBack = () => {
    navigate("/");
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          {/* Header with Go Back button */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaPrint className="h-8 w-8 text-blue-600" />
              Your Print Cart
            </h2>
            <div className="w-20"></div> {/* Spacer for center alignment */}
          </div>

          {/* Empty cart state */}
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaFileAlt className="h-16 w-16 mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some documents to print and they will appear here.
            </p>
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaPlus className="h-4 w-4" />
              Add Documents to Print
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with Go Back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FaPrint className="h-8 w-8 text-blue-600" />
            Your Print Cart
          </h2>
          <div className="text-sm text-gray-500">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </div>
        </div>

        <div className="space-y-6">
          {cartItems.map((item, index) => {
            const options = item.printOptions;
            const isColor = options.color === "color";
            const itemCost = options.estimatedCost || 0;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <FaFileAlt className="h-5 w-5 text-blue-500" />
                      {options.fileName || item.pdf.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {options.paperSize} • {options.orientation}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(index)}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  >
                    <FaTrash className="h-5 w-5" />
                    <span className="text-sm font-medium">Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaPalette
                      className={`h-5 w-5 ${
                        isColor ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        isColor ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {isColor ? "Color" : "B/W"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaCopy className="h-5 w-5 text-purple-500" />
                    <span className="font-medium">
                      {options.copies} {options.copies > 1 ? "copies" : "copy"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-orange-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 110-2h10V4H4zm3 2h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1V7a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">
                      {options.duplex ? "Double-sided" : "Single-sided"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-cyan-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H5a1 1 0 110-2h10V4H4zm3 2h6a1 1 0 011 1v6a1 1 0 01-1 1H7a1 1 0 01-1-1V7a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">
                      Binding:{" "}
                      {options.binding === "none" ? "None" : options.binding}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Estimated delivery: 24-48hrs
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Item Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{itemCost}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end items-center">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-blue-600">₹{cartTotal}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
