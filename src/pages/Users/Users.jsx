import styles from "./styles.module.scss";
import Button from "@/components/ui/Button/Button";
import Card from "@/components/Card/Card";
import CardHeader from "@/components/Card/CardHeader/CardHeader";
import CardContent from "@/components/Card/CardContent/CardContent";
import Input from "@/components/ui/Input/Input";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useState, useEffect, useRef, useContext } from "react";
import Pagination from "@/components/ui/Pagination/Pagination";
import ActionMenu from "@/components/ui/ActionMenu/ActionMenu";
import PopUp from "@components/ui/PopUp/PopUp";
import useClickOutside from "@hooks/useClickOutside";
import { ToastContext } from "@/contexts/ToastContext";
import { mockUserData, tableHeaders } from "./constants";
import { CiFilter } from "react-icons/ci";
import {
  FaRegUser,
  FaUserCheck,
  FaUserPlus,
  FaUserSlash,
} from "react-icons/fa";
import Information from "@components/ui/Information/Information";

function Users() {
  const {
    header,
    title,
    container,
    headerCard,
    dropdown,
    options,
    findContainer,
    table,
    popUpContent,
    spaceY2,
    required,
    containerInformation,
    containerlstBtn,
    lstBtn,
  } = styles;

  const { toast } = useContext(ToastContext);

  const initialFormData = {
    id: "",
    name: "",
    email: "",
    role: "Select Role",
    status: "Select Status",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [submitted, setSubmitted] = useState(false);

  const getRequiredClass = (field) => {
    return submitted && !formData[field] ? required : "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatString = (str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // Convert API users to UI-friendly format
  const convertUsers = (list) =>
    list.map((u) => ({
      id: u.id,
      name: u.fullName,
      email: u.email,
      role: u.roles?.[0]?.name || "USER",
      status: u.status,
      img: u.avatar || "/default-avatar.png",
      details: u,
      actions: ["Edit", "View Details", "Delete"],
    }));

  // MOCK SERVICE
  const userService = {
    getUsers: async () => {
      // Lấy đúng mảng từ mock API
      const res = mockUserData; // {status, message, data: { data: [...] }}
      return convertUsers(res.data.data);
    },

    createUser: async (user) => {
      return Promise.resolve(user);
    },

    updateUser: async (user) => {
      return Promise.resolve(user);
    },

    deleteUser: async (id) => {
      return Promise.resolve(id);
    },
  };

  const [users, setUsers] = useState([]);

  const totalUsers = users.length;
  const ActiveUsers = users.filter(
    (u) => u.status.toLowerCase() === "active"
  ).length;
  const InactiveUsers = totalUsers - ActiveUsers;

  const informations = [
    {
      title: "Total Accounts",
      icon: <FaRegUser />,
      value: totalUsers.toString(),
    },
    {
      title: " Active Accounts ",
      icon: <FaUserCheck />,
      value: ActiveUsers.toString(),
    },
    {
      title: " Inactive Accounts ",
      icon: <FaUserSlash />,
      value: InactiveUsers.toString(),
    },
  ];

  const dataStatus = [
    { status: "All" },
    { status: "Active" },
    { status: "Inactive" },
  ];

  useEffect(() => {
    userService.getUsers().then((data) => setUsers(data));
  }, []);

  const [isOpenId, setIsOpenId] = useState(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  // Dropdowns
  const roleOptions = ["Admin", "User", "Order Staff", "Warehouse Staff"];
  const statusOptions = ["Active", "Inactive"];

  const [popUpDropdownRoleOpen, setPopUpDropdownRoleOpen] = useState(false);
  const [popUpDropdownStatusOpen, setPopUpDropdownStatusOpen] = useState(false);

  const popUpRoleRef = useRef(null);
  const popUpStatusRef = useRef(null);

  useClickOutside(popUpRoleRef, () => setPopUpDropdownRoleOpen(false));
  useClickOutside(popUpStatusRef, () => setPopUpDropdownStatusOpen(false));

  // Filter role
  const [open, setOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("All");
  const filterRef = useRef(null);
  useClickOutside(filterRef, () => setOpen(false));

  const [filterStatus, setFilterStatus] = useState("All");

  const filteredUsers = users.filter((u) => {
    const statusMatch =
      filterStatus === "All"
        ? true
        : u.status.toLowerCase() === filterStatus.toLowerCase();
    const roleMatch =
      filterRole === "All"
        ? true
        : u.role.toLowerCase() === filterRole.toLowerCase();
    return statusMatch && roleMatch;
  });

  // const filteredUsers =
  //   filterRole === "All"
  //     ? users
  //     : users.filter((u) => u.role.toLowerCase() === filterRole.toLowerCase());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole]);

  // CRUD functions
  const handleOpenAddPopup = () => {
    // setFormData({ ...initialFormData, id: users.length + 1 });
    setFormData(initialFormData);
    setSubmitted(false);
    setIsPopUpOpen(true);
  };

  const handleToEditPopup = (user) => {
    setFormData({ ...user });
    setIsPopUpOpen(true);
  };

  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    toast.success("User added successfully!");
  };

  const handleEditUser = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    toast.success("User updated successfully!");
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User deleted!");
  };

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  const handleViewDetails = (user) => {
    setSelectedUserDetail(user.details); // Lấy data gốc đã lưu trong trường 'details'
    setIsDetailsModalOpen(true);
    setIsOpenId(null);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedUserDetail(null);
  };

  const handleClosePopup = () => {
    setIsPopUpOpen(false);
    setFormData(initialFormData);
    setSubmitted(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (formData.role === "Select Role") {
      toast.error("Role is required");
      return false;
    }
    if (formData.status === "Select Status") {
      toast.error("Status is required");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const isAdding = !formData.id;
    const newId = isAdding ? users.length + 1 : formData.id;

    const baseUser = {
      id: newId,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      img: formData.img || "/default-avatar.png",
      actions: ["Edit", "View Details", "Delete"],
    };

    // --- Logic Chuẩn bị Dữ liệu chi tiết (details) ---
    let userDetails = users.find((u) => u.id === newId)?.details;

    if (isAdding) {
      // Thiết lập các trường chi tiết mặc định khi thêm mới
      userDetails = {
        id: newId,
        fullName: formData.name,
        email: formData.email,
        roles: [{ name: formData.role.toUpperCase() }], // Lưu vai trò dưới dạng API
        status: formData.status.toUpperCase(),
        avatar: formData.img || "/default-avatar.png",
        phone: null,
        totalSpent: 0,
        userRankResponse: null,
        addressResponses: [],
      };
    } else {
      // Cập nhật các trường cơ bản khi chỉnh sửa
      userDetails = {
        ...userDetails, // Giữ lại các trường chi tiết (như addresses, phone, dob...)
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        roles: [{ name: formData.role.toUpperCase() }],
        status: formData.status.toUpperCase(),
      };
    }
    // --- Kết thúc Logic Chuẩn bị Dữ liệu chi tiết ---

    const user = { ...baseUser, details: userDetails };
    console.log("user: ", user);

    isAdding ? handleAddUser(user) : handleEditUser(user);
    handleClosePopup();
  };

  return (
    <div className={container}>
      <div className={header}>
        <div className={title}>
          <h2>User Management</h2>
          <p>Manage user accounts, roles, and permissions.</p>
        </div>
        <Button
          icon={
            <FaUserPlus size={22} color="white" style={{ marginRight: 8 }} />
          }
          content="Add User"
          showIcon
          onClick={handleOpenAddPopup}
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
        <CardHeader className={headerCard}>
          <h4>Users</h4>
          <p>A list of all users in the system.</p>
        </CardHeader>

        {/* FILTER + SEARCH */}
        <div className={findContainer}>
          <Input showIcon placeholder="Search users..." />

          <div
            className={dropdown}
            ref={filterRef}
            onClick={() => setOpen(!open)}
          >
            <Button
              icon={<CiFilter size={22} color="black" fontWeight={600} />}
              content={filterRole}
              isPrimary={false}
            />

            {open && (
              <div className={options}>
                {["All", ...roleOptions].map((role) => (
                  <div
                    key={role}
                    onClick={() => {
                      setFilterRole(formatString(role));
                      setOpen(false);
                    }}
                  >
                    {formatString(role)}
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
                {tableHeaders.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>

                  <td style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img
                      src={user.img}
                      width="35"
                      style={{ borderRadius: "50%" }}
                    />
                    {user.name}
                  </td>

                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>

                  <td>
                    <ActionMenu
                      isOpen={isOpenId === user.id}
                      onToggle={() =>
                        setIsOpenId((prev) =>
                          prev === user.id ? null : user.id
                        )
                      }
                      actions={user.actions}
                      onEdit={() => handleToEditPopup(user)}
                      onView={() => {
                        handleViewDetails(user);
                      }}
                      onDelete={() => handleDeleteUser(user.id)}
                      onClose={() => setIsOpenId(null)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>

        {/* POPUP */}
        <PopUp
          isOpen={isPopUpOpen}
          title={formData.id ? "Edit User" : "Add User"}
          confirmText={formData.id ? "Save" : "Create"}
          onClose={handleClosePopup}
          onConfirm={handleSubmit}
          // onConfirm={() => {
          //   setSubmitted(true);
          //   if (!validateForm()) return;
          //   const isAdding = !formData.id;
          //   const newId = isAdding ? users.length + 1 : formData.id;
          //   // const user = {
          //   //   id: formData.id || users.length + 1,
          //   //   name: formData.name,
          //   //   email: formData.email,
          //   //   role: formData.role,
          //   //   status: formData.status,
          //   //   img: formData.img || "/default-avatar.png",
          //   //   actions: ["Edit", "View Details", "Delete"],
          //   // };
          //   const baseUser = {
          //     id: newId,
          //     name: formData.name,
          //     email: formData.email,
          //     role: formData.role,
          //     status: formData.status,
          //     img: formData.img || "/default-avatar.png",
          //     actions: ["Edit", "View Details", "Delete"],
          //   };

          //   const userDetails = isAdding
          //     ? {
          //         // Thiết lập các trường chi tiết mặc định khi thêm mới
          //         id: newId,
          //         fullName: formData.name,
          //         email: formData.email,
          //         roles: [{ name: formData.role }],
          //         status: formData.status.toUpperCase(),
          //         avatar: formData.img || "/default-avatar.png",
          //         phone: null,
          //         totalSpent: 0,
          //         userRankResponse: null,
          //         addressResponses: [],
          //       }
          //     : users.find((u) => u.id === newId)?.details;

          //   const user = { ...baseUser, details: userDetails };

          //   isAdding ? handleAddUser(user) : handleEditUser(user);
          //   handleClosePopup();

          //   // formData.id ? handleEditUser(user) : handleAddUser(user);
          //   // handleClosePopup();
          // }}
        >
          <div className={popUpContent}>
            {/* NAME */}
            <div className={spaceY2}>
              <label>
                Full name <span className={getRequiredClass("name")}>*</span>
              </label>
              <Input
                name="name"
                placeholder="Enter name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            {/* EMAIL */}
            <div className={spaceY2}>
              <label>
                Email <span className={getRequiredClass("email")}>*</span>
              </label>
              <Input
                name="email"
                placeholder="Enter email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {/* {Phone numeber} */}
            <div className={spaceY2}>
              <label>
                Phone Number{" "}
                <span className={getRequiredClass("phone")}>*</span>
              </label>
              <Input
                name="phone"
                placeholder="Enter phone number"
                type="text"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            {/* ROLE */}
            <div className={spaceY2}>
              <label>
                Role <span className={getRequiredClass("role")}>*</span>
              </label>

              <div
                className={dropdown}
                ref={popUpRoleRef}
                onClick={() => setPopUpDropdownRoleOpen(!popUpDropdownRoleOpen)}
              >
                <Button content={formData.role} isPrimary={false} />
                <span>
                  <RiArrowDropDownLine />
                </span>
                {popUpDropdownRoleOpen && (
                  <div className={options}>
                    {roleOptions.map((r) => (
                      <div
                        key={r}
                        onClick={() => {
                          setFormData({ ...formData, role: r });
                          setPopUpDropdownRoleOpen(false);
                        }}
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className={spaceY2}>
              <label>
                Status <span className={getRequiredClass("status")}>*</span>
              </label>

              <div
                className={dropdown}
                ref={popUpStatusRef}
                onClick={() =>
                  setPopUpDropdownStatusOpen(!popUpDropdownStatusOpen)
                }
              >
                <Button content={formData.status} isPrimary={false} />
                <span>
                  <RiArrowDropDownLine />
                </span>
                {popUpDropdownStatusOpen && (
                  <div className={options}>
                    {statusOptions.map((s) => (
                      <div
                        key={s}
                        onClick={() => {
                          setFormData({ ...formData, status: s });
                          setPopUpDropdownStatusOpen(false);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </PopUp>

        {/* POPUP XEM CHI TIẾT */}
        <PopUp
          isOpen={isDetailsModalOpen}
          title="User Details"
          confirmText="Close" // Đổi nút Confirm thành Close
          onClose={handleCloseDetailsModal}
          onConfirm={handleCloseDetailsModal} // Xử lý đóng modal khi click Confirm (Close)
          hideCancelButton // Ẩn nút Cancel
        >
          <div className={popUpContent}>
            {selectedUserDetail ? (
              <>
                <div className={spaceY2}>
                  <p>
                    **Avatar:**{" "}
                    {selectedUserDetail.avatar && (
                      <img
                        src={selectedUserDetail.avatar}
                        alt="Avatar"
                        width="50"
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                  </p>
                </div>
                <div className={spaceY2}>
                  <p>**Full Name:** {selectedUserDetail.fullName}</p>
                </div>
                <div className={spaceY2}>
                  <p>**Email:** {selectedUserDetail.email}</p>
                </div>
                <div className={spaceY2}>
                  <p>**Phone:** {selectedUserDetail.phone || "N/A"}</p>
                </div>
                <div className={spaceY2}>
                  <p>**Gender:** {selectedUserDetail.gender || "N/A"}</p>
                </div>
                <div className={spaceY2}>
                  <p>
                    **Date of Birth:** {selectedUserDetail.dateOfBirth || "N/A"}
                  </p>
                </div>
                <div className={spaceY2}>
                  <p>**Status:** {selectedUserDetail.status}</p>
                </div>
                <div className={spaceY2}>
                  <p>
                    **Roles:**{" "}
                    {selectedUserDetail.roles.map((r) => r.name).join(", ")}
                  </p>
                </div>
                <div className={spaceY2}>
                  <p>
                    **Total Spent:**{" "}
                    {selectedUserDetail.totalSpent?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className={spaceY2}>
                  <p>
                    **User Rank:**{" "}
                    {selectedUserDetail.userRankResponse?.name || "N/A"}
                  </p>
                </div>
              </>
            ) : (
              <p>Loading user details...</p>
            )}
          </div>
        </PopUp>
      </Card>
    </div>
  );
}

export default Users;
