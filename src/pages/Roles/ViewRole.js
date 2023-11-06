// ViewRole.js
import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    Button,
    Typography,
    Popconfirm,
    Form,
    Modal,
    message, Input,
    Select,
    Spin
  } from "antd";
import { Link, useHistory } from "react-router-dom";
import { getAllRoles } from "../../apis/role";
const permissionsProblem = {
  canEdit: true,
  canDelete: true,
  canAdd: true,
  canView: true,
}

function ViewRole({permissions = permissionsProblem}) {

  const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();
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
    useEffect(() => { 
        fetchRoles();
    }, []);
    const columns = [
        {
            title: 'ID',
            dataIndex: 'applicationRoleId',
            key: 'applicationRoleId',
        },
        {
            title: 'Role Name',
            dataIndex: 'roleName',
            key: 'roleName',
        },

        permissions?.canEdit &&
        {
          title: "Edit",
          dataIndex: "Edit",
          render: (_, record) => {
            return (
              <Typography.Link
                onClick={() => edit(record)}
              >
                <Button type="dashed" >
            Edit
          </Button>
              </Typography.Link>
            );
          },
        }, 
    ].filter(Boolean);
    const fetchRoles = () => {
        setLoading(true);
        getAllRoles().then(response => {
            if (!response.error) {
                setDataSource(response.data);
            } else {
                message.error(response.data);
            }
            setLoading(false);
        });
    };
    const handleAddUser = () => {
        history.push('/add-role'); // Redirects to /adduser
      };
    
    const edit = (record) => {
        history.push(`/edit-role/${record.applicationRoleId}`);
      };

    

    return (
        <>
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Roles"
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
                  {permissions?.canAdd && <span style={{ marginRight: "20px" }}>
                    <Button type="primary" onClick={handleAddUser}>
                      Add Role
                    </Button>
                  </span>}
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
                      className="ant-border-space usertable"
                      />
                      </Form>
                  )
                }
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
    );
}

export default ViewRole;
