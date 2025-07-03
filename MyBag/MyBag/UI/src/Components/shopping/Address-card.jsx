function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <div
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`card cursor-pointer ${
        selectedId?._id === addressInfo?._id
          ? "border border-danger border-4"
          : "border"
      }`}
      style={{ cursor: setCurrentSelectedAddress ? "pointer" : "default" }}
    >
      <div className="card-body p-4">
        <p><strong>Address:</strong> {addressInfo?.address}</p>
        <p><strong>City:</strong> {addressInfo?.city}</p>
        <p><strong>Pincode:</strong> {addressInfo?.pincode}</p>
        <p><strong>Phone:</strong> {addressInfo?.phone}</p>
        <p><strong>Notes:</strong> {addressInfo?.notes}</p>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-dark btn-sm" onClick={() => handleEditAddress(addressInfo)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAddress(addressInfo)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default AddressCard;
