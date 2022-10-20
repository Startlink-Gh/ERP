import { Table, Input, Modal, Button, Popconfirm, Form, Card, Message } from 'antd';
import Router from 'next/router';
import reqwest from 'reqwest';
import withAuth from '../../hoc/withAuth';

const FormItem = Form.Item;
const { TextArea } = Input;

const CategoryAddForm = Form.create()(
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title='Add a new product category'
          okText='Add category'
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout='vertical'>
            <FormItem label='Category name'>
              {getFieldDecorator('category_name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input the name of Category!',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label='Description'>{getFieldDecorator('description')(<TextArea rows={4} />)}</FormItem>
          </Form>
        </Modal>
      );
    }
  }
);

class CategoriesPage extends React.Component {
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
        title: 'Category',
        dataIndex: 'category_name',
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
        width: '20%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.category_id)}>
              <a href='javascript:;'>Delete</a>
            </Popconfirm>
          ) : null,
      },
    ];
  }

  handleDelete = (id) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter((item) => item.category_id !== id) });

    reqwest({
      url: `http://localhost:3000/api/v1/categories/delete/${id}`,
      method: 'DELETE',
      type: 'json',
    }).then((data) => {
      Message.success(`Deleted successfully`).then(() => this.fetch());
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
    form.validateFields((err, values) => {
      if (err) return;
      reqwest({
        url: 'http://localhost:3000/api/v1/categories/addCategory',
        method: 'POST',
        type: 'json',
        data: {
          ...values,
        },
      }).then((data) => {
        Message.success(`${data.data.category} added successfully`).then(() => this.fetch());
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
      url: 'http://localhost:3000/api/v1/categories/getCategories',
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
        }),
      };
    });
    return (
      <Card bodyStyle={{ padding: 10 }} id='products-page'>
        <div>
          <Button type='primary' onClick={this.showModal} style={{ marginBottom: 16 }}>
            New Category
          </Button>
          <CategoryAddForm
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

export default withAuth(CategoriesPage);
