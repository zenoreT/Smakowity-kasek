import "./CartView.css";

import { Button, Card, Form, Icon, Input, InputNumber, List, Modal, Radio, PageHeader } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { debounce } from "lodash";
import React, { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import usePrevious from "react-use/lib/usePrevious";
import useUpdateEffect from "react-use/lib/useUpdateEffect";

import {
  API_BASE_URL,
  MSG_CITY_1,
  MSG_CITY_2,
  MSG_PHONE_1,
  MSG_PHONE_2,
  MSG_PHONE_3,
  MSG_POST_CODE_1,
  MSG_POST_CODE_2,
  MSG_POST_CODE_3,
  MSG_STREET_1,
  MSG_STREET_2,
  PHONE_LENGTH,
  POST_CODE_LENGTH,
} from "../../utils/Consts";
import { OrderItem } from "../../utils/models/OrderItem";
import { UserDetails } from "../../utils/models/UserDetails";

enum AddressType {
  DEFAULT = "Domyślny",
  ON_SITE = "Na miejscu",
  CUSTOM = "Niestandardowy",
}

interface Props extends FormComponentProps {
  userDetails?: UserDetails;
  data: OrderItem[];
  loading: boolean;
  handleQuantityChange: (item: OrderItem, quantity: number | undefined) => void;
  removeOrderItem: (item: OrderItem) => void;
  handleOrder: (values: any) => void;
}

interface State {
  visible: boolean;
  addressType: AddressType;
}

export const CartView = (props: Props) => {
  const [state, setState] = useState<State>({
    visible: false,
    addressType: AddressType.DEFAULT,
  });

  const wasLoading = usePrevious(props.loading);

  useUpdateEffect(() => {
    if (wasLoading && !props.loading) {
      setState({
        visible: false,
        addressType: state.addressType,
      });
    }
  }, [props.loading]);

  const handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        if (state.addressType === AddressType.ON_SITE) {
          values.address = {
            city: "Na miejscu",
            street: "Na miejscu",
            postCode: "Na miejscu",
            building: "Na miejscu",
          };
        }

        props.handleOrder(values);
        props.form.resetFields();
      }
    });
  };

  const totalCost = () => {
    let cost = 0;
    props.data.forEach(orderItem => {
      cost += orderItem.item.price * orderItem.quantity;
    });
    return cost;
  };

  const showModal = () => {
    setState({
      visible: true,
      addressType: state.addressType,
    });
  };

  const handleCancel = () => {
    setState({
      visible: false,
      addressType: state.addressType,
    });
  };

  const cartFooter =
    props.data.length > 0 ? (
      <div className="cart-footer">
        <div>
          <span className="price-summary">Koszt całkowity:</span> <b className="item-price">{totalCost()}</b> zł
        </div>
        <Button type="primary" onClick={showModal}>
          Zamów
        </Button>
      </div>
    ) : null;

  const { getFieldDecorator } = props.form;

  return (
    <div>
      <PageHeader onBack={() => window.history.back()} title="Twój koszyk" subTitle="Tutaj znajdują się przedmioty, które dodałeś/aś do koszyka" />
      <List
        className="items-list"
        itemLayout="vertical"
        dataSource={props.data}
        renderItem={menuItem => {
          const item = menuItem.item;
          const quantity = menuItem.quantity;

          return (
            <List.Item>
              <Card hoverable={true} className="cart-card">
                <div className="list-item">
                  <div className="item">
                    <Link to={`/menu/item/${item.id}`} className="item-description">
                      <img src={API_BASE_URL + `/menu/images/get?imageName=${item.imageName}`} alt="loading" className="cart-item-image" />
                      <Card.Meta title={item.name} description={item.description} />
                    </Link>
                  </div>
                  <div className="item-group">
                    <div className="item">
                      <InputNumber min={1} precision={0} defaultValue={quantity} onChange={debounce(value => props.handleQuantityChange(item, value), 300)} />
                      <div>sztuk</div>
                    </div>
                    <div className="item">
                      <div className="item-price-wrapper">
                        <div>
                          <b className="item-price">{quantity * item.price}</b> zł
                        </div>
                        {quantity > 1 ? <div>za sztukę: {item.price} zł</div> : null}
                      </div>
                      <Icon type="delete" theme="twoTone" onClick={() => props.removeOrderItem(item)} />
                    </div>
                  </div>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
      {cartFooter}
      <Modal title="Potwierdzenie zamówienia" visible={state.visible} onCancel={handleCancel} footer={null}>
        <div className="order-summary">
          <div>
            <span className="price-summary">Koszt całkowity:</span> <b className="item-price">{totalCost()}</b> zł
          </div>
          <Form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "10px" }}>
            <Radio.Group
              buttonStyle="solid"
              onChange={event =>
                setState({
                  visible: state.visible,
                  addressType: event.target.value,
                })
              }
              defaultValue={state.addressType}
              className="form-type"
            >
              <Radio.Button value={AddressType.DEFAULT}>{AddressType.DEFAULT}</Radio.Button>
              <Radio.Button value={AddressType.ON_SITE}>{AddressType.ON_SITE}</Radio.Button>
              <Radio.Button value={AddressType.CUSTOM}>{AddressType.CUSTOM}</Radio.Button>
            </Radio.Group>
            {state.addressType === AddressType.CUSTOM ? (
              <div>
                <Form.Item hasFeedback>
                  {getFieldDecorator("address.city", {
                    rules: [
                      {
                        required: true,
                        message: MSG_CITY_1,
                      },
                      {
                        whitespace: true,
                        message: MSG_CITY_2,
                      },
                    ],
                  })(<Input prefix={<Icon type="home" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Miasto" />)}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator("address.postCode", {
                    rules: [
                      {
                        required: true,
                        message: MSG_POST_CODE_1,
                      },
                      {
                        whitespace: true,
                        message: MSG_POST_CODE_2,
                      },
                      {
                        min: POST_CODE_LENGTH,
                        message: MSG_POST_CODE_3,
                      },
                      {
                        max: POST_CODE_LENGTH,
                        message: MSG_POST_CODE_3,
                      },
                    ],
                  })(<Input prefix={<Icon type="home" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Kod pocztowy" />)}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator("address.street", {
                    rules: [
                      {
                        required: true,
                        message: MSG_STREET_1,
                      },
                      {
                        whitespace: true,
                        message: MSG_STREET_2,
                      },
                    ],
                  })(<Input prefix={<Icon type="home" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Ulica" />)}
                </Form.Item>
              </div>
            ) : null}
            <Form.Item hasFeedback>
              {getFieldDecorator("phoneNumber", {
                rules: [
                  {
                    required: true,
                    message: MSG_PHONE_1,
                  },
                  {
                    whitespace: true,
                    message: MSG_PHONE_2,
                  },
                  {
                    min: PHONE_LENGTH,
                    message: MSG_PHONE_3,
                  },
                  {
                    max: PHONE_LENGTH,
                    message: MSG_PHONE_3,
                  },
                  {
                    pattern: /\d{9}/g,
                    message: <div>Podany numer telefonu składa się z innych znaków niż tylko cyfry</div>
                  }
                ],
              })(<Input prefix={<Icon type="mobile" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Numer kontaktowy"/>)}
            </Form.Item>
            <Form.Item className="cart-footer" style={{ marginBottom: "0" }}>
              <Button type="primary" htmlType="submit" loading={props.loading}>
                Zamów
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Form.create<Props>()(CartView);
