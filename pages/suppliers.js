import { Table, Input, Modal, Button, Popconfirm, Form, Card, Col } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const InputGroup = Input.Group;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  render() {
    const { editing } = this.state;
    const { editable, dataIndex, title, record, index, handleSave, ...restProps } = this.props;
    return (
      <td ref={(node) => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: 0 }}>
                  {form.getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `${title} is required.`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(<Input ref={(node) => (this.input = node)} onPressEnter={this.save} />)}
                </FormItem>
              ) : (
                <div className='editable-cell-value-wrap' style={{ paddingRight: 24 }} onClick={this.toggleEdit}>
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

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
                  {getFieldDecorator('Product name', {
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
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'supplier name',
        dataIndex: 'name',
      },
      {
        title: 'email',
        dataIndex: 'email',
      },
      {
        title: 'phone',
        dataIndex: 'phone',
      },
      {
        title: 'address',
        dataIndex: 'address',
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
            <Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.key)}>
              <a href='javascript:;'>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];

    this.state = {
      dataSource: [
        {
          key: '0',
          name: 'Edward King 0',
          age: '32',
          address: 'London, Park Lane no. 0',
        },
        {
          key: '1',
          name: 'Edward King 1',
          age: '32',
          address: 'London, Park Lane no. 1',
        },
      ],
      count: 2,
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter((item) => item.key !== key) });
  };

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
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

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
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
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      </Card>
    );
  }
}

export default SuppliersPage;
