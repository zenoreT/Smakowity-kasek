import "./MenuItem.css";

import { Spin, Card, Skeleton } from "antd";
import React, { useState } from "react";
import { API_BASE_URL } from "../../utils/Consts";

interface Props {
  item: any;
  showModal: (item: any) => void;
}

interface State {
  loading: boolean;
}

export const MenuItem = (props: Props) => {
  const [state, setState] = useState<State>({
    loading: true
  });

  const { Meta } = Card;

  return (
    <Skeleton loading={state.loading} active>
      <Card
        hoverable={true}
        onClick={() => props.showModal(props.item)}
        cover={
          <img
            src={
              API_BASE_URL +
              `/menu/images/get?imageName=${props.item.imageName}`
            }
            onLoad={() => setState({ loading: false })}
          />
        }
      >
        <Meta title={props.item.name} description="description" />
      </Card>
    </Skeleton>
  );
};
