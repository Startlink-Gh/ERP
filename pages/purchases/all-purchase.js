import { Table, Input, Modal, Button, Popconfirm, Form, Card, Message, Row, Col } from 'antd';
import Link from 'next/link';
import reqwest from 'reqwest';
import withAuth from '../../hoc/withAuth';

const FormItem = Form.Item;
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

class PurchasePage extends React.Component {
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
        title: 'document #',
        dataIndex: 'document_no',

        editable: true,
      },
      {
        title: 'Supplier ID',
        dataIndex: 'supplier_id',
      },
      {
        title: 'Expected',
        dataIndex: 'expected_date',
      },
      {
        title: 'Arrived',
        dataIndex: 'arrived',
      },
      {
        title: 'Arrived on',
        dataIndex: 'arrived_date',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        width: '10%',
        render: (text, record) =>
          this.state.dataSource.length >= 1 ? (
            <Row>
              <Col span={12}>
                <a href='javascript:;'>View</a>
              </Col>
              <Col span={12}>
                <Popconfirm title='Sure to delete?' onConfirm={() => this.handleDelete(record.key)}>
                  <a href='javascript:;'>Delete</a>
                </Popconfirm>
              </Col>
            </Row>
          ) : null,
      },
    ];
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter((item) => item.key !== key) });
  };

  handleAdd = () => {};

  handleSave = (row) => {};

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:3000/api/v1/purchase/getAllPurchases',
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
      <Card bodyStyle={{ padding: 10 }} id='products-page'>
        <div>
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

export default withAuth(PurchasePage);
