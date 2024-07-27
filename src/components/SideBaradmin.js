import { NavLink } from "react-router-dom";
import { FaBars } from "react-icons/fa";

import { useState ,useEffect} from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "../Employee/SidebarMenu";
import * as IoIcons from "react-icons/io";
import * as FaIcons from "react-icons/fa";

import * as AiIcons from "react-icons/ai";
import { FaRegCircleUser } from "react-icons/fa6";

import "./SideBaradmin.css";
import { IoPersonSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { FaAddressCard } from "react-icons/fa";
import { BsPersonRolodex } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import { HiClipboardDocumentList } from "react-icons/hi2";
import { HiDocumentDuplicate } from "react-icons/hi2";
import { MdHolidayVillage } from "react-icons/md";
import { MdOutlineAddBusiness } from "react-icons/md";
import { RiHomeOfficeLine } from "react-icons/ri";
import { GrUserAdmin } from "react-icons/gr";
import { TiUserAdd } from "react-icons/ti";
import { MdAdminPanelSettings } from "react-icons/md";

const routes = [
  {
    path: "/Dashboard",
    name: "Dashboard",
    icon: <AiIcons.AiFillHome />,
  },
 
  {
    
    name: "Employee",
    icon: <IoPersonSharp />,
    subRoutes: [
      {
        path: "/Add_Employee",
        name: "Add Employee ",
        icon: <IoMdPersonAdd />,
      },
      {
        path: "/ManageEmployee",
        name: "Manage Employee ",
        icon: <IoIcons.IoIosPaper />,
      }
      
    ],
  },
  // {
  //   path: "/order",
  //   name: "Payrole",
  //   icon: <BsCartCheck />,
  // },
  {
    name: "Department",
    icon: <IoIcons.IoMdPeople />,
    exact: true,
    subRoutes: [
      {
        path: "/Department",
        name: "Add Department ",
        icon: <FaAddressCard />,
      },
      {
        path: "/ManageDepartment",
        name: "Manage Department ",
        icon: <BsPersonRolodex />,
      }
      
    ],
  },

  {
    name: "Attendance",
    icon: <FaIcons.FaCalendarCheck />,
    exact: true,
    subRoutes: [
      {
        path: "/Attendance",
        name: "Daily Attendance ",
        icon: <IoIcons.IoIosCalendar />,
      },
      {
        path: "/Reports",
        name: "Attendance Report ",
        icon: <IoIcons.IoIosClipboard />,
      }
      
    ],
  },

  // {
  //   path: "/Payroll",
  //   name: "Payslip",
  //   icon: <IoIcons.IoIosPaper />,
  // },

  {
    name: "Payroll",
    icon: <MdPayment />,
    exact: true,
    subRoutes: [
      {
        path: "/Payroll",
        name: "Payslip",
        icon: <HiClipboardDocumentList />,
      },
      {
        path: "/DisplaySalaryData",
        name: "All-Payslips ",
        icon: <HiDocumentDuplicate />,
      }
      
    ],
  },
  



  {
    // path: "/Payslip2",
    name: "Holiday",
    icon: <MdHolidayVillage />,
    exact: true,
    subRoutes: [
      {
        path: "/AddHoliday",
        name: "Add Holiday ",
        icon: <MdOutlineAddBusiness />,
      },
      {
        path: "/ManageHoliday",
        name: "Manage Holiday ",
        icon: <RiHomeOfficeLine />,
      }
      
    ],
  },
  {
    // path: "/Payslip2",
    name: "Admin",
    icon: <GrUserAdmin />,
    exact: true,
    subRoutes: [
      {
        path: "/Admin",
        name: "Add Admin",
        icon: <TiUserAdd />,
      },
      {
        path: "/Manageadmin",
        name: "Manage Admin",
        icon: <MdAdminPanelSettings />,
      }
      
    ],
  },

  {
    path: "/",
    name: "LogOut",
    icon: <AiIcons.AiOutlineLogout />,
  }

];



const SideBaradmin = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  useEffect(() => {
    
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      setLoggedInEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  return (
    <>
      <div className="main-container23">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "45px",
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
          }}
          className={`sidebar23 `}
        >
          <div className="top_section23">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo23"
                >
                  Admin Matrical
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars23">
              <FaBars onClick={toggle} className="toggle3232" />
            </div>
          </div>

          

          <section className="routes23">
            
            <div className="link2323">
            <div className="icon65">
  {loggedInEmployee && loggedInEmployee.fullname && (
    <p className="span554">{loggedInEmployee.fullname[0].toUpperCase()}</p>
    
  )}
</div>
<AnimatePresence>
  {isOpen && (
    <div className="space2314">
      <motion.div
        variants={showAnimation}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="link_text23"
      >
        {loggedInEmployee && loggedInEmployee.fullname}
      </motion.div>
    </div>
  )}
</AnimatePresence>
            </div>
<div className="heightflow443">
            {routes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                    key={index}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link23"
                  activeClassName="active23"
                >
                  <div className="icon23">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text23"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
            </div>
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBaradmin;



