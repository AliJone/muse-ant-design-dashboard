import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Radio,
  Table,
  Typography,
  Popconfirm,
  Form,
  Spin,
  Button,
  message,
  Input
} from "antd";
import { getAllParameterTypes, deleteParameterType } from "../../apis/parameterType";
import { useHistory } from "react-router-dom";

// Permissions mock (same as before, with adjusted variable names)
const permissionsProblem = {
  canEdit: true,
  canDelete: true,
  canAdd: true,
  canView: true,
}

function ViewParameterType({ permissions = permissionsProblem }) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
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

  const error = (msg) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };
  const success = (msg) => {
    messageApi.open({
      type: 'success',
      content: msg,
    });
  };

  const fetchData = async () => {
    setLoading(true);
    getAllParameterTypes().then((response) => {
      if (!response.error) {
        setDataSource(response.data);
        setFilteredData(response.data);
      } else {
        error(response.data);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const edit = (record) => {
    history.push(`/edit-parameterType/${record.parameterTypeId}`);
  };

  const handleDelete = (record) => {
    console.log(record);
    // deleteParameterType(record.parameterTypeId).then((response) => {
    //   if (!response.error) {
    //     success("Parameter Type deleted successfully");
    //     fetchData();
    //   } else {
    //     error(response);
    //   }
    // });
  };

  const columns = [
    { title: "Parameter Type ID", dataIndex: "parameterTypeId", key: "parameterTypeId" },
    { title: "Name", dataIndex: "name", key: "name" },
    permissions.canEdit && {
      title: "Edit",
      dataIndex: "edit",
      render: (_, record) => (
        <Typography.Link onClick={() => edit(record)}>

          <Button type="dashed" >
            Edit
          </Button>
        </Typography.Link>
      ),
    },
    permissions.canDelete && {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record) => (
        <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(record)}>
          <a><Button type="primary" danger>
            Delete
          </Button></a>
        </Popconfirm>
      ),
    },
  ].filter(Boolean);

  const handleAddParameterType = () => {
    history.push('/add-parameterType');
  };

  return (
    <>
      {contextHolder}
      <div className="tabled">
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Parameter Types"
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
                    <Button type="primary" onClick={handleAddParameterType}>
                      Add Parameter Type
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
                    rowClassName="editable-row"
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

export default ViewParameterType;
