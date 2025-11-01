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
    setIsOpenPopup(true);
  };
  const handletoEditPopup = (order) => {
    setPopupMode("Edit");
    setIsOpenPopup(true);
    setSelectedOrder(order);
    setPopUpPaymentDropdown(order.paymentMethod || "Select method");
    console.log(order);
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

  return (
    <div className={container}>
      <div className={header}>
        <div className={title}>
          <h2>Order Management</h2>
          <p>Track and manage all customer fashion orders.</p>
        </div>
        <Button
          showIcon={true}
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
              if (popupMode === "add") {
                toast.success("Order added successfully!");
              } else {
                toast.info("Order updated successfully!");
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
                    <label>Customer Name</label>
                    <Input
                      type="text"
                      placeholder="Enter customer name"
                      defaultValue={selectedOrder?.customer}
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>Email</label>
                    <Input
                      type="email"
                      placeholder="Example@gmail.com"
                      defaultValue={selectedOrder?.email}
                    />
                  </div>
                </div>
                <div className={gridCols2}>
                  <div className={spaceY2}>
                    <label>Phone number</label>
                    <Input
                      type="text"
                      placeholder="Enter phone number"
                      defaultValue={selectedOrder?.phone}
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>Payment Method</label>
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
                  <label> Address</label>
                  <Input type="text" placeholder="Enter address" />
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
                  <label>Product name</label>
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    defaultValue={selectedOrder?.product}
                  />
                </div>
                <div className={gridCols2}>
                  <div className={spaceY2}>
                    <label>Size</label>
                    <Input
                      type="text"
                      placeholder="Ex: S, M,..."
                      defaultValue={selectedOrder?.size}
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>Color</label>
                    <Input
                      type="text"
                      placeholder="Ex: White, Black,..."
                      defaultValue={selectedOrder?.color}
                    />
                  </div>
                </div>
                <div className={gridCols2}>
                  <div className={spaceY2}>
                    <label>Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="1"
                      defaultValue={selectedOrder?.quantity}
                    />
                  </div>
                  <div className={spaceY2}>
                    <label>Price</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      defaultValue={selectedOrder?.totalPrice}
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
