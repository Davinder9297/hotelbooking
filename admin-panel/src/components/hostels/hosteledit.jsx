import { PlusOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Form, Input, InputNumber, Modal, Result, Select, Upload
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EF from '../../assets/data/extra-facilities.json';
import useFetchData from '../../hooks/useFetchData';
import { reFetchData } from '../../store/slice/appSlice';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import PageLoader from '../shared/PageLoader';

function HostelEdit({ HostelEditModal, setHostelEditModal }) {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // fetch Hostel-details API data
  const [fetchLoading, fetchError, fetchResponse] = useFetchData(
    `/api/v1/get-hostel-by-id-or-slug-name/${HostelEditModal.roomId}`
  );

  // set form data from API data
  useEffect(() => {
    if (fetchResponse) {
      form.setFieldsValue({
        hostel_name: fetchResponse?.data?.hostel_name || '',
        hostel_slug: fetchResponse?.data?.hostel_slug || '',
        hostel_price: fetchResponse?.data?.hostel_price || 0,
        hostel_size: fetchResponse?.data?.hostel_size || '',
        hostel_room: fetchResponse?.data?.hostel_room || '',
        hostel_location: fetchResponse?.data?.hostel_location || '',
        mess: fetchResponse?.data?.mess || '',
        provide_breakfast: fetchResponse?.data?.provide_breakfast || false,
        provide_lunch: fetchResponse?.data?.provide_lunch || false,
        provide_dinner: fetchResponse?.data?.provide_dinner || false,
        featured_hostel: fetchResponse?.data?.featured_hostel || false,
        hostel_description: fetchResponse?.data?.hostel_description || '',
        extra_facilities: fetchResponse?.data?.extra_facilities || '',
        hostel_images: fetchResponse?.data?.hostel_images
      });
    }
  }, [fetchResponse, form]);

  const normFile = (e) => {
    if (Array.isArray(e)) { return e; }
    return e?.fileList;
  };
  // function to handle create new Hostel
  const onFinish = (values) => {
    const formdata = new FormData();
    formdata.append('hostel_name', values.hostel_name);
    formdata.append('hostel_slug', values.hostel_slug);
    formdata.append('hostel_price', values.hostel_price);
    formdata.append('hostel_size', values.hostel_size);
    formdata.append('hostel_room', values.hostel_room);
    formdata.append('provide_breakfast', values?.provide_breakfast || false);
    formdata.append('provide_lunch', values?.provide_lunch || false);
    formdata.append('provide_dinner', values?.provide_dinner || false);
    formdata.append('hostel_location', values?.hostel_location || false);
    formdata.append('mess', values?.mess || false);
    formdata.append('featured_hostel', values?.featured_hostel || false);
    formdata.append('hostel_description', values?.hostel_description);

    values.extra_facilities.forEach((facilities) => {
      formdata.append('extra_facilities', facilities);
    });

    values?.hostel_images.forEach((images) => {
      formdata.append('hostel_images', images.originFileObj);
    });
    console.log(values?.hostel_images);
    setLoading(true);
    ApiService.put(`/api/v1/edit-hostel/${HostelEditModal.roomId}`, formdata, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then((response) => {
        setLoading(false);
        if (response?.result_code === 0) {
          notificationWithIcon('success', 'SUCCESS', response?.result?.message || 'Hostel updating successful');
          form.resetFields();
          dispatch(reFetchData());
          setHostelEditModal((prevState) => ({ ...prevState, open: false }));
        } else {
          notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
        }
      })
      .catch((err) => {
        setLoading(false);
        notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
      });
  };

  return (
    <Modal
      title='Edit Hostel Information'
      visible={HostelEditModal.open}
      onOk={() => setHostelEditModal((prevState) => ({ ...prevState, open: false }))}
      onCancel={() => setHostelEditModal((prevState) => ({ ...prevState, open: false }))}
      footer={[]}
      width={1200}
      centered
    >
      {fetchLoading ? (<PageLoader />) : fetchError ? (
        <Result
          title='Failed to fetch'
          subTitle={fetchError}
          status='error'
        />
      ) : (
        <Form
          form={form}
          className='login-form'
          name='hostel-edit-form'
          onFinish={onFinish}
          layout='vertical'
        >
          <div className='two-grid-column'>
            <Form.Item
              className='w-full md:w-1/2'
              label='Hostel Name'
              name='hostel_name'
              rules={[{
                required: true,
                message: 'Please input your Hostel Name!'
              }]}
            >
              <Input
                placeholder='Hostel Name'
                size='large'
                type='text'
                allowClear
              />
            </Form.Item>

            <Form.Item
              className='w-full md:w-1/2'
              label='Hostel Slug'
              name='hostel_slug'
              rules={[{
                required: true,
                message: 'Please input your Hostel Slug!'
              }]}
            >
              <Input
                placeholder='Hostel Slug'
                size='large'
                type='text'
                allowClear
              />
            </Form.Item>
          </div>

          <div className='two-grid-column'>
            <Form.Item
              className='w-full md:w-1/2'
              label='Hostel Room'
              name='hostel_room'
              rules={[{
                required: true,
                message: 'Please input your Total Hostel Rooms!'
              }]}
            >
              <InputNumber
                className='w-full'
                placeholder='Hostel Rooms'
                name='hostel_room'
                size='large'
                type='number'
                min={1}
                max={100000}
              />
            </Form.Item>

            <Form.Item
              className='w-full md:w-1/2'
              label='Hostel Price'
              name='hostel_price'
              rules={[{
                required: true,
                message: 'Please input your Hostel Price!'
              }]}
            >
              <InputNumber
                className='w-full'
                placeholder='Hostel Price'
                type='number'
                size='large'
                min={1}
                max={100000}
              />
            </Form.Item>
          </div>

          <div className='two-grid-column'>
            <Form.Item
              className='w-full md:w-1/2'
              label='Hostel Size'
              name='hostel_size'
              rules={[{
                required: true,
                message: 'Please input your Hostel Size!'
              }]}
            >
              <InputNumber
                className='w-full'
                placeholder='Hostel Size'
                type='number'
                size='large'
                min={1}
                max={1000}
              />
            </Form.Item>

            <Form.Item
              className='w-full md:w-1/2'
              label='Hostel Location'
              name='hostel_location'
              rules={[{
                required: true,
                message: 'Please input your Hostel Capacity!'
              }]}
            >
              <Input
                className='w-full'
                placeholder='Hostel Location'
                size='large'
              />
            </Form.Item>
          </div>

          <Form.Item
            label='Hostel Description'
            name='hostel_description'
            rules={[{
              required: true,
              message: 'Please input your Hostel Description!'
            }]}
          >
            <Input.TextArea
              placeholder='Type here Hostel Description'
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label='Extra Facilities'
            name='extra_facilities'
            rules={[{
              required: true,
              message: 'Please input your Extra Facilities!'
            }]}
          >
            <Select
              placeholder='-- select Hostel extra facilities --'
              optionFilterProp='children'
              options={EF}
              mode='multiple'
              size='large'
              allowClear
            />
          </Form.Item>

          <Form.Item
            name='hostel_images'
            label='Hostel Images'
            valuePropName='fileList'
            getValueFromEvent={normFile}
            rules={[{
              required: true,
              message: 'Please input your Hostel Images!'
            }]}
          >
            <Upload
              listType='picture-card'
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              accept='.jpg,.jpeg,.png,.pdf'
              beforeUpload={() => false}
              fileList={fileList}
              name='hostel_images'
              maxCount={5}
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>
                    Upload
                  </div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className='flex flex-col items-start justify-start gap-y-2'>
            <Form.Item name='provide_breakfast' valuePropName='checked' noStyle>
              <Checkbox>Provide Breakfast?</Checkbox>
            </Form.Item>
            <Form.Item name='provide_lunch' valuePropName='checked' noStyle>
              <Checkbox>Provide Lunch?</Checkbox>
            </Form.Item>
            <Form.Item name='provide_dinner' valuePropName='checked' noStyle>
              <Checkbox>Provide Dinner?</Checkbox>
            </Form.Item>
            <Form.Item name='mess' valuePropName='checked' noStyle>
              <Checkbox>Mess?</Checkbox>
            </Form.Item>
            <Form.Item name='featured_hostel' valuePropName='checked' noStyle>
              <Checkbox>Featured Hostel?</Checkbox>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              className='login-form-button mt-4'
              htmlType='submit'
              type='primary'
              size='large'
              loading={loading}
              disabled={loading}
            >
              Update Hostel Info
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}

export default React.memo(HostelEdit);
