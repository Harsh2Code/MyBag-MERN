import { useEffect, useState } from "react";
import { addressFormControls } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "../../store/Shop/Address-Slice/Address-Slice";
import AddressCard from "./Address-card";

const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  console.log("Current user object:", user);
  const { addressList } = useSelector((state) => state.shopAddress);

  function handleManageAddress(event) {
    event.preventDefault();
    console.log("handleManageAddress called with formData:", formData);

    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      alert("You can add max 3 addresses");
      return;
    }

    // Validate formData fields
    const requiredFields = ["address", "city", "pincode", "phone", "notes"];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        alert(`Please fill in the ${field} field.`);
        return;
      }
    }

    if (currentEditedId !== null) {
      console.log("Editing address with id:", currentEditedId);
      dispatch(
        editaAddress({
          userId: user?.userId,
          addressId: currentEditedId,
          formData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          console.log("Address updated successfully");
          dispatch(fetchAllAddresses(user?.userId));
          setCurrentEditedId(null);
          setFormData(initialAddressFormData);
          alert("Address updated successfully");
        }
      });
    } else {
      console.log("Adding new address");
      console.log("Payload to addNewAddress:", { ...formData, userId: user?.id });
      dispatch(
        addNewAddress({
          ...formData,
          userId: user?.userId,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          console.log("Address added successfully");
          dispatch(fetchAllAddresses(user?.userId));
          setFormData(initialAddressFormData);
          alert("Address added successfully");
        }
      });
    }
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.userId, addressId: getCurrentAddress._id })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.userId));
        alert("Address deleted successfully");
      }
    });
  }

  function handleEditAddress(getCurrentAddress) {
    setCurrentEditedId(getCurrentAddress?._id);
    setFormData({
      ...formData,
      address: getCurrentAddress?.address,
      city: getCurrentAddress?.city,
      phone: getCurrentAddress?.phone,
      pincode: getCurrentAddress?.pincode,
      notes: getCurrentAddress?.notes,
    });
    setShowForm(true);
  }

  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key].trim() !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllAddresses(user?.userId));
  }, [dispatch, user?.userId]);

  console.log("Rendering addressList:", addressList);
  return (
    <div className="card">
      <div className="mb-4 p-3 row row-cols-1 row-cols-sm-2 g-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                key={singleAddressItem._id}
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0" style={{marginTop: "3px",}}>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </h5>
        {!showForm && (
          <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
            Add Address
          </button>
        )}
      </div>
      {showForm && (
        <div className="card-body">
          <div className="mx-auto" style={{ maxWidth: "400px" }}>
            <form onSubmit={handleManageAddress}>
              {addressFormControls.map(({ name, label, type, componentType }) => (
                <div key={name} className="mb-3">
                  <label htmlFor={name} className="form-label">{label}</label>
                  {componentType === "textarea" ? (
                    <textarea
                      id={name}
                      name={name}
                      className="form-control"
                      value={formData[name]}
                      onChange={(e) => {
                        console.log(`Input change for ${name}:`, e.target.value);
                        setFormData({ ...formData, [name]: e.target.value });
                      }}
                      required
                    />
                  ) : (
                    <input
                      id={name}
                      name={name}
                      type={type}
                      className="form-control"
                      value={formData[name]}
                      onChange={(e) => {
                        console.log(`Input change for ${name}:`, e.target.value);
                        setFormData({ ...formData, [name]: e.target.value });
                      }}
                      required
                    />
                  )}
                </div>
              ))}
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-dark" disabled={!isFormValid()}>
                  {currentEditedId !== null ? "Edit" : "Add"}
                </button>
                <button type="button" className="btn btn-dark" onClick={() => {
                  setShowForm(false);
                  setCurrentEditedId(null);
                  setFormData(initialAddressFormData);
                }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Address;
