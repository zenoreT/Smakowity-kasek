import "./ImageLoader.css";

import { Spin } from "antd";
import React, { useState } from "react";

interface Props {
  url: string;
  onClick?: () => void;
}

interface State {
  loaded: boolean;
}

export const ImageLoader = (props: Props) => {
  const [state, setState] = useState<State>({
    loaded: false
  });

  return (
    <div onClick={props.onClick}>
      {state.loaded ? null : <Spin size="large" className="spinner" />}
      <img
        src={props.url}
        alt="loading"
        onLoad={() => setState({ loaded: true })}
        className={state.loaded ? "loaded" : "loading"}
      />
    </div>
  );
};
