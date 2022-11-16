import React from "react";
import { Nav, NavLink, NavMenu } 
    from "./NavbarElements";
  
const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/family-tree" activestyle="true">
            Family Tree
          </NavLink>
          <NavLink to="/people" activestyle="true">
            People
          </NavLink>
          <NavLink to="/pictures" activestyle="true">
            Pictures
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};
  
export default Navbar;