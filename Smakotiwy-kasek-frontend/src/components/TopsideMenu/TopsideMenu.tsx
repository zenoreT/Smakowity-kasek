import "./TopsideMenu.css";

import { Badge, Icon, Menu } from "antd";
import SubMenu from "antd/lib/menu/SubMenu";
import React from "react";
import { MdRestaurantMenu } from "react-icons/md";
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";

import { Role } from "../../utils/models/Role";
import { UserDetails } from "../../utils/models/UserDetails";
import { isAuthenticated } from "../../utils/Utils";

interface Props extends RouteComponentProps<any> {
  userDetails?: UserDetails;
  orderItemsCount: number;
  handleLogout: () => void;
  closeDrawer: () => void;
}

const TopsideMenu = (props: Props) => {
  const logout = isAuthenticated(props.userDetails) ? (
    <Menu.Item className="bottom-item" onClick={props.handleLogout}>
      <Icon type="logout" />
      <span>Wyloguj</span>
    </Menu.Item>
  ) : null;

  const register = !isAuthenticated(props.userDetails) ? (
    <Menu.Item key="/register">
      <NavLink to="/register" exact>
        <Icon type="user-add" />
        <span>Rejestracja</span>
      </NavLink>
    </Menu.Item>
  ) : null;

  const login = !isAuthenticated(props.userDetails) ? (
    <Menu.Item key="/login">
      <NavLink to="/login" exact>
        <Icon type="login" />
        <span>Zaloguj</span>
      </NavLink>
    </Menu.Item>
  ) : null;

  const cart = isAuthenticated(props.userDetails) ? (
    <Menu.Item key="/cart">
      <NavLink to="/cart" exact>
        <Icon type="shopping-cart" />
        <span>
          <Badge count={props.orderItemsCount} className="app-bar-item">
            Koszyk
          </Badge>
        </span>
      </NavLink>
    </Menu.Item>
  ) : null;

  const orders = isAuthenticated(props.userDetails) ? (
    <Menu.Item key="/orders">
      <NavLink to="/orders" exact>
        <Icon type="unordered-list" />
        <span>Zamówienia</span>
      </NavLink>
    </Menu.Item>
  ) : null;

  const employeeOrders = isAuthenticated(props.userDetails, [Role.ADMIN, Role.COOK, Role.DRIVER, Role.PACKAGER]) ? (
    <Menu.Item key="/employee/orders">
      <NavLink to="/employee/orders" exact>
        Zamówienia
      </NavLink>
    </Menu.Item>
  ) : null;

  const employeeMenu = isAuthenticated(props.userDetails, [Role.ADMIN, Role.COOK, Role.DRIVER, Role.PACKAGER]) ? (
    <SubMenu
      key="/employee"
      title={
        <span>
          <Icon type="team" />
          <span>Pracownik</span>
        </span>
      }
    >
      {employeeOrders}
    </SubMenu>
  ) : null;

  const employeeList = isAuthenticated(props.userDetails, [Role.ADMIN]) ? (
    <Menu.Item key="/admin/employee/list">
      <NavLink to="/admin/employee/list" exact>
        Pracownicy
      </NavLink>
    </Menu.Item>
  ) : null;

  const mealsList = isAuthenticated(props.userDetails, [Role.ADMIN]) ? (
    <Menu.Item key="/admin/meal/list">
      <NavLink to="/admin/meal/list" exact>
        Dania
      </NavLink>
    </Menu.Item>
  ) : null;

  const ingredientsList = isAuthenticated(props.userDetails, [Role.ADMIN]) ? (
    <Menu.Item key="/admin/ingredient/list">
      <NavLink to="/admin/ingredient/list" exact>
        Składniki
      </NavLink>
    </Menu.Item>
  ) : null;

  const adminMenu = isAuthenticated(props.userDetails, [Role.ADMIN]) ? (
    <SubMenu
      key="/admin"
      title={
        <span>
          <Icon type="desktop" />
          <span>Admin</span>
        </span>
      }
    >
      {employeeList}
      {mealsList}
      {ingredientsList}
    </SubMenu>
  ) : null;

  const menuItem = (
    <Menu.Item key="/menu">
      <NavLink to="/menu" exact>
        <i className="menu-icon">
          <MdRestaurantMenu />
        </i>
        <span>Menu</span>
      </NavLink>
    </Menu.Item>
  );

  return (
    <Menu
      theme="light"
      mode="inline"
      className="menu"
      defaultSelectedKeys={["/"]}
      defaultOpenKeys={["/" + props.location.pathname.split("/")[1]]}
      selectedKeys={["/" + props.location.pathname.split("/")[1], props.location.pathname]}
      onSelect={() => props.closeDrawer()}
    >
      {cart}
      {orders}
      {menuItem}
      {employeeMenu}
      {adminMenu}
      {logout}
      {register}
      {login}
    </Menu>
  );
};

export default withRouter(TopsideMenu);
