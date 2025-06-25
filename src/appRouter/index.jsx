import { Route, Routes } from "react-router-dom";
import App from "../App";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import Cart from "@/components/Cart";
import SuccessPage from "@/components/SuccessPage";
import PrivateRoute from "@/components/PrivateRoute";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/success" element={<SuccessPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
