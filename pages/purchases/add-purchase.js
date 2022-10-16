import { Button, Card, Form, Icon, Input, Select, DatePicker } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;

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
        }
      });
    };

    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 5, offset: 0 },
        },
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 4 },
        },
      };
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 4 },
        },
      };
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => {
        return (
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Products' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: 'Please add at least one product or delete extra field',
                },
              ],
            })(<Input placeholder='Products name' style={{ width: '60%', marginRight: 8 }} />)}
            {keys.length > 1 ? (
              <Icon
                className='dynamic-delete-button'
                type='minus-circle-o'
                disabled={keys.length === 1}
                onClick={() => this.remove(k)}
              />
            ) : null}
          </FormItem>
        );
      });
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label='Document Number'>
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
            })(<Input type='text' style={{ width: '60%', marginRight: 8 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label='Select a Supplier'>
            {getFieldDecorator('supplier', {
              rules: [
                {
                  required: true,
                  message: 'Please select a Supplier!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input type='text' style={{ width: '60%', marginRight: 8 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label='Expected date'>
            {getFieldDecorator('expected_date', {
              rules: [{ type: 'object', required: true, message: 'Please select the Date Purchase is expected!' }],
            })(<DatePicker style={{ width: '60%', marginRight: 8 }} />)}
          </FormItem>
          <FormItem {...formItemLayout} label='Arrived date'>
            {getFieldDecorator('arrived_date', {
              rules: [{ type: 'object', required: false }],
            })(<DatePicker style={{ width: '60%', marginRight: 8 }} />)}
          </FormItem>
          {formItems}
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type='dashed' onClick={this.add} style={{ width: '60%' }}>
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
  render() {
    return (
      <Card bodyStyle={{ padding: 10 }} id='addPurchase-page'>
        <DynamicFieldSet />
      </Card>
    );
  }
}

export default Form.create()(AddPurchasePage);
