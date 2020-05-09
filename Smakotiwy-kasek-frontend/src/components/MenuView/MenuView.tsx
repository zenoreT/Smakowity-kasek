import "./MenuView.css";

import { Input, PageHeader, Row, Card } from "antd";
import React, { useState } from "react";
import Masonry from "react-masonry-component";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import useEffectOnce from "react-use/lib/useEffectOnce";

import { Category } from "../../utils/models/Category";
import { UserDetails } from "../../utils/models/UserDetails";
import { API_BASE_URL } from "../../utils/Consts";

interface Props extends RouteComponentProps<any> {
  userDetails?: UserDetails;
  data: any[];
  category: Category;
  loading: boolean;
  getMealByName: (name: string) => void;
  fetchMenuItems: () => void;
}

interface State {
  loading: boolean;
}

const MenuView = (props: Props) => {
  const [state, setState] = useState<State>({
    loading: true,
  });

  useEffectOnce(() => {
    props.fetchMenuItems();
  });

  const items: JSX.Element[] = [];
  props.data.forEach((item: any, i: number) => {
    items.push(
      <Link to={`/menu/item/${item.id}`} key={item.id} className="menu-category max-height">
        <Card
          hoverable={true}
          cover={<img src={API_BASE_URL + `/menu/images/get?imageName=${item.imageName}`} alt="loading" className="menu-category-image" />}
        >
          <div>
            <Card.Meta title={item.name} description={item.description} />
          </div>
        </Card>
      </Link>
    );
  });

  setTimeout(() => {
    setState({ loading: false });
  }, 500);

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title={props.category} />
      <div className={state.loading ? "menu-view menu-category-loading" : "menu-view"}>
        <Row type="flex" justify="center" key={-1}>
          <Input.Search placeholder="Szukaj..." onSearch={value => props.getMealByName(value)} className="search-text" enterButton loading={props.loading} />
        </Row>
        {/* <MenuGrid userDetails={props.userDetails} data={props.data} /> */}
        <Masonry>{items}</Masonry>
      </div>
      {state.loading ? (
        <div className="menu-category-loader-wrapper">
          <div className="menu-category-loader">Loading...</div>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(MenuView);
