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

  const [isOpenId, setIsOpenId] = useState(null); //action Menu

  const [isPopUpOpen, setIsPopUpOpen] = useState(false);

  const [users, setUsers] = useState(userData);
  // role dropdown
  const [isPopUpRole, setIsPopUpRole] = useState("Select Role");
  const [popUpDropdownRoleOpen, setpopUpDropdownRoleOpen] = useState(false);
  const popUpRole = ["Admin", "Editor", "Viewer"];
  const popUpRoleRef = useRef(null);
  useClickOutside(popUpRoleRef, () => setpopUpDropdownRoleOpen(false));
  // status dropdown
  const [isPopUpStatus, setIsPopUpStatus] = useState("Select Status");
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

  const handleToOpenPopup = () => {
    setPopupMode("Add");
    setSelectedUser(null);
    setIsPopUpOpen(true);
  };

  const handleToEditUser = (user) => {
    setPopupMode("Edit");
    setSelectedUser(user);
    setIsPopUpRole(user.role);
    setIsPopUpStatus(user.status);
    setIsPopUpOpen(true);
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    toast.success(`User with ID ${userId} has been deleted.`);
  };

  const handleClosePopup = () => {
    setIsPopUpOpen(false);
    setIsPopUpRole("Select Role");
    setIsPopUpStatus("Select Status");
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
          onClick={handleToOpenPopup}
        />
      </div>
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
          if (popupMode === "Add") {
            toast.success("New user has been created.");
          } else {
            toast.info("User information has been updated.");
          }
          handleClosePopup();
        }}
        onClose={handleClosePopup}
      >
        <div className={popUpContent}>
          <div className={spaceY2}>
            <label>Full name</label>
            <Input
              placeholder="Enter full name"
              type="text"
              defaultValue={selectedUser?.name}
            />
          </div>
          <div className={spaceY2}>
            <label>Email</label>
            <Input
              placeholder="Enter email"
              type="email"
              defaultValue={selectedUser?.email}
            />
          </div>
          <div className={spaceY2}>
            <label>Role</label>
            <div
              className={dropdown}
              onClick={() => setpopUpDropdownRoleOpen(!popUpDropdownRoleOpen)}
              ref={popUpRoleRef}
            >
              <Button
                styles={{ width: "100%" }}
                content={isPopUpRole}
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
                        setIsPopUpRole(role), setpopUpDropdownRoleOpen(false)
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
            <label>Status</label>
            <div
              className={dropdown}
              onClick={() =>
                setpopUpDropdownStatusOpen(!popUpDropdownStatusOpen)
              }
              ref={popUpStatusRef}
            >
              <Button
                styles={{ width: "100%" }}
                content={isPopUpStatus}
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
                        setIsPopUpStatus(status),
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
                        handleToEditUser(user);
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
      </Card>
    </div>
  );
}

export default Users;
