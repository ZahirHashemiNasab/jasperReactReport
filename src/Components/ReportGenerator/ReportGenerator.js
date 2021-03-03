import React, { useState, useRef } from "react";
import { Form, Input, Button, Radio, Select } from "antd";
import "antd/dist/antd.css";
import "./Report.css";
import Logo from "../../images/logo.jpg";
import { ConfigProvider } from "antd";
import faIR from "antd/es/locale/fa_IR";
import DatePicker from "react-datepicker2";
// import "./DatePicker.css";
import moment from "moment-jalaali";

const ReportGenerator = (props) => {
  const [componentSize, setComponentSize] = useState("default");
  const [selectedDay, setSelectedDay] = useState(null);
  const [dataFrom, setDateFrom] = useState();
  const [reportType, setReportType] = useState("1");
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const reportTypeChanged = (event) => {
    form.resetFields(["date_to", "date_from"]);
    setReportType(event.target.value);
  };
  const onFinish = (value) => {
    let submitedObject = { ...value };
    if (value.report_type === "1") {
      delete submitedObject["date_from"];
      delete submitedObject["date_to"];
      delete submitedObject["date_type"];
      if (value.date_type === "1") {
        submitedObject = {
          ...submitedObject,
          date_from: value.date_from.format("jYYYY/jMM/jD"),
          date_to: value.date_to.format("jYYYY/jMM/jD"),
          date_type: "1",
        };
      } else {
        submitedObject = {
          ...submitedObject,
          date_from: value.date_from.format("jYYYY/jMM/jD"),
          date_to: value.date_to.format("jYYYY/jMM/jD"),
          date_type: "2",
        };
      }
    } else {
      delete submitedObject["date_type"];
      submitedObject = { ...submitedObject, date_type: "3" };
    }
    window.open(
      `http://10.16.145.167:8080/jasperserver/flow.html?_flowId=viewReportFlow&ParentFolderUri=/reports/interactive&reportUnit=/reports/interactive/${submitedObject.reportName}&standAlone=true&decorate=no&j_username=jasperadmin&j_password=jasperadmin&Date_From=${submitedObject.date_from}&Date_To=${submitedObject.date_to}&date_type=${submitedObject.date_type}`,
      "_blank"
    );
  };
  return (
    <ConfigProvider locale={faIR}>
      <div className="mainDiv">
        <div className="header">
          <img
            src={Logo}
            alt="logo"
            style={{ width: "20%", height: "100%" }}
          ></img>
        </div>{" "}
        <div className="form">
          <Form
            form={form}
            onFinish={onFinish}
            initialValues={{
              size: componentSize,
            //   date_to: "1399/1/1",
            //   date_from: "1399/1/1",
            }}
            ref={formRef}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
            //   initialValues={{ report_type: "1" }}
          >
            <Form.Item
              name="report_type"
              label={<p className="ItemLabel">نوع گزارش گیری</p>}
              rules={[
                {
                  required: true,
                  message: ` الزامی است`,
                },
              ]}
            >
              <Radio.Group buttonStyle="solid" onChange={reportTypeChanged}>
                <Radio.Button value="1">گزارش براساس تاریخ</Radio.Button>
                <Radio.Button value="2">گزارش براساس دوره</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: ` الزامی است`,
                },
              ]}
              name="reportName"
              label={<p className="ItemLabel">گزارش</p>}
            >
              <Select dropdownStyle={{ direction: "rtl" }}>
                <Select.Option value="1">گزارش مانده بدهی</Select.Option>
                <Select.Option value="main_jrxml">
                  گزارش وصولی مشترکین
                </Select.Option>
                <Select.Option value="EnergySaleReport">
                  {" "}
                  گزارش فروش انرژی به مشترک{" "}
                </Select.Option>
                <Select.Option value="ConsumptionAmountReport">
                  گزارش مصارف و مبالغ
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="subscribeId"
              label={<p className="ItemLabel">اشتراک</p>}
            >
              <Select
                dropdownStyle={{ direction: "rtl" }}
                mode="multiple"
              ></Select>
            </Form.Item>
            {reportType === "1" && (
              <Form.Item
                name="date_type"
                label={<p className="ItemLabel">تاریخ براساس</p>}
                rules={[{ required: true, message: ` الزامی است` }]}
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="2">تاریخ بروزرسانی</Radio.Button>
                  <Radio.Button value="1">تاریخ بانک</Radio.Button>
                </Radio.Group>
              </Form.Item>
            )}
            {reportType === "1" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ width: "50%" }}>
                  <Form.Item
                    name="date_from"
                    label={<p className="ItemLabel dateLabel">از تاریخ</p>}
                    className="Date_items"
                    rules={[{ required: true, message: ` الزامی است` }]}
                  >
                    <DatePicker
                      className="DatePicker"
                      isGregorian={false}
                      timePicker={false}
                      inputJalaaliFormat="jYYYY/jM/jD"
                      locale='fa'
                      {...props}
                    />
                  </Form.Item>
                </div>
                <div style={{ width: "50%" }}>
                  <Form.Item
                    name="date_to"
                    label={<p className="ItemLabel dateLabel">تا تاریخ</p>}
                    className="Date_items"
                    rules={[
                      {
                        required: true,
                        message: ` الزامی است`,
                      },
                    ]}
                  >
                    <DatePicker
                      className="DatePicker"
                      isGregorian={false}
                      timePicker={false}
                      inputJalaaliFormat="jYYYY/jM/jD"
                      {...props}
                    />
                  </Form.Item>
                </div>
              </div>
            )}
            {reportType !== "1" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div style={{ width: "50%" }}>
                  <Form.Item
                    name="date_from"
                    label={<p className="ItemLabel">از دوره</p>}
                    rules={[{ required: true, message: ` الزامی است` }]}
                  >
                    <Input
                      placeholder={"مثال: 01-1399"}
                      style={{ width: "300px" }}
                    />
                  </Form.Item>{" "}
                </div>{" "}
                <div style={{ width: "50%" }}>
                  <Form.Item
                    name="date_to"
                    label={<p className="ItemLabel">تا دوره</p>}
                    rules={[{ required: true, message: ` الزامی است` }]}
                  >
                    <Input
                      placeholder={"مثال: 01-1399"}
                      style={{ width: "300px" }}
                    />
                  </Form.Item>
                </div>
              </div>
            )}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ fontSize: "1.1rem" }}
              >
                {" "}
                دریافت گزارش
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="footer"></div>{" "}
      </div>
    </ConfigProvider>
  );
};

export default ReportGenerator;
