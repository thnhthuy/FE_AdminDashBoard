import { CiCircleCheck, CiClock2, CiDeliveryTruck } from "react-icons/ci";
import styles from "./styles.module.scss";
import Button from "@components/ui/Button/Button";
import { MdOutlineCancel } from "react-icons/md";
import { useContext, useEffect, useRef, useState } from "react";
import { orderData, tableHeaders } from "./constants";
import Information from "@components/ui/Information/Information";
import Card from "@components/Card/Card";
import CardHeader from "@components/Card/CardHeader/CardHeader";
import CardContent from "@components/Card/CardContent/CardContent";
import Input from "@components/ui/Input/Input";
import ActionMenu from "@components/ui/ActionMenu/ActionMenu";
import Pagination from "@components/ui/Pagination/Pagination";
import { RiArrowDropDownLine } from "react-icons/ri";
import PopUp from "@ui/PopUp/PopUp";
import { ToastContext } from "@contexts/ToastContext";
import useClickOutside from "@hooks/useClickOutside";
import { HiMiniPlus } from "react-icons/hi2";
function Order() {
  const {
    container,
    header,
    title,
    containerInformation,
    containerlstBtn,
    lstBtn,
    containerCard,
    headerCard,
    findContainer,
    dropdown,
    options,
    table,
    popUpcontent,
    subTitlePopup,
    gridCols2,
    spaceY2,
    infoCustomer,
    infoProduct,
  } = styles;

  const { toast } = useContext(ToastContext);

  const initialFormData = {
    id: "",
    customer: "",
    product: "",
    category: "Select category",
    size: "",
    color: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "Select method",
    price: 0,
    quantity: 0,
    totalPrice: 0,
    status: "",
    date: Date,
  };

  const [submited, setSubmitted] = useState(false);
  const getRequiredClass = (field) => {
    return submited && !formData[field] ? styles.required : "";
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let firstToastShown = false;

    if (!formData.customer.trim()) {
      newErrors.customer = "Customer name is required";
      if (!firstToastShown) {
        toast.error(newErrors.customer);
        firstToastShown = true;
      }
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      if (!firstToastShown) {
        toast.error(newErrors.phone);
        firstToastShown = true;
      }
    }
    if (formData.paymentMethod === "Select method") {
      newErrors.paymentMethod = "Payment method is required";
      if (!firstToastShown) {
        toast.error(newErrors.paymentMethod);
        firstToastShown = true;
      }
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      if (!firstToastShown) {
        toast.error(newErrors.address);
        firstToastShown = true;
      }
    }
    if (!formData.product.trim()) {
      newErrors.product = "Product name is required";
      if (!firstToastShown) {
        toast.error(newErrors.product);
        firstToastShown = true;
      }
    }
    if (!formData.size.trim()) {
      newErrors.size = "Size is required";
      if (!firstToastShown) {
        toast.error(newErrors.size);
        firstToastShown = true;
      }
    }
    if (!formData.color.trim()) {
      newErrors.color = "Color is required";
      if (!firstToastShown) {
        toast.error(newErrors.color);
        firstToastShown = true;
      }
    }
    // if (formData.category === "Select category") {
    //   newErrors.category = "Category is required";
    //   if (!firstToastShown) {
    //     toast.error(newErrors.category);
    //     firstToastShown = true;
    //   }
    // }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      if (!firstToastShown) {
        toast.error(newErrors.email);
        firstToastShown = true;
      }
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      if (!firstToastShown) {
        toast.error(newErrors.price);
        firstToastShown = true;
      }
    }
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
      if (!firstToastShown) {
        toast.error(newErrors.quantity);
        firstToastShown = true;
      }
    }
    if (!formData.totalPrice || formData.totalPrice <= 0) {
      newErrors.totalPrice = "Total Price must be greater than 0";
      if (!firstToastShown) {
        toast.error(newErrors.totalPrice);
        firstToastShown = true;
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const inputEl = document.querySelector(`input[name="${firstErrorKey}"]`);
      if (inputEl) {
        inputEl.focus();
      }
      return false;
    }
    return true;
  };

  const [orders, setOrders] = useState(orderData);
  const totalOrders = orders.length;
  const proccessingOrders = orders.filter(
    (order) => order.status === "Processing"
  ).length;
  const inDeliveryOrders = orders.filter(
    (order) => order.status === "In Delivery"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;
  const informations = [
    {
      title: "Total orders",
      icon: <CiCircleCheck />,
      value: totalOrders,
    },
    {
      title: "Processing",
      icon: <CiClock2 />,
      value: proccessingOrders,
    },
    {
      title: "In delivery",
      icon: <CiDeliveryTruck />,
      value: inDeliveryOrders,
    },
    {
      title: "Cancelled",
      icon: <MdOutlineCancel />,
      value: cancelledOrders,
    },
  ];

  // status
  const dataStatus = [
    { status: "All" },
    { status: "Processing" },
    { status: "In Delivery" },
    { status: "Completed" },
    { status: "Cancelled" },
  ];
  const [filterStatus, setFilterStatus] = useState("All");

  // category
  const [dropDownCategory, setDropdownCategory] = useState(false);
  const optionsCategory = ["All", "Shirt", "Jeans", "Shoes"];
  const [filterCategory, setFilterCategory] = useState("All");

  // filter orders based on status and category
  const filteredOrders = orders.filter((order) => {
    const category =
      filterCategory === "All" ||
      order.category.toLowerCase() === filterCategory.toLowerCase();

    const status = filterStatus === "All" || order.status === filterStatus;

    return category && status;
  });
  const filteredOdersRef = useRef(null);
  useClickOutside(filteredOdersRef, () => setDropdownCategory(false));
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, filterStatus]);

  // action menu
  const [isOpenId, setIsOpenId] = useState(null);

  //PopUp
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("Add");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handletoOpenPopup = () => {
    setPopupMode("Add");
    setSelectedOrder(null);
    setFormData({
      ...initialFormData,
      id: orders.length + 1,
    });
    setPopUpPaymentDropdown("Select method");
    setSubmitted(false);
    setIsOpenPopup(true);
  };
  const handletoEditPopup = (order) => {
    setPopupMode("Edit");
    setSelectedOrder(order);
    setPopUpPaymentDropdown(order.paymentMethod || "Select method");
    setFormData({
      ...order,
      price: parseFloat(order.price.replace(/[^0-9.]/g, "")) || 0,
      quantity: order.quantity || 0,
      totalPrice: parseFloat(order.totalPrice.replace(/[^0-9.]/g, "")) || 0,
    });
    setIsOpenPopup(true);
  };

  const handletoDeletePopup = (orderId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirm) return;
    const updatedOrders = orders.filter((order) => order.id !== orderId);
    setOrders(updatedOrders);
    toast.success("Order deleted successfully");
  };
  const handletoClosePopup = () => {
    setIsOpenPopup(false);
    setPopUpPaymentDropdown("Select method");
    setPopupDropdownOpenMethod(false);
    setFormData(initialFormData);
    setSubmitted(false);
    setErrors({});
  };
  //add order
  const handleAddOrder = (newOrder) => {
    setOrders((prev) => [...prev, newOrder]);
    toast.success("New order added successfully");
    setIsOpenPopup(false);
  };
  // edit order
  const handleEditOrder = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
    toast.success("Order updated successfully");
    setIsOpenPopup(false);
  };

  // Payment Method dropdown in PopUp
  const [popUpPaymentDropdown, setPopUpPaymentDropdown] =
    useState("Select method");
  const [popupDropdownOpenMethod, setPopupDropdownOpenMethod] = useState(false);
  const popupMethodOptions = ["Credit Card", "PayPal", "Bank Transfer", "COD"];
  const popUpPaymentRef = useRef(null);
  useClickOutside(popUpPaymentRef, () => setPopupDropdownOpenMethod(false));
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrder = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  //useEffect
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalPrice: prev.price * prev.quantity || 0,
    }));
  }, [formData.price, formData.quantity]);

  return (
    <div className={container}>
      <div className={header}>
        <div className={title}>
          <h2>Order Management</h2>
          <p>Track and manage all customer fashion orders.</p>
        </div>
        <Button
          icon={<HiMiniPlus />}
          content="Create new order"
          onClick={handletoOpenPopup}
        />
      </div>
      <div className={containerInformation}>
        {informations.map((info) => (
          <Information
            title={info.title}
            icon={info.icon}
            content={info.value}
          />
        ))}
      </div>
      <div className={containerlstBtn}>
        <div className={lstBtn}>
          {dataStatus.map((btn) => (
            <Button
              content={btn.status}
              isPrimary={false}
              btnActive={filterStatus === btn.status}
              onClick={() => setFilterStatus(btn.status)}
            />
          ))}
        </div>
      </div>
      <Card>
        <div className={containerCard}>
          <CardHeader className={headerCard}>
            <h2>Order List</h2>
            <p>Manage all orders in the system.</p>
          </CardHeader>
          <div className={findContainer}>
            <Input type="text" placeholder="Search..." showIcon={true} />
            {/* dropdown filter */}
            <div
              className={dropdown}
              ref={filteredOdersRef}
              onClick={() => setDropdownCategory(!dropDownCategory)}
            >
              <Button content={filterCategory} isPrimary={false} />
              <span>
                <RiArrowDropDownLine />
              </span>
              {dropDownCategory && (
                <div className={options}>
                  {optionsCategory.map((option) => (
                    <div onClick={() => setFilterCategory(option)}>
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <CardContent>
            <table className={table}>
              <thead>
                <tr>
                  {tableHeaders.map((item) => {
                    return <th>{item.toUpperCase()}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {currentOrder.map((order) => {
                  return (
                    <tr>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td>{order.category}</td>
                      <td>{order.size}</td>
                      <td>{order.color}</td>
                      <td>{order.price}</td>
                      <td>{order.quantity}</td>
                      <td>{order.totalPrice}</td>
                      <td>{order.status}</td>
                      <td>{order.date}</td>
                      <td>
                        <ActionMenu
                          isOpen={isOpenId === order.id}
                          onToggle={() =>
                            setIsOpenId(isOpenId === order.id ? null : order.id)
                          }
                          onEdit={() => handletoEditPopup(order)}
                          onDelete={() => handletoDeletePopup(order.id)}
                          onClose={() => setIsOpenId(null)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </CardContent>

          {/* PopUp */}
          <PopUp
            isOpen={isOpenPopup}
            title={popupMode === "Add" ? "Add New Order" : "Edit Order"}
            des={
              popupMode === "Add"
                ? "Enter information cusomer and add new order."
                : "Update the order information as needed."
            }
            confirmText={popupMode === "Add" ? "Add Order" : "Save Changes"}
            onClose={() => handletoClosePopup()}
            onConfirm={() => {
              setSubmitted(true);
              if (!validateForm()) return;

              const newOrder = {
                id: popupMode === "Add" ? orders.length + 1 : formData.id,
                customer: formData.customer,
                product: formData.product,
                category: formData.category,
                size: formData.size,
                color: formData.color,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                paymentMethod: formData.paymentMethod,
                price: `$${Number(formData.price).toFixed(2)}`,
                quantity: formData.quantity,
                totalPrice: `$${Number(formData.totalPrice).toFixed(2)}`,
                status: formData.status,
                date: formData.date,
              };
              if (popupMode === "Add") {
                handleAddOrder(newOrder);
              } else {
                handleEditOrder(newOrder);
              }
              setIsOpenPopup(false);
            }}
          >
            <div className={popUpcontent}>
              <div className={infoCustomer}>
                <div className={subTitlePopup}>
                  <h4>Custommer Information</h4>
                </div>
                <div className={gridCols2}>
                  <div className={spaceY2}>
                    <label>
                      Customer Name{" "}
                      <span className={getRequiredClass("customer")}>*</span>
                    </label>
                    <Input
                      type="text"
                      name="customer"
                      placeholder="Enter customer name"
                      value={formData.customer || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>
                      Email <span className={getRequiredClass("email")}>*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Example@gmail.com"
                      value={formData.email || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className={gridCols2}>
                  <div className={spaceY2}>
                    <label>
                      Phone number
                      <span className={getRequiredClass("phone")}>*</span>
                    </label>
                    <Input
                      type="text"
                      name="phone"
                      placeholder="Enter phone number"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>
                      Payment Method{" "}
                      <span className={getRequiredClass("paymentMethod")}>
                        *
                      </span>
                    </label>
                    <div
                      className={dropdown}
                      onClick={() =>
                        setPopupDropdownOpenMethod(!popupDropdownOpenMethod)
                      }
                    >
                      <Button
                        styles={{ width: "100%" }}
                        content={popUpPaymentDropdown}
                        isPrimary={false}
                      />
                      <span>
                        <RiArrowDropDownLine />
                      </span>
                      {popupDropdownOpenMethod && (
                        <div className={options} ref={popUpPaymentRef}>
                          {popupMethodOptions.map((option) => (
                            <div
                              key={option}
                              onClick={() => (
                                setPopUpPaymentDropdown(option),
                                setFormData((prev) => ({
                                  ...prev,
                                  paymentMethod: option,
                                })),
                                setPopupDropdownOpenMethod(false)
                              )}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className={spaceY2}>
                  <label>
                    {" "}
                    Address{" "}
                    <span className={getRequiredClass("address")}>*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    name="address"
                  />
                </div>
              </div>
              <div
                style={{
                  borderBottom: "#ccc 0.5px solid",
                  margin: "7px 0 7px 0",
                }}
              ></div>
              <div className={infoProduct}>
                <div className={subTitlePopup}>
                  <h4>Product Information</h4>
                </div>
                <div className={spaceY2}>
                  <label>
                    Product name{" "}
                    <span className={getRequiredClass("product")}>*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    value={formData.product || ""}
                    onChange={handleInputChange}
                    name="product"
                  />
                </div>
                <div className={gridCols2}>
                  <div className={spaceY2}>
                    <label>
                      Size <span className={getRequiredClass("size")}>*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: S, M,..."
                      value={formData.size || ""}
                      onChange={handleInputChange}
                      name="size"
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>
                      Color <span className={getRequiredClass("color")}>*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Ex: White, Black,..."
                      value={formData.color || ""}
                      onChange={handleInputChange}
                      name="color"
                    />
                  </div>
                </div>
                <div className={gridCols2}>
                  <div className={spaceY2}>
                    <label>
                      Quantity{" "}
                      <span className={getRequiredClass("quantity")}>*</span>
                    </label>
                    <Input
                      type="number"
                      min={1}
                      placeholder="1"
                      value={formData.quantity || ""}
                      onChange={handleInputChange}
                      name="quantity"
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>
                      Price <span className={getRequiredClass("price")}>*</span>
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={formData.price || ""}
                      onChange={handleInputChange}
                      name="price"
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopUp>
        </div>
      </Card>
    </div>
  );
}

export default Order;
