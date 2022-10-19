import { Table, Input, Modal, Button, Popconfirm, Form, Card, Select, Message } from 'antd';
import Router from 'next/router';
import withAuth from '../../hoc/withAuth';
import apiClient from '../../apis/client';
import reqwest from 'reqwest';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const ProductAddForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal visible={visible} title='Add a new product' okText='Add product' onCancel={onCancel} onOk={onCreate}>
          <Form layout='vertical'>
            <FormItem label='Product name'>
              {getFieldDecorator('product_name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the name of Product!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label='Product category'>
              {getFieldDecorator('category_id', {
                rules: [
                  {
                    required: true,
                    message: 'Please category for Product!',
                  },
                ],
              })(
                <Select>
                  <Option value='1'>category 1</Option>
                  <Option value='2'>category 2</Option>
                  <Option value='3'>category 3</Option>
                  <Option value='4'>category 4</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label='Description'>{getFieldDecorator('description')(<TextArea rows={4} />)}</FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class ProductsTable extends React.Component {
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
        title: 'Product name',
        dataIndex: 'product_name',
        width: '30%',
        editable: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        width: '15%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.product_id)}>
              <a href='javascript:;'>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];
  }

  handleDelete = (id) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter((item) => item.product_id !== id) });

    reqwest({
      url: 'http://localhost:3000/api/v1/products/deleteProduct',
      method: 'DELETE',
      type: 'json',
      data: {
        product_id: id,
      },
    }).then((data) => {
      Message.success(`Deleted successfully`).then(() => Router.push('/products/all-products'));
    });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields(async (err, values) => {
      if (err) return;
      reqwest({
        url: 'http://localhost:3000/api/v1/products/addProduct',
        method: 'POST',
        type: 'json',
        data: {
          ...values,
        },
      }).then((data) => {
        Message.success(`${data.data.name} added successfully`).then(() => Router.push('/products/all-products'));
      });
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:3000/api/v1/products/getProducts',
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
      <Card
        bodyStyle={{
          padding: 10,
          minHeight: '100vh',
        }}
        id='products-page'
      >
        <div>
          <Button type='primary' onClick={this.showModal} style={{ marginBottom: 16 }}>
            New Product
          </Button>
          <ProductAddForm
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />
          <Table bordered dataSource={dataSource} loading={this.state.loading} columns={columns} />
        </div>
      </Card>
    );
  }
}

export default withAuth(ProductsTable);
