import "./ItemView.css";

import { Button, Col, InputNumber, Row, Spin, PageHeader } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import { API_BASE_URL } from "../../utils/Consts";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { OrderItem } from "../../utils/models/OrderItem";
import { UserDetails } from "../../utils/models/UserDetails";
import { isAuthenticated } from "../../utils/Utils";

interface Props {
  item: any;
  loading: boolean;
  userDetails?: UserDetails;
  addToCart: (...items: OrderItem[]) => void;
  fetchMenuItems: () => void;
}

export const ItemView = (props: Props) => {
  const item = props.item;

  useEffectOnce(() => {
    props.fetchMenuItems();
  });

  if (item === undefined) return <Spin size="large" className="spinner" />;

  const meals: JSX.Element[] = [];
  if (item.meals) {
    item.meals.forEach((meal: any) => {
      meals.push(
        <div key={meal.id}>
          <Link to={`/menu/item/${meal.id}`}>
            <div style={{ textAlign: "center" }}>{meal.name}</div>
            <img src={API_BASE_URL + `/menu/images/get?imageName=${meal.imageName}`} alt="loading" style={{ width: "100%" }} />
          </Link>
        </div>
      );
    });
  }

  const ingredients: JSX.Element[] = [];
  if (item.ingredients) {
    item.ingredients.forEach((ingredient: any) => {
      ingredients.push(
        <div key={ingredient.id}>
          <div style={{ textAlign: "center" }}>{ingredient.name}</div>
          <img src={API_BASE_URL + `/menu/images/get?imageName=${ingredient.imageName}`} alt="loading" style={{ width: "100%" }} />
        </div>
      );
    });
  }

  // const additionalIngredients: JSX.Element[] = [];
  // if (item.additionalIngredients) {
  //   item.additionalIngredients.forEach((additionalIngredient: any) => {
  //     additionalIngredients.push(<div key={additionalIngredient.id}>{additionalIngredient.name}</div>);
  //   });
  // }

  let quantity = 1;

  const handleQuantityChange = (value: number | undefined) => {
    if (value) {
      quantity = value;
    }
  };

  const bigColSpan = {
    lg: 16,
    sm: 16,
    xs: 24,
  };

  const fullColSpan = {
    lg: 24,
    sm: 24,
    xs: 24,
  };

  const smallColSpan = {
    lg: 8,
    sm: 8,
    xs: 24,
  };

  const itemActions = isAuthenticated(props.userDetails) ? (
    <div key={5}>
      <div className="item-view-wrapper item-view-actions" style={{ width: "100%" }}>
        <div>Ilość sztuk: </div>
        <InputNumber min={1} precision={0} defaultValue={quantity} onChange={handleQuantityChange} />
      </div>
      <div className="item-view-wrapper item-view-actions">
          <Button type="primary" onClick={() => props.addToCart({ item, quantity })} loading={props.loading} style={{ width: "100%" }}>
            Dodaj do koszyka
          </Button>
      </div>
      {/* <div className="item-view-wrapper item-view-actions">
        <Button type="primary" onClick={() => props.addToCart(item, quantity)} style={{ width: "100%" }}>
          <Icon type="edit" /> Dostosuj
        </Button>
      </div> */}
    </div>
  ): (
    <div style={{ height: "104px" }}></div>
  )

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title={item.name} />
      <div className="item-view">
        <Row type="flex" justify="center" align="middle">
          <Col key={0} lg={24} sm={24} xs={24} className="item-view-wrapper">
            <img src={API_BASE_URL + `/menu/images/get?imageName=${item.imageName}`} alt="loading" className="item-view-image" />
          </Col>
        </Row>
        <Row type="flex" justify="center" className="description-row">
          <Col key={1} {...bigColSpan}>
            <div className="item-view-title">Opis: </div>
            <div>{item.description}</div>
          </Col>
          <Col key={2} {...smallColSpan} className="item-view-wrapper space" style={{ flexDirection: "column" }}>
            <div className="item-view-price">
              Cena: <span>{item.price}</span> zł
            </div>
            <div>{itemActions}</div>
          </Col>
        </Row>
        {meals.length > 0 ? (
          <Row type="flex" justify="center" align="middle">
            <Col key={3} {...fullColSpan}>
              <div className="item-view-title">Posiłki: </div>
              <div className="item-view-items">{meals}</div>
            </Col>
          </Row>
        ) : null}
        {ingredients.length > 0 ? (
          <Row type="flex" justify="center" align="middle">
            <Col key={4} {...fullColSpan}>
              <div className="item-view-title">Składniki: </div>
              <div className="item-view-items">{ingredients}</div>
            </Col>
          </Row>
        ) : null}
        {/* {additionalIngredients.length > 0 ? (
        <Row type="flex" justify="center" align="middle">
          <Col key={5} {...bigColSpan}>
            <div>{additionalIngredients}</div>
          </Col>
          {itemActions(8)}
        </Row>
      ) : null} */}
      </div>
    </div>
  );
};
