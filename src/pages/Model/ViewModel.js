import React, { useEffect, useState, useContext } from "react";
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
  Input,
  Modal,
  message,
  Select,
  Spin
} from "antd";

// import { getAllMakes, DeleteMake } from "../../apis/make";
import { getAllModels, DeleteModel } from "../../apis/model";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";

const originalDataSource1 = [{
  applicationUserId: 4,
  userName: "admin",
  email: "admin1@yopmail.com",
  phoneNumber: "111223344",
  isActive: true,
},
{
  applicationUserId: 5,
  userName: "admin2",
  email: "admin2@yopmail.com",
  phoneNumber: "111223344",
  isActive: true,
},
{
  applicationUserId: 6,
  userName: "testUser",
  email: "testuser@yopail.com",
  phoneNumber: "1122887766",
  isActive: false,
},]

// const permissions = {
//   canEdit: true,
//   canDelete: true,
//   canCreate: true,
//   canView: true,
// }
const permissionsProblem = {
  canEdit: false,
  canDelete: false,
  canAdd: false,
  canView: false,
}

function ViewModel({permissions = permissionsProblem}) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [editingKey, setEditingKey] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const [originalDataSource, setOriginalDataSource] = useState([]);
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


  // const { permission } = useContext(UserContext);

  const error = (e) => {
    messageApi.open({
      type: 'error',
      content: e,
    });
  };
  const success = (e) => {
    messageApi.open({
      type: 'success',
      content: e,
    });
  };
  const FetchData = async () => {
    setLoading(true)
    getAllModels().then((response) => {
      // console.log(response);
      if (!response.error) {
        // console.log(response);
        setDataSource(response.data);
        setFilteredData(response.data);
        setOriginalDataSource(response.data);
      } else {
        error(response.data);
      }
      setLoading(false)
    });
  }
  useEffect(() => {
    // Fetch data from the API when the component mounts
    FetchData();
  }, []);


  const edit = (record) => {
    history.push(`/edit-model/${record.modelId}`);
  };
  const handleDelete = (record) => {
    DeleteModel(record.modelId, false).then((response) => {
      if (!response.error) {
        success("Model deleted successfully");
        FetchData();
      } else {
        error(response.data);
      }
    });
  };

  const onChangeTableFilter = (e) => {
    if (e.target.value === "all") {
      setDataSource(originalDataSource);
    } else if (e.target.value === "active") {
      const activeUsers = originalDataSource.filter(
        (item) => item.isActive
      );
      setDataSource(activeUsers);
    }
  };

  const columns = [
    { title: "Model ID", dataIndex: "modelId", key: "modelId" },
    { title: "Make ID", dataIndex: "makeId", key: "makeId" },
    { title: "Name Ar", dataIndex: "modelNameAr", key: "modelNameAr" },
    { title: "Name En", dataIndex: "modelNameEn", key: "modelNameEn" },
    { title: "Najm Model Code", dataIndex: "najmModelCode", key: "najmModelCode" },
    { title: "Yakeen Model Code", dataIndex: "yakeenModelCode", key: "yakeenModelCode" },
    { title: "GI Core Model Code", dataIndex: "giCoreModelCode", key: "giCoreModelCode" },
    { title: "BCare Model Code", dataIndex: "bCareModelCode", key: "bCareModelCode" },
    { title: "Nationality ID", dataIndex: "nationalityId", key: "nationalityId" },
    { title: "Seating Capacity", dataIndex: "seatingCapacity", key: "seatingCapacity" },
    { title: "Weight", dataIndex: "weight", key: "weight" },
    { title: "Model Category ID", dataIndex: "modelCategoryId", key: "modelCategoryId" },
    { title: "Vehicle Group Code", dataIndex: "vehicleGroupCode", key: "vehicleGroupCode" },
    permissions?.canEdit && {
      title: "Edit",
      dataIndex: "Edit",
      render: (_, record) => (
        <Typography.Link onClick={() => edit(record)}>
          <Button type="dashed" >
            Edit
          </Button>
        </Typography.Link>
      )
    },
    permissions.canDelete && {
      title: "Delete",
      dataIndex: "Delete",
      render: (_, record) => (
        <Popconfirm
          title="Delete this item?"
          onConfirm={() => handleDelete(record)}
        >
          <a><Button type="primary" danger>
            Delete
          </Button></a>
        </Popconfirm>
      )
    },
].filter(Boolean);


  const handleAddUser = () => {
    history.push('/add-model'); // Redirects to /adduser
  };


  return (
    <>
      {contextHolder}
      <div className="tabled">
        <Row gutter={[24, 0]}>
          <Col xs="24" xl={24}>
            <Card
              bordered={false}
              className="criclebox tablespace mb-24"
              title="Models"
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
                      Add Model
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
                      rowClassName="editable-row"
                    />
                  </Form>)
                }
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ViewModel;
