import "./EmployeesTable.css";

import { Button, PageHeader } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { Link } from "react-router-dom";

import { HistoryItem } from "../../utils/models/HistoryItem";
import { TableRequest } from "../../utils/models/TableRequest";
import { UserDetails } from "../../utils/models/UserDetails";
import { isOnSite } from "../../utils/Utils";
import { TableView } from "../TableView/TableView";
import { Role } from "../../utils/models/Role";

interface Props {
  userDetails?: UserDetails;
  data: any[];
  count: number;
  loading: boolean;
  pageSize: number;
  pageSizeOptions: string[];
  sortField: string;
  fetchEmployees: (tableRequest: TableRequest) => void;
}

export const EmployeesTable = (props: Props) => {
  const roleFilters: any[] = [];
  Object.entries(Role).forEach(e => roleFilters.push({ text: e[1], value: e[0] }));
  const defaultFilters = roleFilters
    .filter(roleFilter => [Role.ADMIN, Role.COOK, Role.DRIVER, Role.PACKAGER].includes(roleFilter.text))
    .map(roleFilter => roleFilter.value);

  const columns: ColumnProps<HistoryItem>[] = [
    {
      title: "Nazwa użytkownika",
      dataIndex: "username",
      sorter: true,
      render: (username: any) => <span>{username}</span>,
    },
    {
      title: "Adres email",
      dataIndex: "email",
      sorter: true,
      render: (email: any) => <span>{email}</span>,
    },
    {
      title: "Adres",
      dataIndex: "address",
      sorter: false,
      render: (address: any) => <span>{isOnSite(address) ? address.city : `${address.city} ${address.postCode} ul.${address.street}`}</span>,
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roleName",
      sorter: false,
      render: (roles: any[]) => <span>{roles.map(role => role.name).join(", ")}</span>,
      filters: roleFilters,
      filteredValue: defaultFilters,
    },
    {
      title: (
        <span>
          <Button type="primary">
            <Link to="/admin/employee/new">Nowy</Link>
          </Button>
        </span>
      ),
      render: (text: any, employee: any) => (
        <span>
          <Button type="primary">
            <Link to={`/admin/employee/${employee.id}`}>Edytuj</Link>
          </Button>
        </span>
      ),
      sorter: false,
    },
  ];

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title="Lista pracowników" />
      <div className="employee-list-table">
        <TableView
          className="employees-table"
          count={props.count}
          data={props.data}
          loading={props.loading}
          columns={columns}
          pageSize={props.pageSize}
          pageSizeOptions={props.pageSizeOptions}
          sortField={props.sortField}
          additionalFilters={{ roleName: defaultFilters }}
          fetchData={props.fetchEmployees}
        />
      </div>
    </div>
  );
};
