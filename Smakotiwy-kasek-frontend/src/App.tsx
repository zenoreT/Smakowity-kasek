import "./App.css";

import { CompatClient, IMessage, Stomp } from "@stomp/stompjs";
import { ConfigProvider, Drawer, Layout, notification, Button } from "antd";
import pl_Pl from "antd/lib/locale-provider/pl_PL";
import React, { Component } from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router";
import { NavLink } from "react-router-dom";
import SockJS from "sockjs-client";

import CartView from "./components/CartView/CartView";
import { EmployeeView } from "./components/EmployeeView/EmployeeView";
import { EmployeesTable } from "./components/EmplyeesTable/EmployeesTable";
import { HistoryView } from "./components/HistoryView/HistoryView";
import { IngredientsTable } from "./components/IngredientsTable/IngredientsTable";
import { ItemView } from "./components/ItemView/ItemView";
import Login from "./components/Login/Login";
import MealForm from "./components/MealForm/MealForm";
import { MealsTable } from "./components/MealsTable/MealsTable";
import MenuView from "./components/MenuView/MenuView";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute/PublicRoute";
import Register from "./components/Register/Register";
import TopsideMenu from "./components/TopsideMenu/TopsideMenu";
import {
  ACCESS_TOKEN,
  CART,
  CART_SUCCESS,
  HISTORY_ERROR,
  LOGIN_ERROR,
  LOGIN_ERROR_INCORRECT,
  LOGIN_SUCCESS,
  LOGOUT_ERROR,
  LOGOUT_SUCCESS,
  MEAL_DELETED_ERROR,
  MEAL_ERROR,
  MENU_ERROR,
  SOCKET_BASE_URL,
  MEAL_SUCCESS,
  USER_SUCCESS,
} from "./utils/Consts";
import { Category } from "./utils/models/Category";
import { HistoryItem } from "./utils/models/HistoryItem";
import { ItemType } from "./utils/models/ItemType";
import { OrderItem } from "./utils/models/OrderItem";
import { OrderStatus } from "./utils/models/OrderStatus";
import { Role } from "./utils/models/Role";
import { TableRequest } from "./utils/models/TableRequest";
import { UserDetails } from "./utils/models/UserDetails";
import {
  authenticate,
  createNewItem,
  deleteItem,
  fetchMenuItems,
  getEmployeeList,
  getIngredientList,
  getMealByName,
  getMealList,
  getOrderHistory,
  login,
  orderCartItems,
  register,
  updateUser,
} from "./utils/ServerApi";
import { getEnumKeyFromValue, mapRoleToOrderStatuses, isAuthenticated } from "./utils/Utils";
import MenuCategoriesView from "./components/MenuCategoriesView/MenuCategoriesView";
import { IndexView } from "./components/IndexView/IndexView";

interface Props extends RouteComponentProps<any> {}

