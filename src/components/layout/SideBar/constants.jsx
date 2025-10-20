import { AiOutlineMessage } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDashboard, MdProductionQuantityLimits } from "react-icons/md";
import { TbReportOff } from "react-icons/tb";

const navigation = [
  { content: "Dashboard", icon: <MdOutlineDashboard /> },
  { content: "Users", icon: <FiUsers /> },
  { content: "Products", icon: <MdProductionQuantityLimits /> },
  { content: "Messages", icon: <AiOutlineMessage /> },
  { content: "Notifications", icon: <IoMdNotificationsOutline /> },
  { content: "Reports", icon: <TbReportOff /> },
  { content: "AdminInfo", icon: <MdOutlineDashboard /> },
];

export default navigation;
