import {
  Descriptions, Image, List, Result, Skeleton, Tag, Typography
} from 'antd';
import React from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import { roomStatusAsResponse } from '../../utils/responseAsStatus';

function HostelDetails({ id }) {
  // fetch room-details API data
  const [loading, error, response] = useFetchData(`/api/v1/get-hostel-by-id-or-slug-name/${id}`);
  console.log(response);

  return (
    <Skeleton loading={loading} paragraph={{ rows: 10 }} active avatar>
      {error ? (
        <Result
          title='Failed to fetch'
          subTitle={error}
          status='error'
        />
      ) : (
        <Descriptions
          title='Hostel Information'
          bordered
        >
          <Descriptions.Item label='Images' span={3}>
            <Image.PreviewGroup>
              {response?.data?.hostel_images?.map((image) => (
                <Image
                  key={uniqueId()}
                  className='p-2'
                  src={image?.url}
                  crossOrigin='anonymous'
                  alt='user-image'
                  width={120}
                  height={100}
                />
              ))}
            </Image.PreviewGroup>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Name</span>}
          >
            {response?.data?.hostel_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Slug</span>}
          >
            {response?.data?.hostel_slug}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Price</span>}
          >
            {`$ ${response?.data?.hostel_price}`}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Size</span>}
          >
            {`${response?.data?.hostel_size} sq. ft.`}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Rooms</span>}
          >
            {`${response?.data?.hostel_room}`}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Location</span>}
          >
            {`${response?.data?.hostel_location}`}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Provided Breakfast</span>}
          >
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.data?.provide_breakfast ? 'success' : 'error'}
            >
              {response?.data?.provide_breakfast ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Provided Lunch</span>}
          >
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.data?.provide_lunch ? 'success' : 'error'}
            >
              {response?.data?.provide_lunch ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Provided Dinner</span>}
          >
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.data?.provide_dinner ? 'success' : 'error'}
            >
              {response?.data?.provide_dinner ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Mess</span>}
          >
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.data?.mess ? 'success' : 'error'}
            >
              {response?.data?.mess ? 'AVAILABLE' : 'UNAVAILABLE'}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Featured Hostel</span>}
          >
            <Tag
              className='w-[60px] text-center uppercase'
              color={response?.data?.featured_hostel ? 'success' : 'error'}
            >
              {response?.data?.featured_hostel ? 'YES' : 'NO'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Status</span>}
            span={2}
          >
            <Tag
              className='w-[80px] text-center uppercase'
              color={roomStatusAsResponse(response?.data?.hostel_status).color}
            >
              {roomStatusAsResponse(response?.data?.hostel_status).level}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Last Update At</span>}
          >
            {response?.data?.updated_at?.split('T')[0]}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Created At</span>}
            span={2}
          >
            {response?.data?.created_at?.split('T')[0]}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Hostel Description</span>}
            span={3}
          >
            {response?.data?.hostel_description}
          </Descriptions.Item>
          <Descriptions.Item
            label={<span className='whitespace-nowrap'>Extra Facilities</span>}
            span={3}
          >
            <List
              bordered
              dataSource={response?.data?.extra_facilities}
              renderItem={(item) => (
                <List.Item>
                  <Typography.Text>{item}</Typography.Text>
                </List.Item>
              )}
            />
          </Descriptions.Item>
        </Descriptions>
      )}
    </Skeleton>
  );
}

export default React.memo(HostelDetails);
