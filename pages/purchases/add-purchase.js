import { Button, Card, Form, Icon, Input, Select, DatePicker, Col, Row, Message } from 'antd';
import reqwest from 'reqwest';

import styled from 'styled-components';
import withAuth from '../../hoc/withAuth';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

const DynamicFieldSet = Form.create()(
  class extends React.Component {
    remove = (k) => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      if (keys.length === 1) {
        return;
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter((key) => key !== k),
      });
    };

    add = () => {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(keys.length);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys,
      });
    };

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);

          reqwest({
            url: 'http://localhost:3000/api/v1/purchase/createPurchase',
            method: 'POST',
            type: 'json',
            data: {
              ...values,
            },
          }).then((data) => {
            // console.log('Data from res:::> ', data);
            if (data.success) {
              Message.success(`Purchase added successfully`);
              this.props.form.resetFields();
              return;
            }
          });
        }
      });
    };

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const { suppliers, categories, products } = this.props;

      const formItemLayout = {
        // labelCol: {
        //   xs: { span: 24, offset: 0 },
        //   sm: { span: 5, offset: 0 },
        // },
        // wrapperCol: {
        //   xs: { span: 24, offset: 0 },
        //   sm: { span: 24, offset: 4 },
        // },
      };

      const formItemLayoutWithOutLabel = {
        // wrapperCol: {
        //   xs: { span: 24, offset: 0 },
        //   sm: { span: 24, offset: 4 },
        // },
      };

      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => {
        return (
          <>
            <InputGroup {...formItemLayout}>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={`Product ${index + 1}`}
                    required={false}
                    key={k}
                  >
                    {getFieldDecorator(`products[${k}].product_id`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          message: 'Please add at least one product or delete extra field',
                        },
                      ],
                    })(
                      <Select style={{ width: '90%' }}>
                        {products ? (
                          products.map((product) => <Option value={product.product_id}>{product.product_name}</Option>)
                        ) : (
                          <Option disabled>No Products</Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label='Product category'>
                    {getFieldDecorator(`products[${k}].category`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          message: 'Please add at least one product or delete extra field',
                        },
                      ],
                    })(
                      <Select style={{ width: '90%' }}>
                        {categories ? (
                          categories.map((category) => (
                            <Option value={category.category_id}>{category.category_name}</Option>
                          ))
                        ) : (
                          <Option disabled>No Categories</Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </InputGroup>
            <InputGroup {...formItemLayout}>
              <Row>
                <Col span={12}>
                  <FormItem label='Quantity'>
                    {getFieldDecorator(`products[${k}].quantity`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: 'Please add at least one product or delete extra field',
                        },
                      ],
                    })(<Input type='text' style={{ width: '90%' }} />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label='Price'>
                    {getFieldDecorator(`products[${k}].price`, {
                      validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: 'Please add at least one product or delete extra field',
                        },
                      ],
                    })(<Input type='text' style={{ width: '90%' }} />)}
                    {keys.length > 1 ? (
                      <Icon
                        style={{ marginLeft: 5, marginTop: -8 }}
                        type='minus-circle-o'
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                      />
                    ) : null}
                  </FormItem>
                </Col>
              </Row>
            </InputGroup>
          </>
        );
      });

      return (
        <Form onSubmit={this.handleSubmit}>
          <InputGroup {...formItemLayout}>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label='Document Number' style={{ marginBottom: 12 }}>
                  {getFieldDecorator('document_no', {
                    rules: [
                      {
                        required: true,
                        message: 'Please input your Document Number!',
                      },
                      {
                        validator: this.validateToNextPassword,
                      },
                    ],
                  })(<Input type='text' style={{ width: '90%' }} />)}
                </FormItem>
                <FormItem {...formItemLayout} label='Expected date'>
                  {getFieldDecorator('expected_date', {
                    rules: [
                      { type: 'object', required: true, message: 'Please select the Date Purchase is expected!' },
                    ],
                  })(<DatePicker style={{ width: '90%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label='Select a Supplier' style={{ marginBottom: 0 }}>
                  {getFieldDecorator('supplier_id', {
                    rules: [
                      {
                        required: false,
                        message: 'Please select a Supplier!',
                      },
                    ],
                  })(
                    <Select style={{ width: '90%' }}>
                      {suppliers ? (
                        suppliers.map((supplier) => (
                          <Option value={supplier.supplier_id}>{supplier.supplier_name}</Option>
                        ))
                      ) : (
                        <Option disabled>No Suppliers</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
                <FormItem label='Has arrived'>
                  {getFieldDecorator('arrived', {
                    rules: [
                      {
                        required: false,
                        message: 'Please category for Product!',
                      },
                    ],
                  })(
                    <Select style={{ width: '90%' }} defaultActiveFirstOption>
                      <Option value={0}>No</Option>
                      <Option value={1}>Yes</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                {getFieldValue('arrived') ? (
                  <FormItem {...formItemLayout} label='Arrived date'>
                    {getFieldDecorator('arrived_date', {
                      rules: [{ type: 'object', required: true, message: 'Please select the Date Purchase arrived!' }],
                    })(<DatePicker style={{ width: '90%' }} />)}
                  </FormItem>
                ) : null}
              </Col>
            </Row>
          </InputGroup>

          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type='dashed' onClick={this.add}>
              <Icon type='plus' /> Add new product field
            </Button>
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </FormItem>
        </Form>
      );
    }
  }
);

class AddPurchasePage extends React.Component {
  state = {
    loading: false,
    categories: [],
    suppliers: [],
    products: [],
  };
  fetchCategories = () => {
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:3000/api/v1/categories/getCategories',
      method: 'GET',
      type: 'json',
    }).then((data) => {
      this.setState({
        loading: false,
        categories: data.data,
      });
    });
  };

  fetchSuppliers = () => {
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:3000/api/v1/suppliers/getSuppliers',
      method: 'GET',
      type: 'json',
    }).then((data) => {
      this.setState({
        loading: false,
        suppliers: data.data,
      });
    });
  };
  fetchProducts = () => {
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:3000/api/v1/products/getProducts',
      method: 'GET',
      type: 'json',
    }).then((data) => {
      this.setState({
        loading: false,
        products: data.data,
      });
    });
  };

  componentDidMount() {
    this.fetchCategories();
    this.fetchSuppliers();
    this.fetchProducts();
  }
  render() {
    return (
      <Card
        bodyStyle={{ padding: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        id='addPurchase-page'
      >
        <Row style={{ minHeight: '100vh', width: '85%', padding: 10 }}>
          <DynamicFieldSet
            suppliers={this.state.suppliers}
            categories={this.state.categories}
            products={this.state.products}
          />
        </Row>
      </Card>
    );
  }
}

export default Form.create()(withAuth(AddPurchasePage));
