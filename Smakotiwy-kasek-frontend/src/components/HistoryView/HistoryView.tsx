import "./HistoryView.css";

import { Icon, Tooltip, PageHeader } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";

import { OrderItem } from "../../utils/models/OrderItem";
import { HistoryItem } from "../../utils/models/HistoryItem";
import { TableRequest } from "../../utils/models/TableRequest";
import { UserDetails } from "../../utils/models/UserDetails";
import { OrderTable } from "../OrderTable/OrderTable";
import { FetchType } from "../../utils/models/FetchType";
import { OrderStatus } from "../../utils/models/OrderStatus";

interface Props {
  userDetails?: UserDetails;
  data: HistoryItem[];
  count: number;
  loading: boolean;
  fetchOrderHistory: (historyRequest: TableRequest) => void;
  addItemsToCart: (...items: OrderItem[]) => void;
}

export const HistoryView = (props: Props) => {
  const statusFilters: any[] = [];
  Object.entries(OrderStatus).forEach(e => statusFilters.push({ text: e[1], value: e[0] }));

  const actionsColumn: ColumnProps<HistoryItem> = {
    title: "Akcje",
    render: (text: any, record: HistoryItem) => (
      <span>
        <Tooltip title="Dodaj do zamówienia">
          <Icon
            type="plus-square"
            theme="twoTone"
            onClick={() =>
              props.addItemsToCart(
                ...record.orderItems.map(orderItem => {
                  return { item: orderItem.item, quantity: orderItem.quantity };
                })
              )
            }
            className="action-icon"
          />
        </Tooltip>
      </span>
    ),
    sorter: false,
  };

  return (
    <div>
      <PageHeader
        onBack={() => window.history.back()}
        title="Twoje zamówienia"
        subTitle="Znajdują się tutaj wszystkie twoje zamówienia. Zarówno aktualne jak i te starsze."
      />
      <OrderTable
        className="history-table"
        count={props.count}
        data={props.data}
        loading={props.loading}
        actionsColumn={actionsColumn}
        pageSize={10}
        pageSizeOptions={["10", "20", "30", "40"]}
        sortField="updatedAt"
        statusFilters={statusFilters}
        additionalFilters={{ fetchType: [FetchType.ONLY_USERS.toString()] }}
        fetchOrderHistory={props.fetchOrderHistory}
      />
    </div>
  );
};
