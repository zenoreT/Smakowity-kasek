import "./OrderTable.css";

import { ColumnProps } from "antd/lib/table";
import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

import { OrderItem } from "../../utils/models/OrderItem";
import { HistoryItem } from "../../utils/models/HistoryItem";
import { TableRequest } from "../../utils/models/TableRequest";
import { OrderStatus } from "../../utils/models/OrderStatus";
import { UserDetails } from "../../utils/models/UserDetails";
import { TableView } from "../TableView/TableView";
import { isOnSite, parseDate } from "../../utils/Utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  userDetails?: UserDetails;
  data: HistoryItem[];
  count: number;
  loading: boolean;
  pageSize: number;
  pageSizeOptions: string[];
  sortField: string;
  actionsColumn: ColumnProps<HistoryItem>;
  statusFilters?: any[];
  additionalFilters?: Record<string, string[]>;
  fetchOrderHistory: (historyRequest: TableRequest) => void;
}

export const OrderTable = (props: Props) => {
  const columns: ColumnProps<HistoryItem>[] = [
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      sorter: true,
      render: (orderStatus: any) => <span>{Object.entries(OrderStatus).find(e => e[0] === orderStatus)![1]}</span>,
      filters: props.statusFilters,
      filteredValue: props.additionalFilters ? props.additionalFilters.orderStatus : [],
    },
    {
      title: "Adres dostawy",
      dataIndex: "address",
      sorter: true,
      render: (address: any) => <span>{isOnSite(address) ? address.city : `${address.city} ${address.postCode} ul.${address.street}`}</span>,
    },
    {
      title: "Numer telefonu",
      dataIndex: "phoneNumber",
      sorter: true,
      render: (phoneNumber: any) => <span>{phoneNumber}</span>,
    },
    {
      title: "Data przyjęcia",
      dataIndex: "createdAt",
      sorter: true,
      render: (createdAt: any) => <span>{parseDate(createdAt)}</span>,
    },
    {
      title: "Data aktualizacji",
      dataIndex: "updatedAt",
      sorter: true,
      defaultSortOrder: "descend",
      render: (updatedAt: any) => <span>{parseDate(updatedAt)}</span>,
    },
    {
      title: "Przedmioty",
      dataIndex: "orderItems",
      sorter: false,
      render: (orderItems: OrderItem[]) => {
        const items: ReactNode[] = [];
        orderItems.forEach((orderItem: OrderItem, i: number) => {
          items.push(
            <span key={i}>
              <Link to={`/menu/item/${orderItem.item.id}`}>{orderItem.item.name}</Link> x {orderItem.quantity}
            </span>
          );
        });
        return <span className="order-items">{items}</span>;
      },
      width: "20%",
    },
    {
      title: "Cena",
      dataIndex: "totalPrice",
      sorter: true,
      width: 100,
      render: (totalPrice: number) => (
        <span style={{ textAlign: "right" }}>
          <b>{totalPrice}</b> zł
        </span>
      ),
    },
    props.actionsColumn,
  ];

  return (
    <div className={props.className}>
      <TableView
        className="order-table"
        count={props.count}
        data={props.data}
        loading={props.loading}
        columns={columns}
        pageSize={props.pageSize}
        pageSizeOptions={props.pageSizeOptions}
        sortField={props.sortField}
        additionalFilters={props.additionalFilters}
        fetchData={props.fetchOrderHistory}
      />
    </div>
  );
};
