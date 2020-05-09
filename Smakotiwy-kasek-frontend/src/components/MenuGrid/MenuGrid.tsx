import "./MenuGrid.css";

import { Card, Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import { API_BASE_URL } from "../../utils/Consts";
import { UserDetails } from "../../utils/models/UserDetails";

interface Props {
  userDetails?: UserDetails;
  data: any[];
}

export const MenuGrid = (props: Props) => {
  const items: JSX.Element[] = [];
  props.data.forEach((item: any, i: number) => {
    items.push(
      <Col className="gutter-row data-col" lg={6} sm={8} xs={12} key={i}>
        <Link to={`/menu/item/${item.id}`}>
          <Card hoverable={true} cover={<img src={API_BASE_URL + `/menu/images/get?imageName=${item.imageName}`} alt="loading" />}>
            <div>
              <Card.Meta title={item.name} description={item.description} />
            </div>
          </Card>
        </Link>
      </Col>
    );
  });

  return (
    <Row gutter={16} className="data-row" type="flex" justify="center" key={-1}>
      {items}
    </Row>
  );
};