interface State {
  userInfo?: UserDetails;
  loading: boolean;
  menuItems: any[];
  orderItems: OrderItem[];
  historyItems: HistoryItem[];
  historyCount: number;
  userOrderItems: HistoryItem[];
  userOrderCount: number;
  userList: any[];
  userCount: number;
  mealList: any[];
  mealCount: number;
  ingredientList: any[];
  ingredientCount: number;
  socketClient?: CompatClient;
  drawerVisible: boolean;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      menuItems: [],
      orderItems: [],
      historyItems: [],
      historyCount: 0,
      userOrderItems: [],
      userOrderCount: 0,
      userList: [],
      userCount: 0,
      mealList: [],
      mealCount: 0,
      ingredientList: [],
      ingredientCount: 0,
      drawerVisible: false,
    };
  }

  componentWillMount = () => {
    notification.config({
      placement: "bottomRight",
    });
    this.handleAuthentication();
    this.fetchMenuItems();
  };

  componentDidMount() {
    this.connectToSocket();
  }

  componentDidUpdate = () => {
    this.saveCartInStorage();
  };

  connectToSocket = () => {
    this.setState({
      loading: true,
    });
    const socket = new SockJS(SOCKET_BASE_URL);
    const client = Stomp.over(socket);
    client.debug = () => null;
    this.setState({ socketClient: client });
    client.connect({ Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}` }, () => {
      this.setState({ loading: false });
      client.subscribe("/socket/order/history", (data: IMessage) => {
        data.ack();
        const newItem: HistoryItem = JSON.parse(data.body);
        // append to my history items so i can see live updates
        if (this.state.userInfo && newItem.ownerUserName && this.state.userInfo.username === newItem.ownerUserName) {
          const currentItem = this.state.historyItems.find(item => item.id === newItem.id);
          if (currentItem) {
            this.setState({ historyItems: [newItem, ...this.state.historyItems.filter(item => item.id !== newItem.id)] });
          } else {
            this.setState({ historyItems: [newItem, ...this.state.historyItems], historyCount: this.state.historyCount + 1 });
          }
        }
        // append to userOrderItems visible in EmployeeView
        const currentItem = this.state.userOrderItems.find(item => item.id === newItem.id);
        if (currentItem) {
          this.setState({ userOrderItems: [newItem, ...this.state.userOrderItems.filter(item => item.id !== newItem.id)] });
        } else {
          this.setState({ userOrderItems: [newItem, ...this.state.userOrderItems], userOrderCount: this.state.userOrderCount + 1 });
        }
      });
    });
  };

  private handleAuthentication = () => {
    this.setState({
      loading: true,
    });
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      const response = authenticate(token);
      response
        .then(data => {
          localStorage.setItem(ACCESS_TOKEN, data.accessToken);
          this.setState({
            userInfo: new UserDetails(data.username, data.roles),
            loading: false,
          });
        })
        .catch(error => {
          this.setState({
            userInfo: new UserDetails(undefined, []),
            loading: false,
          });
          notification.error({ message: LOGIN_ERROR });
        });
    } else {
      this.setState({
        userInfo: new UserDetails(undefined, []),
      });
    }
  };

  private handleLogin = (values: any) => {
    this.setState({
      loading: true,
    });
    const response = login(Object.assign({}, values));
    response
      .then(data => {
        localStorage.setItem(ACCESS_TOKEN, data.accessToken);
        notification.success({ message: LOGIN_SUCCESS });
        if (this.state.socketClient && !this.state.socketClient.connected) {
          this.connectToSocket();
        }
        this.setState({
          userInfo: new UserDetails(data.username, data.roles),
          loading: false,
        });
      })
      .catch(error => {
        this.setState({
          userInfo: new UserDetails(undefined, []),
          loading: false,
        });
        if (error.status === 401) {
          notification.error({ message: LOGIN_ERROR_INCORRECT });
        } else {
          notification.error({ message: LOGIN_ERROR });
        }
      });
  };

  private handleLogout = () => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
      localStorage.removeItem(ACCESS_TOKEN);
      if (this.state.socketClient) {
        this.state.socketClient.disconnect();
      }
      this.setState({
        userInfo: new UserDetails(undefined, []),
      });
      notification.success({ message: LOGOUT_SUCCESS });
    } else {
      notification.error({ message: LOGOUT_ERROR });
    }
  };

  private handleRegister = (values: any, newUser = true) => {
    this.setState({
      loading: true,
    });
    const response = newUser ? register(Object.assign({}, values)) : updateUser(Object.assign({}, values));
    response
      .then(data => {
        const userList = this.state.userList.filter(employee => employee.id !== data.id);
        userList.push(data);
        this.setState({
          userList: userList,
          loading: false,
        });
        if (newUser && !isAuthenticated(this.state.userInfo, [Role.ADMIN])) {
          this.props.history.push("/login");
        } 
        this.fetchEmployeeList({ results: 20, page: 1, sortField: "username" });
        notification.success({ message: USER_SUCCESS });
      })
      .catch(error => {
        notification.error({ message: error.title });
        this.setState({
          loading: false,
        });
      });
  };

  fetchMenuItems = () => {
    this.setState({
      loading: true,
    });
    const response = fetchMenuItems();
    response
      .then(data => {
        const orderItemsJson = localStorage.getItem(CART);
        const orderItems: OrderItem[] = orderItemsJson ? JSON.parse(orderItemsJson) : [];
        const retrievedOrderItems = orderItems.map(orderItem => {
          const foundItem = data.find((item: any) => item.id === orderItem.item.id);

          return {
            item: foundItem,
            quantity: orderItem.quantity,
          };
        });

        this.setState({
          loading: false,
          menuItems: data,
          orderItems: retrievedOrderItems,
        });
      })
      .catch(error => {
        notification.error({ message: MENU_ERROR });
      });
  };

  getMealByName = (name: string) => {
    this.setState({
      loading: true,
    });
    const response = getMealByName({ searchText: name });
    response
      .then(data => {
        this.setState({
          menuItems: data,
          loading: false,
        });
      })
      .catch(error => {
        notification.error({ message: MENU_ERROR });
      });
  };

  handleCreationOfMeal = (values: any, itemType: string) => {
    this.setState({
      loading: true,
    });
    const response = createNewItem(Object.assign({}, values), itemType);
    response
      .then(data => {
        if (ItemType.Meal === Object.entries(ItemType).find(e => e[0].toLowerCase() === itemType)![1]) {
          const mealList = this.state.mealList.filter(meal => meal.id !== data.id);
          mealList.push(data);
          this.setState({
            mealList: mealList,
            loading: false,
          });
        } else if (ItemType.Ingredient === Object.entries(ItemType).find(e => e[0].toLowerCase() === itemType)![1]) {
          const ingredientList = this.state.ingredientList.filter(ingredient => ingredient.id !== data.id);
          ingredientList.push(data);
          this.setState({
            ingredientList: ingredientList,
            loading: false,
          });
        }

        notification.success({ message: MEAL_SUCCESS });
        this.setState({
          loading: false,
        });
        this.fetchMenuItems();
      })
      .catch(() => {
        notification.error({ message: MEAL_ERROR });
        this.setState({
          loading: false,
        });
      });
  };

  removeMenuItem = (item: any, itemType: string) => {
    const response = deleteItem(Object.assign({}, item), itemType);
    response
      .then(data => {
        notification.success({ message: data.title });
        this.fetchMenuItems();
      })
      .catch(() => {
        notification.error({ message: MEAL_DELETED_ERROR });
      });
  };

  saveCartInStorage = () => {
    const orderItems = this.state.orderItems;
    if (orderItems.length > 0) {
      localStorage.setItem(
        CART,
        JSON.stringify(
          orderItems.map(orderItem => {
            return {
              item: {
                id: orderItem.item.id,
              },
              quantity: orderItem.quantity,
            };
          })
        )
      );
    }
  };

  addItemsToCart = (...items: OrderItem[]) => {
    this.setState({
      loading: true,
    });
    const oldOrderItems = this.state.orderItems;

    items.forEach(orderItem => {
      const oldOrderItem = oldOrderItems.find(oldOrderItem => oldOrderItem.item.id === orderItem.item.id);

      if (oldOrderItem) {
        oldOrderItem.quantity += orderItem.quantity;
      } else {
        oldOrderItems.push({
          item: orderItem.item,
          quantity: orderItem.quantity,
        });
      }
    });

    notification.success({ message: CART_SUCCESS });

    this.setState({
      loading: false,
      orderItems: oldOrderItems,
    });
  };

  handleQuantityChange = (item: OrderItem, quantity: number | undefined) => {
    const foundItem = this.state.orderItems.find(orderItem => orderItem.item === item);
    if (foundItem && quantity) {
      foundItem.quantity = quantity;
    }
    //force state to update
    this.setState({
      orderItems: this.state.orderItems,
    });
  };

  removeOrderItem = (item: OrderItem) => {
    const remainders = this.state.orderItems.filter(orderItem => orderItem.item !== item);

    this.setState({
      orderItems: remainders,
    });
  };

  handleOrder = (values: any, newOrder = true) => {
    this.setState({
      loading: true,
    });

    if (newOrder) {
      values.orderItems = this.state.orderItems;
    }

    const response = orderCartItems(values);
    response
      .then(data => {
        notification.success({ message: data.title });

        localStorage.removeItem(CART);
        this.setState({
          orderItems: [],
          loading: false,
        });
      })
      .catch(error => {
        notification.error({ message: error.title });

        this.setState({
          loading: false,
        });
      });
  };

  fetchOrderHistory = (historyRequest: TableRequest) => {
    this.setState({
      loading: true,
    });

    const response = getOrderHistory(historyRequest);
    response
      .then(data => {
        this.setState({
          loading: false,
          historyItems: data.orders,
          historyCount: data.count,
        });
      })
      .catch(() => {
        notification.error({ message: HISTORY_ERROR });
      });
  };

  fetchUserOrders = (historyRequest: TableRequest) => {
    this.setState({
      loading: true,
    });

    const response = getOrderHistory(historyRequest);
    response
      .then(data => {
        this.setState({
          loading: false,
          userOrderItems: data.orders,
          userOrderCount: data.count,
        });
      })
      .catch(() => {
        notification.error({ message: HISTORY_ERROR });
      });
  };

  changeOrderStatus = (order: HistoryItem, orderStatus: OrderStatus) => {
    order.orderStatus = getEnumKeyFromValue(OrderStatus, orderStatus);
    this.handleOrder(order, false);
  };

  fetchEmployeeList = (tableRequest: TableRequest) => {
    this.setState({
      loading: true,
    });

    const response = getEmployeeList(tableRequest);
    response
      .then(data => {
        this.setState({
          loading: false,
          userList: data.employees,
          userCount: data.count,
        });
      })
      .catch(() => {
        notification.error({ message: HISTORY_ERROR });
      });
  };

  fetchMealList = (tableRequest: TableRequest) => {
    this.setState({
      loading: true,
    });

    const response = getMealList(tableRequest);
    response
      .then(data => {
        this.setState({
          loading: false,
          mealList: data.meals,
          mealCount: data.count,
        });
      })
      .catch(() => {
        notification.error({ message: HISTORY_ERROR });
      });
  };

  fetchIngredientList = (tableRequest: TableRequest) => {
    this.setState({
      loading: true,
    });

    const response = getIngredientList(tableRequest);
    response
      .then(data => {
        this.setState({
          loading: false,
          ingredientList: data.ingredients,
          ingredientCount: data.count,
        });
      })
      .catch(() => {
        notification.error({ message: HISTORY_ERROR });
      });
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  closeDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  render() {
    const { Sider } = Layout;

    return (
      <ConfigProvider locale={pl_Pl}>
        <div className="main-content-wrapper">
          <div className="main-content">
            <Drawer
              title={
                <NavLink to="/" onClick={() => this.closeDrawer()} exact>
                  <div className="logo-image" />
                </NavLink>
              }
              placement="left"
              closable={false}
              onClose={this.closeDrawer}
              visible={this.state.drawerVisible}
            >
              <TopsideMenu
                userDetails={this.state.userInfo}
                orderItemsCount={this.state.orderItems.length}
                handleLogout={this.handleLogout}
                closeDrawer={this.closeDrawer}
              />
            </Drawer>
            <Sider className="menu-sider">
              <NavLink to="/" exact>
                <div className="logo-image" />
              </NavLink>
              <TopsideMenu
                userDetails={this.state.userInfo}
                orderItemsCount={this.state.orderItems.length}
                handleLogout={this.handleLogout}
                closeDrawer={this.closeDrawer}
              />
            </Sider>
            <div className="content">
              <div className="toggle-drawer-buton" onClick={this.showDrawer}>
                <Button type="primary" icon="menu"></Button>
              </div>
              <Switch>
                <Route path="/" render={() => <IndexView />} exact />
                <Route path="/menu" render={() => <MenuCategoriesView />} exact />
                <Route
                  path="/menu/:category"
                  render={(props: RouteComponentProps) => {
                    const category = Object.entries(Category).find(e => e[0].toLowerCase() === (props.match.params as any).category);
                    const categoryKey = category![0];
                    return (
                      <MenuView
                        userDetails={this.state.userInfo}
                        data={this.state.menuItems.filter(item => categoryKey.toString() === "ALL" || item.category === categoryKey)}
                        category={category![1]}
                        loading={this.state.loading}
                        getMealByName={this.getMealByName}
                        fetchMenuItems={this.fetchMenuItems}
                      />
                    );
                  }}
                  exact
                />
                <Route
                  path="/menu/item/:id"
                  render={(props: RouteComponentProps) => (
                    <ItemView
                      item={this.state.menuItems.find(item => item.id === Number((props.match.params as any).id))}
                      loading={this.state.loading}
                      userDetails={this.state.userInfo}
                      addToCart={this.addItemsToCart}
                      fetchMenuItems={this.fetchMenuItems}
                    />
                  )}
                  exact
                />
                <ProtectedRoute
                  path="/admin/meal/list"
                  render={() => (
                    <MealsTable
                      data={this.state.mealList}
                      count={this.state.mealCount}
                      loading={this.state.loading}
                      pageSize={20}
                      pageSizeOptions={["20", "40", "60", "80"]}
                      sortField={"name"}
                      fetchMeals={this.fetchMealList}
                      delteMeal={this.removeMenuItem}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                  exact
                />
                <ProtectedRoute
                  path="/admin/meal/new"
                  render={() => <MealForm item={{}} loading={this.state.loading} handleSubmit={this.handleCreationOfMeal} fetchData={this.fetchMealList} />}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                  exact
                />
                <ProtectedRoute
                  path="/admin/meal/:id"
                  render={(props: RouteComponentProps) => (
                    <MealForm
                      item={this.state.mealList.find(item => item.id === Number((props.match.params as any).id))}
                      loading={this.state.loading}
                      handleSubmit={this.handleCreationOfMeal}
                      fetchData={this.fetchMealList}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                  exact
                />
                <ProtectedRoute
                  path="/admin/ingredient/list"
                  render={() => (
                    <IngredientsTable
                      data={this.state.ingredientList}
                      count={this.state.ingredientCount}
                      loading={this.state.loading}
                      pageSize={20}
                      pageSizeOptions={["20", "40", "60", "80"]}
                      sortField={"name"}
                      fetchIngredients={this.fetchIngredientList}
                      delteIngredient={this.removeMenuItem}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                  exact
                />
                <ProtectedRoute
                  path="/admin/ingredient/new"
                  render={() => (
                    <MealForm
                      itemType={ItemType.Ingredient}
                      item={{}}
                      loading={this.state.loading}
                      handleSubmit={this.handleCreationOfMeal}
                      fetchData={this.fetchMenuItems}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                  exact
                />
                <ProtectedRoute
                  path="/admin/ingredient/:id"
                  render={(props: RouteComponentProps) => (
                    <MealForm
                      itemType={ItemType.Ingredient}
                      item={this.state.ingredientList.find(item => item.id === Number((props.match.params as any).id))}
                      loading={this.state.loading}
                      handleSubmit={this.handleCreationOfMeal}
                      fetchData={this.fetchIngredientList}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                  exact
                />
                <ProtectedRoute
                  path="/orders"
                  render={() => (
                    <HistoryView
                      userDetails={this.state.userInfo}
                      data={this.state.historyItems}
                      count={this.state.historyCount}
                      loading={this.state.loading}
                      fetchOrderHistory={this.fetchOrderHistory}
                      addItemsToCart={this.addItemsToCart}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.USER]}
                />
                <ProtectedRoute
                  path="/employee/orders"
                  render={() => (
                    <EmployeeView
                      userDetails={this.state.userInfo}
                      data={this.state.userOrderItems.filter(item =>
                        mapRoleToOrderStatuses(this.state.userInfo ? this.state.userInfo.roles : [])
                          .map(status => getEnumKeyFromValue(OrderStatus, status))
                          .includes(item.orderStatus)
                      )}
                      count={this.state.userOrderCount}
                      loading={this.state.loading}
                      fetchOrderHistory={this.fetchUserOrders}
                      changeOrderStatus={this.changeOrderStatus}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN, Role.COOK, Role.DRIVER, Role.PACKAGER]}
                />
                <ProtectedRoute
                  path="/admin/employee/list"
                  render={() => (
                    <EmployeesTable
                      data={this.state.userList}
                      count={this.state.userCount}
                      loading={this.state.loading}
                      pageSize={20}
                      pageSizeOptions={["20", "40", "60", "80"]}
                      sortField={"username"}
                      fetchEmployees={this.fetchEmployeeList}
                    ></EmployeesTable>
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                />
                <ProtectedRoute
                  path="/admin/employee/new"
                  render={() => (
                    <Register
                      user={{ address: {}, roles: [] }}
                      handleRegister={this.handleRegister}
                      loading={this.state.loading}
                      justUser={false}
                      header={"Tworzenie nowego konta"}
                      footer={"Utwórz"}
                      fetchEmployees={this.fetchEmployeeList}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.ADMIN]}
                  exact
                />
                <ProtectedRoute
                  path="/admin/employee/:id"
                  render={(props: RouteComponentProps) => (
                    <Register
                      user={this.state.userList.find(user => user.id === Number((props.match.params as any).id))}
                      handleRegister={this.handleRegister}
                      loading={this.state.loading}
                      justUser={false}
                      header={"Edycja istniejącego konta"}
                      footer={"Zapisz"}
                      fetchEmployees={this.fetchEmployeeList}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  exact
                />
                <ProtectedRoute
                  path="/cart"
                  render={() => (
                    <CartView
                      userDetails={this.state.userInfo}
                      data={this.state.orderItems}
                      loading={this.state.loading}
                      handleQuantityChange={this.handleQuantityChange}
                      removeOrderItem={this.removeOrderItem}
                      handleOrder={this.handleOrder}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                  requiredRoles={[Role.USER]}
                />
                <PublicRoute
                  path="/login"
                  render={() => <Login handleLogin={this.handleLogin} loading={this.state.loading} />}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                />
                <PublicRoute
                  path="/register"
                  render={() => (
                    <Register
                      user={{ address: {} }}
                      handleRegister={this.handleRegister}
                      loading={this.state.loading}
                      justUser={true}
                      header={"Rejestracja"}
                      footer={"Zarejestruj"}
                    />
                  )}
                  redirectUrl="/"
                  userDetails={this.state.userInfo}
                />
                <Route render={() => <IndexView />} />
              </Switch>
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  }
}

export default withRouter(App);
