import "./MenuCategoriesView.css";

import { Button, Card, PageHeader } from "antd";
import React, { useState } from "react";
import Masonry from "react-masonry-component";
import { Link } from "react-router-dom";

import { Category } from "../../utils/models/Category";

interface State {
  loading: boolean;
}

const MenuCategoriesView = () => {
  const [state, setState] = useState<State>({
    loading: true,
  });

  const categoryItems: any[] = [];
  Object.entries(Category).forEach(category =>
    categoryItems.push(
      <Link to={`/menu/${category[0].toLowerCase()}`} key={category[0]} className="menu-category no-padding">
        <Card hoverable={true}>
          <img src={`/images/${category[0].toLowerCase()}.jpg`} alt="loading" className="menu-category-image" />
          <Button type="primary" className="menu-category-title">
            {category[1]}
          </Button>
        </Card>
      </Link>
    )
  );

  setTimeout(() => {
    setState({ loading: false });
  }, 500);

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title="Menu" />
      <Masonry className={state.loading ? "menu-category-loading" : ""}>{categoryItems}</Masonry>
      {state.loading ? (
        <div className="menu-category-loader-wrapper">
          <div className="menu-category-loader">Loading...</div>
        </div>
      ) : null}
    </div>
  );
};

export default MenuCategoriesView;
