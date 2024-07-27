// Submenu.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

const Submenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <Link to={item.path} className="menu-item" onClick={item.subNav && showSubnav}>
        <div>
          {item.icon}
          <span>{item.title}</span>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null}
        </div>
      </Link>
      {subnav &&
        item.subNav.map((subItem, index) => {
          return (
            <Link to={subItem.path} className="sub-menu-item" key={index}>
              <div>
                {subItem.icon}
                <span>{subItem.title}</span>
              </div>
            </Link>
          );
        })}
    </>
  );
};

export default Submenu;
