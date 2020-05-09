import { ACCESS_TOKEN, API_BASE_URL } from "./Consts";
import { TableRequest } from "./models/TableRequest";

const request = async (options: any) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append("Authorization", "Bearer " + localStorage.getItem(ACCESS_TOKEN));
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  const response = await fetch(options.url, options);
  const json = await response.json();
  if (!response.ok) {
    return Promise.reject(json);
  }
  return json;
};

export function authenticate(token: string) {
  return request({
    url: API_BASE_URL + `/auth/authenticate?token=${token}`,
    method: "POST",
  });
}

export function login(loginRequest: any) {
  return request({
    url: API_BASE_URL + "/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function register(signupRequest: any) {
  return request({
    url: API_BASE_URL + "/auth/register",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}

export function updateUser(user: any) {
  return request({
    url: API_BASE_URL + "/employee/update",
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function fetchMenuItems() {
  return request({
    url: API_BASE_URL + "/menu/meal/get/all",
    method: "GET",
  });
}

export function getItems(values: any, itemType: string) {
  return request({
    url: API_BASE_URL + `/menu/${itemType}/search`,
    method: "POST",
    body: JSON.stringify(values),
  });
}

export function createNewItem(values: any, itemType: string) {
  return request({
    url: API_BASE_URL + `/menu/${itemType}/new`,
    method: "POST",
    body: JSON.stringify(values),
  });
}

export function deleteItem(item: any, itemType: string) {
  return request({
    url: API_BASE_URL + `/menu/${itemType}/delete`,
    method: "DELETE",
    body: JSON.stringify(item),
  });
}

export function deleteItemsImage(imageName: string) {
  return request({
    url: API_BASE_URL + `/menu/images/delete?imageName=${imageName}`,
    method: "DELETE",
  });
}

export function orderCartItems(values: any) {
  return request({
    url: API_BASE_URL + "/order/new",
    method: "POST",
    body: JSON.stringify(values),
  });
}

export function getOrderHistory(tableRequest: TableRequest) {
  return request({
    url: API_BASE_URL + "/order/history",
    method: "POST",
    body: JSON.stringify(tableRequest),
  });
}

export function getEmployeeList(tableRequest: TableRequest) {
  return request({
    url: API_BASE_URL + "/employee/list",
    method: "POST",
    body: JSON.stringify(tableRequest),
  });
}

export function getMealList(tableRequest: TableRequest) {
  return request({
    url: API_BASE_URL + "/menu/meal/list",
    method: "POST",
    body: JSON.stringify(tableRequest),
  });
}

export function getMealByName(name: { searchText: string }) {
  return request({
    url: API_BASE_URL + "/menu/meal/get",
    method: "POST",
    body: JSON.stringify(name),
  });
}

export function getIngredientList(tableRequest: TableRequest) {
  return request({
    url: API_BASE_URL + "/menu/ingredient/list",
    method: "POST",
    body: JSON.stringify(tableRequest),
  });
}
