import "./Login.css";

import { Button, Form, Icon, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React from "react";
import { FormEvent } from "react";
import { NavLink } from "react-router-dom";

interface Props extends FormComponentProps {
  handleLogin(values: any): void;
  loading: boolean;
}

const Login = (props: Props) => {
  const handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        props.handleLogin(values);
        props.form.resetFields();
      }
    });
  };

  const { getFieldDecorator } = props.form;

  return (
    <div className="login-view">
      <Form onSubmit={handleSubmit} className="login-form">
        <h1>Logowanie</h1>
        <Form.Item>
          {getFieldDecorator("username")(<Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Nazwa użytkownika" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password")(
            <Input.Password prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="Hasło" type="password" />
          )}
        </Form.Item>
        <Form.Item>
          {/* <NavLink to="/reset" exact className="login-form-forgot">
          Forgot password
        </NavLink> */}
          <Button type="primary" htmlType="submit" className="login-form-button" loading={props.loading}>
            Zaloguj
          </Button>
          <div className="login-form-suffix">
            lub &nbsp;
            <NavLink to="/register" exact>
              zarejestruj się
            </NavLink>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create<Props>()(Login);
