import "./EmployeeView.css";

import { Icon, Tooltip, PageHeader } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";

import { HistoryItem } from "../../utils/models/HistoryItem";
import { TableRequest } from "../../utils/models/TableRequest";
import { OrderStatus } from "../../utils/models/OrderStatus";
import { UserDetails } from "../../utils/models/UserDetails";
import { OrderTable } from "../OrderTable/OrderTable";
import { getEnumKeyFromValue, mapRoleToOrderStatuses, getNextOrderStatus } from "../../utils/Utils";
import { FetchType } from "../../utils/models/FetchType";

interface Props {
  userDetails?: UserDetails;
  data: HistoryItem[];
  count: number;
  loading: boolean;
  fetchOrderHistory: (historyRequest: TableRequest) => void;
  changeOrderStatus: (orderItem: HistoryItem, orderStatus: OrderStatus) => void;
}

export const EmployeeView = (props: Props) => {
  const actionsColumn: ColumnProps<HistoryItem> = {
    title: "Akcje",
    render: (text: any, orderItem: HistoryItem) => <span>{getUpdateStatusButton(orderItem, getNextOrderStatus(orderItem))}</span>,
    sorter: false,
  };

  const getUpdateStatusButton = (orderItem: HistoryItem, newStatus: OrderStatus) => {
    return Object.entries(OrderStatus).find(e => e[0] === orderItem.orderStatus)![1] !== OrderStatus.FINISHED ? (
      <span>
        <Tooltip
          title={
            <div>
              <div>{`Zakończ status: ${
                Object.entries(OrderStatus)
                  .filter(e => e[0] === orderItem.orderStatus)
                  .map(e => e[1])[0]
              },`}</div>
              <div>{`następne zadanie: ${newStatus}`}</div>
            </div>
          }
        >
          <Icon type="check-circle" theme="twoTone" onClick={() => props.changeOrderStatus(orderItem, newStatus)} className="action-icon" />
        </Tooltip>
      </span>
    ) : null;
  };

  const defaultFilters = props.userDetails ? mapRoleToOrderStatuses(props.userDetails.roles).map(status => getEnumKeyFromValue(OrderStatus, status)) : [];

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title="Zamówienia klientów" />
      <OrderTable
        className="employee-orders-table"
        count={props.count}
        data={props.data}
        loading={props.loading}
        actionsColumn={actionsColumn}
        pageSize={50}
        pageSizeOptions={["50", "100", "200", "500"]}
        sortField={"createdAt"}
        additionalFilters={{ fetchType: [FetchType.ALL_VALUES], orderStatus: defaultFilters }}
        fetchOrderHistory={props.fetchOrderHistory}
      />
    </div>
  );
};
