import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  Avatar, Button, Empty, Modal, Pagination, Result, Skeleton, Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import ApiService from '../../utils/apiService';
import notificationWithIcon from '../../utils/notification';
import { messStatus, roomStatusAsResponse } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';
import Hosteledit from './hosteledit';

const { confirm } = Modal;

function HostelList({ add }) {
  const [query, setQuery] = useState({
    search: '', sort: 'asce', page: '1', rows: '10'
  });
  const [roomEditModal, setRoomEditModal] = useState(
    { open: false, roomId: null }
  );

  const [fetchAgain, setFetchAgain] = useState(false);

  // fetch room-list API data
  const [loading, error, response] = useFetchData(`/api/v1/all-hostel-list?keyword=${query.search}&limit=${query.rows}&page=${query.page}&sort=${query.sort}`, fetchAgain);

  // reset query options
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  // function to handle delete
  const handleDeleteRoom = (id) => {
    confirm({
      title: 'DELETE ROOM',
      icon: <ExclamationCircleFilled />,
      content: 'Are you sure delete this Hostel permanently?',
      onOk() {
        return new Promise((resolve, reject) => {
          ApiService.delete(`/api/v1/delete-hostel/${id}`)
            .then((res) => {
              if (res?.result_code === 0) {
                notificationWithIcon('success', 'SUCCESS', res?.result?.message || 'Hostel delete successful');
                setFetchAgain(!fetchAgain);
                resolve();
              } else {
                notificationWithIcon('error', 'ERROR', 'Sorry! Something went wrong. App server error');
                reject();
              }
            })
            .catch((err) => {
              notificationWithIcon('error', 'ERROR', err?.response?.data?.result?.error?.message || err?.response?.data?.result?.error || 'Sorry! Something went wrong. App server error');
              reject();
            });
        }).catch(() => notificationWithIcon('error', 'ERROR', 'Oops errors!'));
      }
    });
  };

  return (
    <div>
      {/* room list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} />

      {/* room list ― content section */}
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {response?.data?.rows?.length === 0 ? (
              <Empty
                className='mt-10'
                description={(<span>Sorry! Any data was not found.</span>)}
              />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    {/* data table ― head */}
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Images
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Hostel Name
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Total Rooms
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Hostel Price
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Hostel Size
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Mess
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Hostel Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Hostel Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response?.data?.rows?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td'>
                            <Avatar.Group>
                              {data?.hostel_images?.map((image) => (
                                <Avatar
                                  key={uniqueId()}
                                  src={image.url}
                                  crossOrigin='anonymous'
                                  size='large'
                                />
                              ))}
                            </Avatar.Group>
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.hostel_name}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            {data?.hostel_room}
                          </td>
                          <td className='data-table-body-tr-td !lowercase'>
                            {`$ ${data?.hostel_price}`}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {`${data?.hostel_size} sq. ft.`}
                          </td>
                          <td className='data-table-body-tr-td'>
                            <Tag
                              className='w-[80px] text-center uppercase'
                              color={messStatus(data?.mess).color}
                            >
                              {messStatus(data?.mess).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[80px] text-center uppercase'
                              color={roomStatusAsResponse(data?.hostel_status).color}
                            >
                              {roomStatusAsResponse(data?.hostel_status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => add(data?.id)}
                              type='link'
                            >
                              View
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => setRoomEditModal(
                                (prevState) => ({ ...prevState, open: true, roomId: data?.id })
                              )}
                              type='link'
                            >
                              Edit
                            </Button>
                            <Button
                              className='inline-flex items-center !px-2'
                              onClick={() => handleDeleteRoom(data?.id)}
                              type='link'
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Skeleton>
        )}
      </div>

      {/* room list ― pagination */}
      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}

      {/* room edit modal component */}
      {roomEditModal.open && (
        <Hosteledit
          HostelEditModal={roomEditModal}
          setHostelEditModal={setRoomEditModal}
        />
      )}
    </div>
  );
}

export default React.memo(HostelList);
