import React, { CSSProperties, useEffect, useState } from "react";
import {
  Typography,
  Form,
  Input,
  Button,
  Layout,
  Select,
  Alert,
  Space,
  message,
  InputNumber,
} from "antd";
import { useNavigate } from "react-router-dom";
import { registerTicketRedeemer } from "../../helpers/httpCalls";
import NumberOnlyPasswordField from "../../Components/global/NumberOnlyPasswordField";
const { Title } = Typography;
const BODY: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const FORM_CONTENT: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  // width: "100%",
  margin: "5%",
};
const FORM_SECTION: CSSProperties = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  minWidth: "600px",
  borderRadius: "5px",
  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)",
};

export default function RegisterTicketRedeemerUser() {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  let navigate = useNavigate();
  const onFinish = async (values: any) => {
    setShow(false);
    setIsLoading(true);
    let res = await registerTicketRedeemer(values);
    setIsLoading(false);
    if (res.error) {
      setError(`${res.error}`);
      setShow(true);
    } else {
      message.success("Registered Ticket Redeemer User");
      navigate("/admin/ticket-redeemer/manage");
    }
  };
  const validateMessages = {
    required: "This felid is required!",
  };

  return (
    <>
      <div style={BODY}>
        <div style={FORM_CONTENT}>
          <Title level={2} style={{ margin: "0px 0px 20px 0px" }}>
            {"Register Ticket Redeemer User"}
          </Title>
          <Form
            style={FORM_SECTION}
            initialValues={{ remember: true }}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            validateMessages={validateMessages}
          >
            {show ? (
              <Alert
                style={{ margin: "0 0 3% 0" }}
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => {
                  setShow(false);
                  setError("");
                }}
              />
            ) : null}
            <Form.Item
              label={"First Name"}
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={"Last name"}
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label={"Phone Number"}
              name="phoneNumber"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={"User Name"}
              name="username"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="antd-input-number-scroll-disable"
              label={"Password"}
              name="password"
              rules={[{ required: true }]}
            >
              <NumberOnlyPasswordField  inputProps={{maxLength:4}}/>
            </Form.Item>
            <Form.Item
              label={"Address"}
              name="address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Space direction="vertical" size="small" />
            <Form.Item>
              <Button
                block
                loading={isLoading}
                type="primary"
                htmlType="submit"
              >
                {"Register"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
