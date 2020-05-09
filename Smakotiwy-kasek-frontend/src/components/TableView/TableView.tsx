import "./TableView.css";

import { Table } from "antd";
import { ColumnProps, PaginationConfig, SorterResult } from "antd/lib/table";
import React, { useState } from "react";
import useEffectOnce from "react-use/lib/useEffectOnce";

import { HistoryItem } from "../../utils/models/HistoryItem";
import { TableRequest } from "../../utils/models/TableRequest";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  count: number;
  loading: boolean;
  columns: ColumnProps<any>[];
  pageSize: number;
  pageSizeOptions: string[];
  sortField: string;
  additionalFilters?: Record<string, string[]>;
  fetchData: (historyRequest: TableRequest) => void;
}

interface State {
  pagination: PaginationConfig;
}

export const TableView = (props: Props) => {
  const [state, setState] = useState<State>({
    pagination: {
      pageSize: props.pageSize,
      size: "small",
      showSizeChanger: true,
      total: props.count,
      pageSizeOptions: props.pageSizeOptions,
    },
  });

  useEffectOnce(() => {
    props.fetchData({ results: state.pagination.pageSize, filters: props.additionalFilters, sortField: props.sortField, page: 1 });
  });

  const handleTableChange = (pagination: PaginationConfig, filters: Record<string, string[]>, sorter: SorterResult<HistoryItem>) => {
    pagination.total = props.count;
    let receivedFilters = props.additionalFilters ? props.additionalFilters : {};
    if (props.additionalFilters) {
      receivedFilters = {}
      Object.entries(props.additionalFilters)
        .filter(additionalFilter => !Object.keys(filters).includes(additionalFilter[0]))
        .forEach(additionalFilter => (receivedFilters[additionalFilter[0]] = additionalFilter[1]));
    }
    
    filters = {
      ...filters,
      ...receivedFilters,
    };

    setState({
      pagination: pagination,
    });

    props.fetchData({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field ? sorter.field : props.sortField,
      sortOrder: sorter.order,
      filters: filters,
    });
  };

  return (
    <Table
      className={props.className}
      size="middle"
      columns={props.columns}
      rowKey={(record: any) => record && record.id ? record.id.toString() : Math.random()}
      dataSource={props.data}
      pagination={state.pagination}
      loading={props.loading}
      onChange={handleTableChange}
      bordered
    />
  );
};
