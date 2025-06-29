import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="card p-4">
      <div className="card-header p-0">
        <h1 className="card-title display-4">Payment is successful!</h1>
      </div>
      <button
        type="button"
        className="btn btn-dark mt-4"
        onClick={() => navigate("/shop/account")}
      >
        View Orders
      </button>
    </div>
  );
}

export default PaymentSuccessPage;
