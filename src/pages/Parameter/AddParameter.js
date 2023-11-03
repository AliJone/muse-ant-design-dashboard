import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Input, Button, Select, message, Card, Row, Col } from 'antd';
import {
    createParameter,
    updateParameter,
    getParameterDetails,
} from '../../apis/parameter';
import { getAllParameterTypes } from '../../apis/parameterType';

const { Option } = Select;

function AddParameter({ isEditable = false }) {
    const [form] = Form.useForm();
    const history = useHistory();
    const { parameterId } = useParams();
    const [parameterTypes, setParameterTypes] = useState([]);

    useEffect(() => {
        getAllParameterTypes()
            .then((response) => {
                if (!response.error) {
                    // message.success('Parameter updated successfully');
                    setParameterTypes(response.data);
                } else {
                    message.error(response.data);
                    history.push('/parameters');
                }
            })
            .catch((err) => {
                message.error('Failed to fetch parameter types');
            });
    }, []);

    useEffect(() => {
        if (isEditable && parameterId) {
            getParameterDetails(parameterId)
                .then((response) => {

                    if (!response.error) {
                        // Convert parameterTypeId to name for displaying in the Select component
                    const parameterType = parameterTypes.find(
                        (pt) => pt.parameterTypeId === response.data.parameterTypeId
                    );
                    form.setFieldsValue({
                        ...response.data,
                        parameterTypeId: parameterType ? parameterType.name : null,
                    });
                    } else {
                        message.error(response.data);
                        // history.push('/parameters');
                    }
                    
                })
                .catch((err) => {
                    message.error('Failed to fetch parameter details');
                });
        }
    }, [isEditable, parameterId, form, parameterTypes]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            // Convert parameter type name back to ID for submission
            const selectedParameterType = parameterTypes.find(
                (pt) => pt.name === values.parameterTypeId
            );
            const submissionValues = {
                ...values,
                parameterTypeId: selectedParameterType.parameterTypeId,
            };

            if (isEditable) {
                updateParameter(parameterId, submissionValues)
                    .then((response) => {
                        if (!response.error) {
                            message.success('Parameter updated successfully');
                            history.push('/parameters');
                        } else {
                            message.error(response.data);
                        }
                    });
            } else {
                createParameter(submissionValues)
                    .then((response) => {
                        if (!response.error) {
                            message.success('Parameter added successfully');
                            history.push('/parameters');
                        } else {
                            message.error(response.data);
                        }
                    });
            }
        });
    };

    return (
        <Card>
            <h2 style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                {isEditable ? 'Edit Parameter' : 'Add New Parameter'}
            </h2>
            <Form form={form} onFinish={handleOk} layout="vertical">
                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="parameterTypeId"
                            label="Parameter Type"
                            rules={[{ required: true, message: 'Please select a parameter type!' }]}
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {parameterTypes.map((type) => (
                                    <Option key={type.parameterTypeId} value={type.name}>
                                        {type.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item style={{ textAlign: 'end', paddingTop: '2rem' }}>
                    <Button style={{ width: '40%' }} type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default AddParameter;
