import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store";
import { Provider } from "react-redux";
import AppRouter from "./appRouter";
import { PersistGate } from "redux-persist/integration/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CartFileProvider } from "./contexts/CartFileContext";
// TODO: Replace with your actual Stripe publishable key
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder"
);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <Provider store={store}>
        <CartFileProvider>
          <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <AppRouter />
          </PersistGate>
        </CartFileProvider>
      </Provider>
    </Elements>
  </BrowserRouter>
);
