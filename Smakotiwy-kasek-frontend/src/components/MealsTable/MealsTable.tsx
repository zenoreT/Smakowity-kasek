import "./MealsTable.css";

import { Button, PageHeader } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { Link } from "react-router-dom";

import { HistoryItem } from "../../utils/models/HistoryItem";
import { TableRequest } from "../../utils/models/TableRequest";
import { UserDetails } from "../../utils/models/UserDetails";
import { TableView } from "../TableView/TableView";
import { Category } from "../../utils/models/Category";
import { parseDate } from "../../utils/Utils";

interface Props {
  userDetails?: UserDetails;
  data: any[];
  count: number;
  loading: boolean;
  pageSize: number;
  pageSizeOptions: string[];
  sortField: string;
  fetchMeals: (tableRequest: TableRequest) => void;
  delteMeal: (item: any, itemType: string) => void;
}

export const MealsTable = (props: Props) => {
  const columns: ColumnProps<HistoryItem>[] = [
    {
      title: "Nazwa",
      dataIndex: "name",
      sorter: true,
      render: (name: any) => <span>{name}</span>,
    },
    {
      title: "Opis",
      dataIndex: "description",
      sorter: true,
      render: (description: any) => <span>{description}</span>,
    },
    {
      title: "Kategoria",
      dataIndex: "category",
      sorter: true,
      render: (category: any) => <span>{Object.entries(Category).find(e => e[0] === category)![1]}</span>,
    },
    {
      title: "Cena",
      dataIndex: "price",
      sorter: true,
      render: (price: any) => <span>{price}</span>,
    },
    {
      title: "Data aktualizacji",
      dataIndex: "updatedAt",
      sorter: true,
      render: (createdAt: any) => <span>{parseDate(createdAt)}</span>,
    },
    {
      title: (
        <span>
          <Button type="primary">
            <Link to="/admin/meal/new">Nowy</Link>
          </Button>
        </span>
      ),
      render: (text: any, meal: any) => (
        <div>
          <span>
            <Button type="primary">
              <Link to={`/admin/meal/${meal.id}`}>Edytuj</Link>
            </Button>
          </span>
          {/* <span>
            <Button type="primary" onClick={() => props.delteMeal(meal, getEnumKeyFromValue(ItemType, ItemType.Meal, true))}>
              Usuń
            </Button>
          </span> */}
        </div>
      ),
      sorter: false
    },
  ];

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title="Lista dostępnych dań" />
      <div className="meal-list-table">
        <TableView
          className="meals-table"
          count={props.count}
          data={props.data}
          loading={props.loading}
          columns={columns}
          pageSize={props.pageSize}
          pageSizeOptions={props.pageSizeOptions}
          sortField={props.sortField}
          fetchData={props.fetchMeals}
        />
      </div>
    </div>
  );
};
