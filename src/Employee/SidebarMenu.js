import React, { useState, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Tooltip as ReactTooltip } from 'react-tooltip';  // Corrected import

const menuAnimation = {
  hidden: {
    opacity: 0,
    height: 0,
    padding: 0,
    transition: { duration: 0.3, when: "afterChildren" },
  },
  show: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
    },
  },
};

const menuItemAnimation = {
  hidden: (i) => ({
    padding: 0,
    x: "-100%",
    transition: {
      duration: (i + 1) * 0.1,
    },
  }),
  show: (i) => ({
    x: 0,
    transition: {
      duration: (i + 1) * 0.1,
    },
  }),
};

const SidebarMenu = ({ route, showAnimation, isOpen, setIsOpen, loggedInEmployee }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsMenuOpen(false);
    }
  }, [isOpen]);

  return (
    <>
      <div className="menu23" onClick={toggleMenu}>
        <div className="menu_item23">
          <div className="icon23" data-tip={route.name} data-for={`tooltip-${route.name}`}>
            {route.icon}
          </div>
          <ReactTooltip
            id={`tooltip-${route.name}`}
            effect="solid"
            place="right"
            delayHide={100}
          />
          <div>
            {isOpen && (
              <div>
                {route.name}
              </div>
            )}
          </div>
        </div>
        {isOpen && (
          <div>
            <FaAngleDown />
          </div>
        )}
      </div>{" "}
      {isOpen && (
        <div>
          {isMenuOpen && (
            <div className="openmenu65">
              {route.subRoutes.map((subRoute, i) => (
                <div key={i} className="mainroute886">
                  <NavLink to={subRoute.path} className="link23">
                    <div className="icon23" data-tip={subRoute.name} data-for={`tooltip-${subRoute.name}`}>
                      {subRoute.icon}
                    </div>
                    <ReactTooltip
                    className="tooltip908"
                      id={`tooltip-${subRoute.name}`}
                      effect="solid"
                      place="right"
                      delayHide={100}
                    />
                    <div className="subname121">
                      {subRoute.name}
                      {loggedInEmployee && loggedInEmployee.fullname && (
                        <span>{loggedInEmployee.fullname[0].toUpperCase()}</span>
                      )}
                    </div>
                  </NavLink>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SidebarMenu;
