import { UserDetails } from "./models/UserDetails";
import { Role } from "./models/Role";
import { OrderStatus } from "./models/OrderStatus";
import { HistoryItem } from "./models/HistoryItem";

export const isAuthenticated = (userDetails?: UserDetails, requiredRoles?: Role[]) => {
  if (!userDetails || !userDetails.username) {
    return false;
  }

  return requiredRoles && userDetails
    ? userDetails.roles.map(role => role.toUpperCase()).some(userRole => requiredRoles.map(role => role.toUpperCase()).indexOf(userRole) !== -1)
    : true;
};

export const getEnumKeyFromValue = (items: any, value: string, toLowerCase = false) => {
  const key: any = Object.entries(items).find(e => e[1] === value)![0];
  return toLowerCase ? key.toLowerCase() : key;
  // let key: any = undefined;
  // for (let item in items) {
  //   if (items[item] === value) {
  //     key = toLowerCase ? item.toLowerCase() : item;
  //   }
  // }
  // return key;
};

export const getEnumValueFromKey = (items: any, key: string, toLowerCase = false) => {
  if (!key) return undefined;
  const value: any = Object.entries(items).find(e => e[0] === key)![1];
  return toLowerCase ? value.toLowerCase() : value;
};

export const createDataObjects = (values: any) => {
  Object.keys(values).forEach(key => {
    const currentObject = values[key];
    if (Array.isArray(currentObject)) {
      const newArray: any[] = [];
      currentObject.forEach((value: any) => {
        newArray.push({ id: value.key, name: value.label });
      });
      values[key] = newArray;
    }
  });
  return values;
};

export const mapRoleToOrderStatuses = (roles: Role[]): OrderStatus[] => {
  const statuses: OrderStatus[] = [];
  roles.forEach(role => {
    switch (role) {
      case Role.COOK:
        statuses.push(OrderStatus.ACCEPTED, OrderStatus.PREPARED);
        break;
      case Role.PACKAGER:
        statuses.push(OrderStatus.PACKING, OrderStatus.PACKAGED, OrderStatus.FORWARDED_TO_DELIVERY, OrderStatus.RECEIVED);
        break;
      case Role.DRIVER:
        statuses.push(OrderStatus.ON_THE_WAY, OrderStatus.RECEIVED);
        break;
      case Role.ADMIN:
        statuses.push(...Object.values(OrderStatus));
        break;
      default:
        break;
    }
  });
  return statuses;
};

export const getNextOrderStatus = (order: HistoryItem): OrderStatus => {
  switch (order.orderStatus) {
    case getEnumKeyFromValue(OrderStatus, OrderStatus.ACCEPTED):
      return OrderStatus.PREPARED;
    case getEnumKeyFromValue(OrderStatus, OrderStatus.PREPARED):
      return OrderStatus.PACKING;
    case getEnumKeyFromValue(OrderStatus, OrderStatus.PACKING):
      return OrderStatus.PACKAGED;
    case getEnumKeyFromValue(OrderStatus, OrderStatus.PACKAGED):
      return isOnSite(order.address) ? OrderStatus.RECEIVED : OrderStatus.FORWARDED_TO_DELIVERY;
    case getEnumKeyFromValue(OrderStatus, OrderStatus.FORWARDED_TO_DELIVERY):
      return OrderStatus.ON_THE_WAY;
    case getEnumKeyFromValue(OrderStatus, OrderStatus.ON_THE_WAY):
      return OrderStatus.RECEIVED;
    case getEnumKeyFromValue(OrderStatus, OrderStatus.RECEIVED):
      return OrderStatus.FINISHED;
    default:
      return OrderStatus.FINISHED;
  }
};

export const isOnSite = (address: any) => {
  return address.city === "Na miejscu";
};

export const parseDate = (date: any) => {
  const testDate = new Date(date * 1000);
  return isFinite(testDate.getTime()) ? testDate.toLocaleString() : new Date(date).toLocaleString();
};
