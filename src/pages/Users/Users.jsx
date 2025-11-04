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
import { tableHeaders, userData } from "./constants";
import PopUp from "@components/ui/PopUp/PopUp";
import useClickOutside from "@hooks/useClickOutside";
import { ToastContext } from "@/contexts/ToastContext";

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
  } = styles;

  const { toast } = useContext(ToastContext);

  const initialFormData = {
    id: "",
    name: "",
    email: "",
    role: "Select Role",
    status: "Select Status",
  };

  const [submitted, setSubmitted] = useState(false);
  const getRequiredClass = (field) => {
    return submitted && !formData[field] ? styles.required : "";
  };
  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let firstToastShown = false;
    if (!formData.name.trim()) {
      newErrors.name = "User name is required";
      if (!firstToastShown) {
        toast.error(newErrors.name);
        firstToastShown = true;
      }
    }
    // if (!formData.email.trim()) {
    //   newErrors.email = "Email is required";
    //   if (!firstToastShown) {
    //     toast.error(newErrors.email);
    //     firstToastShown = true;
    //   }
    // }
    if (formData.role === "Select Role") {
      newErrors.role = "Role is required";
      if (!firstToastShown) {
        toast.error(newErrors.role);
        firstToastShown = true;
      }
    }
    if (formData.status === "Select Status") {
      newErrors.status = "Status is required";
      if (!firstToastShown) {
        toast.error(newErrors.status);
        firstToastShown = true;
      }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const inputEl = document.querySelector(`input[name="${firstErrorKey}"]`);
      if (inputEl) inputEl.focus();
      return false;
    }

    return true;
  };

  const [isOpenId, setIsOpenId] = useState(null); //action Menu

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [users, setUsers] = useState(userData);
  // role dropdown
  // const [isPopUpRole, setIsPopUpRole] = useState("Select Role");
  const [popUpDropdownRoleOpen, setpopUpDropdownRoleOpen] = useState(false);
  const popUpRole = ["Admin", "Editor", "Viewer"];
  const popUpRoleRef = useRef(null);
  useClickOutside(popUpRoleRef, () => setpopUpDropdownRoleOpen(false));
  // status dropdown
  // const [isPopUpStatus, setIsPopUpStatus] = useState("Select Status");
  const [popUpDropdownStatusOpen, setpopUpDropdownStatusOpen] = useState(false);
  const popUpStatus = ["Active", "Inactive"];
  const popUpStatusRef = useRef(null);
  useClickOutside(popUpStatusRef, () => setpopUpDropdownStatusOpen(false));
  // filter dropdown
  const [open, setOpen] = useState(false);
  const [filterRole, setFilterRole] = useState("All");
  const optionsRole = ["All", "Admin", "Editor", "Viewer"];
  const filterRef = useRef(null);
  useClickOutside(filterRef, () => setOpen(false));
  // popup mode
  const [popupMode, setPopupMode] = useState("Add");
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers =
    filterRole === "All"
      ? users
      : users.filter(
          (user) => user.role.toLowerCase() === filterRole.toLowerCase()
        );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole]);
  // open add user popup
  const handleOpenAddPopup = () => {
    setFormData({
      ...initialFormData,
      id: users.length + 1,
    });
    setSubmitted(false);
    setIsPopUpOpen(true);
  };
  // open edit user popup
  const handleToEditPopup = (user) => {
    setPopupMode("Edit");
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsPopUpOpen(true);
  };
  // add user
  const handleAddUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    toast.success("User added successfully!");
    setIsPopUpOpen(false);
  };
  // edit user
  const handleEditUser = (updatedUsers) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUsers.id ? updatedUsers : user))
    );
    toast.success("User updated successfully!");
    setIsPopUpOpen(false);
  };
  // delete user
  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    toast.success(`User with ID ${userId} has been deleted.`);
  };
  //close popup
  const handleClosePopup = () => {
    setIsPopUpOpen(false);
    setFormData(initialFormData);
    setSubmitted(false);
    setpopUpDropdownRoleOpen(false);
    setpopUpDropdownStatusOpen(false);
  };

  return (
    <div className={container}>
      <div className={header}>
        <div className={title}>
          <h2>User Management</h2>
          <p>Manage user accounts, roles, and permissions.</p>
        </div>
        <Button
          showIcon={true}
          content="Add User"
          onClick={handleOpenAddPopup}
        />
      </div>

      <Card>
        <CardHeader className={headerCard}>
          <h4>Users</h4>
          <p>A list of all users in your organization.</p>
        </CardHeader>

        <div className={findContainer}>
          <Input showIcon={true} placeholder="Search users..." />
          <div
            className={dropdown}
            onClick={() => setOpen(!open)}
            ref={filterRef}
          >
            <Button content={filterRole} isPrimary={false} />
            <span>
              <RiArrowDropDownLine />
            </span>

            {open && (
              <div className={options}>
                {optionsRole.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setFilterRole(option);
                      setOpen(false);
                    }}
                  >
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
                {tableHeaders.map((item) => (
                  <th key={item}>{item.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: "8px",
                    }}
                  >
                    <img src={user.img} alt="" width="35" />
                    <span>{user.name}</span>
                  </td>
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
                      onClose={() => setIsOpenId(null)}
                      onDelete={() => handleDeleteUser(user.id)}
                      onEdit={() => {
                        handleToEditPopup(user);
                      }}
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
        <PopUp
          isOpen={isPopUpOpen}
          title={popupMode === "Add" ? "Add New User" : "Edit User"}
          des={
            popupMode === "Add"
              ? "Enter the information to create a new user account in the system."
              : "Update the information for the selected user account."
          }
          confirmText={popupMode === "Add" ? "Create User" : "Save Changes"}
          onConfirm={() => {
            setSubmitted(true);
            if (!validateForm()) return;

            const newUser = {
              id: popupMode === "Add" ? users.length + 1 : formData.id,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              status: formData.status,
            };
            if (popupMode === "Add") {
              handleAddUser(newUser);
            } else {
              handleEditUser(newUser);
            }
            handleClosePopup();
          }}
          onClose={handleClosePopup}
        >
          <div className={popUpContent}>
            <div className={spaceY2}>
              <label>
                Full name <span className={getRequiredClass("name")}>*</span>
              </label>
              <Input
                placeholder="Enter full name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className={spaceY2}>
              <label>
                Email <span className={getRequiredClass("email")}>*</span>
              </label>
              <Input
                placeholder="Enter email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={spaceY2}>
              <label>
                Role <span className={getRequiredClass("role")}>*</span>
              </label>
              <div
                className={dropdown}
                onClick={() => setpopUpDropdownRoleOpen(!popUpDropdownRoleOpen)}
                ref={popUpRoleRef}
              >
                <Button
                  styles={{ width: "100%" }}
                  content={formData.role}
                  isPrimary={false}
                />
                <span>
                  <RiArrowDropDownLine />
                </span>
                {popUpDropdownRoleOpen && (
                  <div className={options}>
                    {popUpRole.map((role) => (
                      <div
                        key={role}
                        onClick={() => (
                          setFormData({ ...formData, role }),
                          // setIsPopUpRole(role),
                          setpopUpDropdownRoleOpen(false)
                        )}
                      >
                        {role}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={spaceY2}>
              <label>
                Status <span className={getRequiredClass("status")}>*</span>
              </label>
              <div
                className={dropdown}
                onClick={() =>
                  setpopUpDropdownStatusOpen(!popUpDropdownStatusOpen)
                }
                ref={popUpStatusRef}
              >
                <Button
                  styles={{ width: "100%" }}
                  content={formData.status}
                  isPrimary={false}
                />
                <span>
                  <RiArrowDropDownLine />
                </span>
                {popUpDropdownStatusOpen && (
                  <div className={options}>
                    {popUpStatus.map((status) => (
                      <div
                        key={status}
                        onClick={() => (
                          setFormData({ ...formData, status }),
                          // setIsPopUpStatus(status),
                          setpopUpDropdownStatusOpen(false)
                        )}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </PopUp>
      </Card>
    </div>
  );
}

export default Users;
