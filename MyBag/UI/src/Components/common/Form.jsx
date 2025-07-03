import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import ProductImageUpload from "../admin-view/image-upload";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  children,
  imageUrl,
  setImageUrl,
  currentEditedId,
  setCurrentEditedId,
  showModal,
  setShowModal,
}) {
  // const [showModal, setShowModal] = useState(false);

  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(event);
    setShowModal(false);
  };

  const initialState = {
    image: "",
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
  };

  function renderInputsByComponentType(getControlItem) {
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        return (
          <Form.Control
            type={getControlItem.type}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );
      case "select":
        return (
          <Form.Select
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          >
            {getControlItem.options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
      case "textarea":
        return (
          <Form.Control
            as="textarea"
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );
      default:
        return (
          <Form.Control
            type="text"
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(e) =>
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value,
              })
            }
          />
        );
    }
  }

  return (
    <>
      {!showModal && (
        <Button variant="primary" className="btn btn-dark" onClick={() => setShowModal(true)}>
          {buttonText || "Add New Product"}
        </Button>
      )}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          if (typeof setFormData === "function") {
            setFormData(initialState);
          }
          if (typeof setCurrentEditedId === "function") {
            setCurrentEditedId(null);
          }
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ marginBlock: "30px" }}>
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              currentEditedId={currentEditedId}
              isEditMode={currentEditedId !== null}
            />
          </div>
          <Form onSubmit={handleSubmit}>
            {formControls.map((controlItem) => (
              <Form.Group key={controlItem.name} className="mb-3">
                <Form.Label>{controlItem.label}</Form.Label>
                {renderInputsByComponentType(controlItem)}
              </Form.Group>
            ))}
            <Button variant="primary" type="submit" className="btn btn-dark" disabled={isBtnDisabled}>
              {currentEditedId !== null ? "Edit" : "Add"}
            </Button>
          </Form>
          {children}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CommonForm;
