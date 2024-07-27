import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaHome,
  FaRegBuilding,
  FaCalendarCheck,
  FaUser,
  FaMoneyBill,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import SidebarMenu from "./SidebarMenu";
import * as IoIcons from "react-icons/io";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import "./SideBarEmp.css";
import { BsCalendarWeek } from "react-icons/bs";
import { MdOutlineHolidayVillage } from "react-icons/md";
import { MdEventNote } from 'react-icons/md';
import { LuCalendarCheck } from "react-icons/lu";
import { MdEditCalendar } from "react-icons/md";
import { FaListUl } from "react-icons/fa";

const routes = [
  {
    path: "/Dashboard2",
    name: "Dashboard",
    icon: <FaHome />,
  },
  {
    name: "Leave",
    icon: <MdEventNote  />,
    exact: true,
    subRoutes:[
      {
      path: "/Leave2",
      name: "Apply Leave",
      icon:<MdEditCalendar />,
    },
    {
      path: "/leavestatus",
      name: "Leave Status ",
      icon: <LuCalendarCheck />,
    },
  ],
  },
  
  {
    path: "/Payslip2",
    name: "Pay-slip",
    icon: <IoIcons.IoIosPaper />,
  },
  {
    path: "/Holiday2",
    name: "Holiday-List",
    icon: <FaListUl />,
  },
  {
    path: "/CompanyDetails2",
    name: "Company Details",
    icon: <FaRegBuilding />,
  },
  {
    path: "/",
    name: "LogOut",
    icon: <AiIcons.AiOutlineLogout />,
  },
];

const SideBarEmp = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
  };

  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  useEffect(() => {
    const storedEmployee = localStorage.getItem("loggedInEmployee");
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
                <div className="space2314">
                  <motion.h1
                    variants={showAnimation}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="logo23"
                  >
                    Matrical
                  </motion.h1>
                </div>
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
                  <p className="span554">
                    {loggedInEmployee.fullname[0].toUpperCase()}
                  </p>
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
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBarEmp;
