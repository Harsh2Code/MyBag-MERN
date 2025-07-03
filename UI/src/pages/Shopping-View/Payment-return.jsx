import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PaymentReturn() {
  const navigate = useNavigate();

  React.useEffect(() => {
    toast.info("Payment processing is currently disabled.");
    navigate("/shop/checkout");
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1>Payment Processing Disabled</h1>
      <p>Paypal integration has been removed as per your request.</p>
    </div>
  );
}
