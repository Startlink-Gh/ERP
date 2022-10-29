import { Table, Input, Modal, Button, Popconfirm, Form, Card, Col, Message } from 'antd';
import withAuth from '../hoc/withAuth';
import reqwest from 'reqwest';

const FormItem = Form.Item;
const { TextArea } = Input;
const InputGroup = Input.Group;

const SupplierAddForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} title='Add a new supplier' okText='Add supplier' onCancel={onCancel} onOk={onCreate}>
          <Form layout='vertical'>
            <InputGroup size='large'>
              <Col span={12}>
                <FormItem label='Supplier name'>
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input the name of Suppleir!',
                      },
                    ],
                  })(<Input type='text' />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='Supplier email'>
                  {getFieldDecorator('email', {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Supplier's email!",
                      },
                    ],
                  })(<Input type='email' />)}
                </FormItem>
              </Col>
            </InputGroup>

            <FormItem label='Supplier phone no.'>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: "Please input the Supplier's phone number!",
                  },
                ],
              })(<Input size='large' type='phone' />)}
            </FormItem>
            <FormItem label='Supplier Address'>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: "Please input the Supplier's Address!",
                  },
                ],
              })(<TextArea rows={2} />)}
            </FormItem>
            <FormItem label='City'>
              {getFieldDecorator('city', {
                rules: [
                  {
                    required: true,
                    message: "Please input the Supplier's City!",
                  },
                ],
              })(<Input size='large' />)}
            </FormItem>
            <FormItem label='Region'>
              {getFieldDecorator('region', {
                rules: [
                  {
                    required: true,
                    message: "Please input the Supplier's Region!",
                  },
                ],
              })(<Input size='large' />)}
            </FormItem>
            <InputGroup size='large'>
              <Col span={12}>
                <FormItem label='Suburb'>
                  {getFieldDecorator('suburb', {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Supplier's Suburb!",
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label='Country'>
                  {getFieldDecorator('country', {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Supplier's Country!",
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
            </InputGroup>
          </Form>
        </Modal>
      );
    }
  }
);

class SuppliersPage extends React.Component {
  state = {
    visible: false,
    dataSource: [],
    loading: false,
    count: 0,
  };

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'supplier name',
        dataIndex: 'supplier_name',
      },
      {
        title: 'email',
        dataIndex: 'supplier_email',
      },
      {
        title: 'phone',
        dataIndex: 'supplier_phone',
      },
      {
        title: 'address',
        dataIndex: 'address_line',
      },
      {
        title: 'city',
        dataIndex: 'city',
      },
      {
        title: 'region',
        dataIndex: 'region',
      },
      {
        title: 'suburb',
        dataIndex: 'suburb',
      },
      {
        title: 'country',
        dataIndex: 'country',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <>
              <Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.supplier_id)}>
                <a href='javascript:;'>Delete</a>
              </Popconfirm>
            </>
          ) : null,
      },
    ];
  }

  handleDelete = (id) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter((item) => item.supplier_id !== id) });

    reqwest({
      url: `http://localhost:3000/api/v1/suppliers/delete/${id}`,
      method: 'DELETE',
      type: 'json',
    }).then((data) => {
      Message.success(`Deleted successfully`).then(() => this.fetch());
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      reqwest({
        url: 'http://localhost:3000/api/v1/suppliers/addSupplier',
        method: 'POST',
        type: 'json',
        data: {
          ...values,
        },
      }).then((data) => {
        Message.success(`${data.data.supplier_name} added successfully`).then(() => this.fetch());
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  fetch = (params = {}) => {
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:3000/api/v1/suppliers/getSuppliers',
      method: 'GET',
      type: 'json',
    }).then((data) => {
      this.setState({
        loading: false,
        dataSource: data.data,
        count: data.data.length,
      });
    });
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { dataSource } = this.state;
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <Card bodyStyle={{ padding: 10 }} id='supplier-page'>
        <div>
          <Button type='primary' onClick={this.showModal} style={{ marginBottom: 16 }}>
            New supplier
          </Button>
          <SupplierAddForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          <Table rowClassName={() => 'editable-row'} bordered dataSource={dataSource} columns={columns} />
        </div>
      </Card>
    );
  }
}

export default withAuth(SuppliersPage);
