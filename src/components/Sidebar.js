
import React, { useState,useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarData } from "./SidebarData";
import Submen1 from "./Submenu";
import { IconContext } from "react-icons/lib";
import { FaSun, FaMoon, FaUser } from "react-icons/fa";
import "./Sidebar.css";



const Nav = styled.div`
background: rgb(0, 7, 61);
  position: fixed;
  margin-right: -365px;
  margin-bottom: 26%;
  width: 100%;
  color: #fff;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s, color 0.3s;
 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const NavIcon = styled(Link)`
  padding-left: 2rem;
  font-size: 2rem;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #fff;
`;

const ProfileIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 20px;
  cursor: pointer;
`;

const ProfileBox = styled.div`
  position: absolute;
  top: 30px;
  right: 19px;
  background: rgb(0, 7,61);
  width:max-content;
  block-size:max-content;
  color:white;
  padding: 10px;
  border: 1px solid white;
  z-index: 999;
  border-radius: 5px;
  display: ${({ showProfileBox }) => (showProfileBox ? "block" : "none")}
  
  

`;

const SidebarNav = styled.nav`
  background: rgb(0, 7, 61) ;
  color: #fff;
  width: 220px;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  margin-left:0px;
  position: fixed;
  top: fixed;
  left: ${({ sidebar }) => (sidebar ? "0" : "-247px")};
  transition: left 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
  overflow-y: auto;
  background: rgb(0, 7, 61);
  color: #fff;
`;

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);

  const [loggedInEmployee, setLoggedInEmployee] = useState(null);
  const navigate = useNavigate(); // Accessing the useNavigate hook

  useEffect(() => {
    // Load employee details from localStorage when component mounts
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      setLoggedInEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  const handleLogout = () => {
    // Clear the stored employee details from state and localStorage on logout
    setLoggedInEmployee(null);
    localStorage.removeItem('loggedInEmployee');
    // Perform logout logic if needed
    console.log("Logout ");
    // Redirect to the homepage
    navigate('/');
  };

  const showSidebar = () => setSidebar(!sidebar);

  const toggleProfileBox = () => {
    setShowProfileBox(!showProfileBox);
  };

  return (
    <>
    
      <IconContext.Provider  value={{ color: "#fff" }}>
        <Nav>
          <NavIcon to="#">
            <FaIcons.FaBars onClick={showSidebar} style={{ color: "white" }} />
          </NavIcon>
          <h1 style={{ color: "white" }}>Matrical</h1>
          <div className="mode size65" style={{ position: "relative" }}>
            {/* Profile Icon */}
            <ProfileIcon className="ProfileIcon" onClick={toggleProfileBox}>
              <FaUser />
            </ProfileIcon>
            {/* Profile Box */}
            <ProfileBox className={`ProfileBox ${showProfileBox ? "active" : ""}`} showProfileBox={showProfileBox}>
             
              {loggedInEmployee && (
          <div className="space2314">
            <span className="color4532">{loggedInEmployee.fullname}</span>
            <p className="change12341"><p className="label907">ADM ID</p><span className="color009">:</span> &nbsp;&nbsp;<span className="color453">{loggedInEmployee.employeeid}</span></p>
            <p className="change12341"><p className="label907">ADM Email</p><span className="color009">:</span> &nbsp;&nbsp;<span className="color453">{loggedInEmployee.email}</span></p>

            <div className="center4353">
            <button className="btn3241" onClick={ handleLogout } style={{backgroundColor:"rgb(0, 7, 61)" , color:"white"}}>Logout</button>
            </div>
          </div>
        )}
             
              {/* <button onClick={handleLogout}  className="customButton">
      Logout
    </button> */}
            </ProfileBox>
          </div>
        </Nav>
        <SidebarNav sidebar={sidebar} >
          <SidebarWrap >
          <NavIcon to="#" className="flex2315">
  <img className="bar45"  />
  <AiIcons.AiOutlineClose onClick={showSidebar} className="iconchange12342" />
</NavIcon>

            {SidebarData.map((item, index) => {
              return <Submen1 item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;