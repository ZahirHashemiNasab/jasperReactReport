import React, { useState, useRef } from "react";
import { Form, Input, Button, Radio, Select } from "antd";
import "antd/dist/antd.css";
import "./Report.css";
import Logo from "../../images/logo.jpg";
import { ConfigProvider } from "antd";
import faIR from "antd/es/locale/fa_IR";
import DatePicker from "react-datepicker2";
import moment from "moment-jalaali";
import axios from 'axios'

const ReportGenerator = (props) => {
  const [componentSize, setComponentSize] = useState("default");
  const [selectedDay, setSelectedDay] = useState(null);
  const [dataFrom, setDateFrom] = useState();
  const [reportType, setReportType] = useState("1");
  const formRef = useRef(null);
  const [form] = Form.useForm();
  const [subscribeIds , setSubscribe] = useState([])
  const [paymentType , setPayment] = useState([])
  const [paymentFlag , setPaymentFlag] = useState(false)
  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const onSubscribeFetch = () => {
    axios({
      method:'get',
      url:'http://10.16.145.168/api/subscribe/'
    }).then((response) => {
      console.log("response for then ",response)
      let subscribeData = response.data.map(e => {return{label:e.name,value:e.id,key:e.subscribe_no}})
      console.log("subscribeData ",subscribeData)
      setSubscribe(subscribeData)

    }
    ).catch(error => console.log("error",error))
  }
  const onPaymentMethod = () => {
    axios({
      method:'get',
      url:'http://192.168.10.10:8000/api/receipt_type/'
    }).then((response) => {
      let paymentType = response.data.map(e => {return{label:e.name,value:e.id,key:e.id}})
      console.log("paymentType ",paymentType)
      setPayment(paymentType)

    }
    ).catch(error => console.log("error",error))
  }
  const onReportNameselect = (e)=>{
    console.log("slected",e);
    e === 'main_jrxml' ? setPaymentFlag(true):setPaymentFlag(false)
  }
  const reportTypeChanged = (event) => {
    form.resetFields(["date_to", "date_from"]);
    setReportType(event.target.value);
  };
  const onFinish = (value) => {
    console.log("valuse",value);
    let temp = ''
    if(value.subscribeId !== undefined){
        temp=`&SubscribeNo=${value.subscribeId?.value}`
    }
    let temp1 = ''
    if(value.paymentType !== undefined){
        temp1=`&paymentType=${value.paymentType?.value}`
    }
    let submitedObject = { ...value };
    if (value.report_type === "1") {
      delete submitedObject["date_from"];
      delete submitedObject["date_to"];
      delete submitedObject["date_type"];
      if (value.date_type === "1") {
        submitedObject = {
          ...submitedObject,
          date_from: value.date_from.format("jYYYY/jMM/jDD"),
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
      `http://10.16.145.167:8080/jasperserver/flow.html?_flowId=viewReportFlow&ParentFolderUri=/reports/interactive&reportUnit=/reports/interactive/${submitedObject.reportName}&standAlone=true&decorate=no&j_username=jasperadmin&j_password=jasperadmin&Date_From=${submitedObject.date_from}&Date_To=${submitedObject.date_to}&date_type=${submitedObject.date_type}${temp}${temp1}`,
      "_blank"
    );
  };
  console.log("subscribeIds",subscribeIds);
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
            }}
            ref={formRef}
            onValuesChange={onFormLayoutChange}
            size={componentSize}
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
              <Select dropdownStyle={{ direction: "rtl" }} onSelect={onReportNameselect}>
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
            { paymentFlag && (
            <Form.Item
              name="paymentType"
              label={<p className="ItemLabel">نحوه ی وصول</p>}
            >
              <Select
                dropdownStyle={{ direction: "rtl" }}
                onFocus={onPaymentMethod}
                labelInValue
                allowClear
              >
              {
                paymentType.map(e => 
                  <Select.Option key={e.value} value={e.key*1}>
                   {e.label}
                  </Select.Option>
                )
                
              }

              </Select>
            </Form.Item>
            )}
            <Form.Item
              name="subscribeId"
              label={<p className="ItemLabel">اشتراک</p>}
              // rules={[
              //   {
              //     required: true,
              //     message: ` الزامی است`,
              //   },
              // ]}
            >
              <Select
                dropdownStyle={{ direction: "rtl" }}
                onFocus={onSubscribeFetch}
                labelInValue
                allowClear
                // mode="multiple"
              >
              {
                subscribeIds.map(e => 
                  <Select.Option key={e.value} value={e.key*1}>
                   {e.label}
                  </Select.Option>
                )
                
              }

              </Select>
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
                  </Form.Item>
                </div>
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
                
                دریافت گزارش
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="footer"></div>
      </div>
    </ConfigProvider>
  );
};

export default ReportGenerator;
