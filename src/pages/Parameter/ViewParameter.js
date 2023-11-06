import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Typography,
  Popconfirm,
  Button,
  message, Input,
  Form,
  Spin,
} from "antd";

import { getAllParameters, deleteParameter } from "../../apis/parameter";
import { useHistory } from "react-router-dom";

// Dummy permissions, replace with actual logic as necessary
const permissionsProblem = {
  canEdit: true,
  canDelete: true,
  canAdd: true,
  canView: true,
};

function ViewParameter({ permissions = permissionsProblem }) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Function to handle search
  const handleSearch = (searchValue) => {
    setSearchText(searchValue);
    const filtered = dataSource.filter(entry =>
      columns.some(column => {
        const cellValue = entry[column.dataIndex];
        let cellValueString;

        // Convert different data types to string
        if (cellValue != null) { // checks for both null and undefined
          if (cellValue instanceof Date) {
            // Format dates as you see fit
            cellValueString = cellValue.toLocaleDateString();
          } else {
            cellValueString = cellValue.toString();
          }
        }

        // Perform case-insensitive comparison
        return cellValueString && cellValueString.toLowerCase().includes(searchValue.toLowerCase());
      })
    );
    setFilteredData(filtered);
  };

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const error = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  const success = (msg) => {
    messageApi.open({
      type: "success",
      content: msg,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllParameters();
      console.log(response);
      if (!response.error) {
        setDataSource(response.data);
        setFilteredData(response.data);
      } else {
        error(response.data);
      }
    } catch (e) {
      error("An error occurred while fetching parameters.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const edit = (record) => {
    history.push(`/edit-parameter/${record.parameterId}`);
  };

  const handleDelete = async (record) => {
    console.log(record);
    // const response = await deleteParameter(record.parameterId);
    // if (!response.error) {
    //   success("Parameter deleted successfully");
    //   fetchData();
    // } else {
    //   error(response.data);
    // }
  };

  const columns = [
    { title: "Parameter ID", dataIndex: "parameterId", key: "parameterId" },
    { title: "Name", dataIndex: "name", key: "name" },
    permissions.canEdit && {
      title: "Edit",
      dataIndex: "edit",
      render: (_, record) => (
        <Typography.Link onClick={() => edit(record)}><Button type="dashed" >
        Edit
      </Button></Typography.Link>
      ),
    },
    permissions.canDelete && {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record) => (
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record)}
          >
            <a><Button type="primary" danger>
            Delete
          </Button></a>
          </Popconfirm>
        ) : null
      ),
    },
  ].filter(Boolean);

  const handleAddParameter = () => {
    history.push("/add-parameter");
  };

  return (
    <>
      {contextHolder}
      <div className="tabled">
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Parameters"
              extra={
                <>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  {permissions.canView && (
                    <Input
                      placeholder="Search..."
                      value={searchText}
                      onChange={e => handleSearch(e.target.value)}
                      style={{ marginBottom: 8, display: 'block', }}
                    />
                  )
                  }
                  {permissions.canAdd && (
                    <Button type="primary" onClick={handleAddParameter}>
                      Add Parameter
                    </Button>
                  )}
                </div>
                </>
              }
            >
              <div className="table-responsive">
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px' }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Form form={form} component={false}>
                    <Table
                      columns={columns}
                      dataSource={filteredData}
                      pagination={{ pageSize: 10 }}
                      className="ant-border-space"
                    />
                  </Form>
                )}
              </div>
            </Card>
          </Col>
      </div>
    </>
  );
}

export default ViewParameter;
