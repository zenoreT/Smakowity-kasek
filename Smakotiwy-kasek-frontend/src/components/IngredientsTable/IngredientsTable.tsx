import "./IngredientsTable.css";

import { Button, PageHeader } from "antd";
import { ColumnProps } from "antd/lib/table";
import React from "react";
import { Link } from "react-router-dom";

import { HistoryItem } from "../../utils/models/HistoryItem";
import { TableRequest } from "../../utils/models/TableRequest";
import { UserDetails } from "../../utils/models/UserDetails";
import { TableView } from "../TableView/TableView";
import { parseDate } from "../../utils/Utils";

interface Props {
  userDetails?: UserDetails;
  data: any[];
  count: number;
  loading: boolean;
  pageSize: number;
  pageSizeOptions: string[];
  sortField: string;
  fetchIngredients: (tableRequest: TableRequest) => void;
  delteIngredient: (item: any, itemType: string) => void;
}

export const IngredientsTable = (props: Props) => {
  const columns: ColumnProps<HistoryItem>[] = [
    {
      title: "Nazwa",
      dataIndex: "name",
      sorter: true,
      render: (name: any) => <span>{name}</span>,
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
            <Link to="/admin/ingredient/new">Nowy</Link>
          </Button>
        </span>
      ),
      render: (text: any, ingredient: any) => (
        <div>
          <span>
            <Button type="primary">
              <Link to={`/admin/ingredient/${ingredient.id}`}>Edytuj</Link>
            </Button>
          </span>
          {/* <span>
            <Button type="primary" onClick={() => props.delteIngredient(ingredient, getEnumKeyFromValue(ItemType, ItemType.Ingredient, true))}>
              Usuń
            </Button>
          </span> */}
        </div>
      ),
      sorter: false,
    },
  ];

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title="Lista dostępnych składników" />
      <div className="ingredient-list-table">
        <TableView
          className="ingredients-table"
          count={props.count}
          data={props.data}
          loading={props.loading}
          columns={columns}
          pageSize={props.pageSize}
          pageSizeOptions={props.pageSizeOptions}
          sortField={props.sortField}
          fetchData={props.fetchIngredients}
        />
      </div>
    </div>
  );
};
