import "./Register.css";

import { Button, Form, Icon, Input, Select, Spin, PageHeader } from "antd";
import { FormComponentProps } from "antd/lib/form";
import React from "react";
import { FormEvent } from "react";
import { NavLink } from "react-router-dom";

import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  MSG_USERNAME_1,
  MSG_USERNAME_2,
  MSG_USERNAME_3,
  MSG_USERNAME_4,
  MSG_EMAIL_1,
  MSG_EMAIL_2,
  MSG_EMAIL_3,
  MSG_EMAIL_4,
  MSG_PASSWORD_1,
  MSG_PASSWORD_2,
  MSG_PASSWORD_3,
  MSG_PASSWORD_4,
  MSG_CITY_1,
  MSG_CITY_2,
  MSG_POST_CODE_1,
  MSG_POST_CODE_2,
  MSG_POST_CODE_3,
  POST_CODE_LENGTH,
  MSG_STREET_1,
  MSG_STREET_2,
  MSG_ROLE_1,
} from "../../utils/Consts";
import { Role } from "../../utils/models/Role";
import { TableRequest } from "../../utils/models/TableRequest";
import useEffectOnce from "react-use/lib/useEffectOnce";

interface Props extends FormComponentProps {
  user: any;
  handleRegister(values: any, newUser: boolean): void;
  loading: boolean;
  justUser: boolean;
  header: string;
  footer: string;
  fetchEmployees?: (tableRequest: TableRequest) => void;
}

const Register = (props: Props) => {
  const handleSubmit = (e: FormEvent<any>) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.roles) {
          values.roles = [];
        }
        props.handleRegister(values, props.user.id === undefined);
        props.form.resetFields();
      }
    });
  };

  useEffectOnce(() => {
    if (props.fetchEmployees) {
      props.fetchEmployees({ results: 20, page: 1, sortField: "username" });
    }
  });

  const user = props.user;
  if (!user) {
    return (
      <Spin
        size="large"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 141px)",
        }}
      />
    );
  }

  const compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const form = props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("Oba podane hasła muszą być takie same!");
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule: any, value: any, callback: any) => {
    const form = props.form;
    if (value) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  const { getFieldDecorator } = props.form;
  return (
    <div className="register-view-wrapper">
      {!props.justUser ? <PageHeader onBack={() => window.history.back()} title={props.header} /> : null}
      <div className={props.justUser ? "register-view" : "register-view bordered smaller"}>
        <Form onSubmit={handleSubmit} className="register-form">
          {props.justUser ? <h1>{props.header}</h1> : null}
          <Form.Item hasFeedback>
            {getFieldDecorator("username", {
              initialValue: user.username,
              rules: [
                {
                  required: true,
                  message: MSG_USERNAME_1,
                },
                {
                  whitespace: true,
                  message: MSG_USERNAME_2,
                },
                {
                  min: USERNAME_MIN_LENGTH,
                  message: MSG_USERNAME_3,
                },
                {
                  max: USERNAME_MAX_LENGTH,
                  message: MSG_USERNAME_4,
                },
              ],
            })(<Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Nazwa użytkownika" />)}
          </Form.Item>
          {!props.justUser ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("roles", {
                initialValue: user.roles.map((role: any) => role.name),
                rules: [{ required: true, message: MSG_ROLE_1 }],
              })(
                <Select mode="multiple" allowClear placeholder="Wybierz role użytkownika">
                  {Object.values(Role)
                    .filter(role => role !== Role.USER)
                    .map(role => (
                      <Select.Option key={role}>{role}</Select.Option>
                    ))}
                </Select>
              )}
            </Form.Item>
          ) : null}
          <Form.Item hasFeedback>
            {getFieldDecorator("email", {
              initialValue: user.email,
              rules: [
                { required: true, message: MSG_EMAIL_1 },
                {
                  whitespace: true,
                  message: MSG_EMAIL_2,
                },
                {
                  max: EMAIL_MAX_LENGTH,
                  message: MSG_EMAIL_3,
                },
                {
                  type: "email",
                  message: MSG_EMAIL_4,
                },
              ],
            })(<Input prefix={<Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Adres e-mail" />)}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("address.city", {
              initialValue: user.address.city,
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
              initialValue: user.address.postCode,
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
                {
                  pattern: /\d{2}-\d{3}/g,
                  message: <div>Podano nieprawidłowy kod pocztowy</div>,
                },
              ],
            })(<Input prefix={<Icon type="home" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Kod pocztowy" />)}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("address.street", {
              initialValue: user.address.street,
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
          {!user.id ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("password", {
                rules: [
                  { required: true, message: MSG_PASSWORD_1 },
                  {
                    whitespace: true,
                    message: MSG_PASSWORD_2,
                  },
                  {
                    min: PASSWORD_MIN_LENGTH,
                    message: MSG_PASSWORD_3,
                  },
                  {
                    max: PASSWORD_MAX_LENGTH,
                    message: MSG_PASSWORD_4,
                  },
                  { validator: validateToNextPassword },
                ],
              })(<Input.Password prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Hasło" />)}
            </Form.Item>
          ) : null}
          {!user.id ? (
            <Form.Item hasFeedback>
              {getFieldDecorator("password2", {
                rules: [
                  { required: true, message: MSG_PASSWORD_1 },
                  {
                    whitespace: true,
                    message: MSG_PASSWORD_2,
                  },
                  {
                    min: PASSWORD_MIN_LENGTH,
                    message: MSG_PASSWORD_3,
                  },
                  {
                    max: PASSWORD_MAX_LENGTH,
                    message: MSG_PASSWORD_4,
                  },
                  { validator: compareToFirstPassword },
                ],
              })(<Input.Password prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} autoComplete="off" placeholder="Potwierdź hasło" />)}
            </Form.Item>
          ) : null}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="register-form-button" loading={props.loading}>
              {props.footer}
            </Button>
            {props.justUser ? (
              <div className="register-form-suffix">
                lub &nbsp;
                <NavLink to="/login" exact>
                  zaloguj się teraz
                </NavLink>
              </div>
            ) : null}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Form.create<Props>()(Register);
