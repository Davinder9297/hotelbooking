import React, { useEffect, useState } from 'react';
import {
  Button, Empty, Pagination, Rate, Result, Skeleton, Tag, Tooltip
} from 'antd';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import arrayToCommaSeparatedText from '../../utils/arrayToCommaSeparatedText';
import { bookingStatusAsResponse } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';
import HostelStatusUpdateModal from '../shared/Hostelstatusupdate';

function HostelOrders() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [query, setQuery] = useState({
    search: '',
    sort: 'desc',
    page: '1',
    rows: '10'
  });
  const [statusUpdateModal, setStatusUpdateModal] = useState({
    open: false,
    roomId: null,
    status: null
  });

  const [loading, error, response] = useFetchData(`/api/v1/get-all-hostelbooking-orders?keyword=${query.search}&limit=${query.rows}&page=${query.page}&sort=${query.sort}`, fetchAgain);

  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  return (
    <div>
      <QueryOptions
        query={query}
        setQuery={setQuery}
      />
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton
            loading={loading}
            paragraph={{ rows: 10 }}
            active
          >
            {response?.data?.rows?.length === 0 ? (
              <Empty
                className='mt-10'
                description={<span>Sorry! Any data was not found.</span>}
              />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booking Dates
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booking Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booked By
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booked Hostel
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Review & Rating
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booking Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {response?.data?.rows?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td'>
                            {arrayToCommaSeparatedText(data?.booking_dates?.map(
                              (date) => date.split('T')[0]
                            ))}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[100px] text-center uppercase'
                              color={bookingStatusAsResponse(data?.booking_status).color}
                            >
                              {bookingStatusAsResponse(data?.booking_status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.booking_by?.fullName}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.room?.hostel_name}
                          </td>
                          <Tooltip
                            title={data?.reviews?.message}
                            placement='top'
                            trigger='hover'
                          >
                            <td className='data-table-body-tr-td text-center'>
                              {data?.reviews ? (
                                <Rate value={data?.reviews?.rating} disabled />
                              ) : 'N/A'}
                            </td>
                          </Tooltip>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            {data?.booking_status !== 'cancel' && data?.booking_status !== 'rejected' && data?.booking_status !== 'in-reviews' && data?.booking_status !== 'completed' ? (
                              <Button
                                className='inline-flex items-center !px-2'
                                type='primary'
                                onClick={() => setStatusUpdateModal((prevState) => ({
                                  ...prevState, open: true, roomId: data?.id, status: data?.booking_status
                                }))}
                              >
                                Update Status
                              </Button>
                            ) : 'Action Not Possible!'}
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

      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}

      {statusUpdateModal?.open && (
        <HostelStatusUpdateModal
          statusUpdateModal={statusUpdateModal}
          setStatusUpdateModal={setStatusUpdateModal}
          setFetchAgain={setFetchAgain}
        />
      )}
    </div>
  );
}

export default HostelOrders;
