import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Form, Input, Button, message, Card, Row, Col } from "antd";
import { createParameterType, updateParameterType, getParameterTypeDetails } from "../../apis/parameterType";

function AddParameterType({ isEditable = false }) {
    const [form] = Form.useForm();
    const history = useHistory();
    const { parameterTypeId } = useParams();

    useEffect(() => {
        if (isEditable && parameterTypeId) {
            getParameterTypeDetails(parameterTypeId).then(response => {
                if (!response.error) {
                    form.setFieldsValue(response.data);
                } else {
                    message.error(response.data);
                }
            }).catch(err => {
                message.error("Failed to fetch parameter type details");
            });
        }
    }, [isEditable, parameterTypeId, form]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (isEditable) {
                updateParameterType(parameterTypeId, values).then((response) => {
                    if (!response.error) {
                        message.success("Parameter type updated successfully");
                        history.push("/parameterTypes");
                    } else {
                        message.error(response.data);
                    }
                });
            } else {
                createParameterType(values).then((response) => {
                    if (!response.error) {
                        message.success("Parameter type added successfully");
                        history.push("/parameterTypes");
                    } else {
                        message.error(response.data);
                    }
                });
            }
        });
    };

    return (
        <Card>
            <h2 style={{ textAlign: 'center', fontWeight:"bolder" }}>
                {isEditable ? "Edit Parameter Type" : "Add New Parameter Type"}
            </h2>
            <Form
                form={form}
                onFinish={handleOk}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please input the name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: "end", paddingTop:"2rem" }}>
                    <Button style={{width: "40%"}} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddParameterType;
