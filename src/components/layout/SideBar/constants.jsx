import { AiOutlineMessage } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDashboard, MdProductionQuantityLimits } from "react-icons/md";
import { TbReportOff } from "react-icons/tb";

const navigation = [
  { path: "/", content: "Dashboard", icon: <MdOutlineDashboard /> },
  { path: "/users", content: "Users", icon: <FiUsers /> },
  {
    path: "/products",
    content: "Products",
    icon: <MdProductionQuantityLimits />,
  },
  { path: "/order", content: "Order", icon: <MdOutlineDashboard /> },
  { path: "/messages", content: "Messages", icon: <AiOutlineMessage /> },
  {
    path: "/notifications",
    content: "Notifications",
    icon: <IoMdNotificationsOutline />,
  },
  { path: "/reports", content: "Reports", icon: <TbReportOff /> },
  { path: "/admin-info", content: "AdminInfo", icon: <MdOutlineDashboard /> },
];

export default navigation;
