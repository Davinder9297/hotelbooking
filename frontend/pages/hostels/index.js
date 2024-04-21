import { Empty, Result, Skeleton } from 'antd';
import axios from 'axios';
import getConfig from 'next/config';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Banner from '../../components/home/Banner';
import Hero from '../../components/home/Hero';
import MainLayout from '../../components/layout';
import RoomFilter from '../../components/rooms/RoomsFilter';
import RoomList from '../../components/rooms/RoomsList';
import HostelFilter from '../../components/hostels/HostelFilter';
import HostelList from '../../components/hostels/HostelList';

const { publicRuntimeConfig } = getConfig();

function Hostels(props) {
  const [ourRooms, setOurRooms] = useState([]);
  const [ourFilteredRooms, setOurFilteredRooms] = useState([]);

  // if props rooms exists to setOurRooms
  useEffect(() => {
    if (props?.rooms) {
      setOurRooms(props?.rooms?.data?.rows);
      setOurFilteredRooms(props?.rooms?.data?.rows);
    }
  }, [props]);

  return (
    <MainLayout title='Beach Resort ― Hostels'>
      <Hero hero='roomsHero'>
        <Banner title='our rooms'>
          <Link className='btn-primary' href='/'>
            return home
          </Link>
        </Banner>
      </Hero>

      {/* featured rooms */}
      <Skeleton loading={!props?.rooms && !props?.error} paragraph={{ rows: 10 }} active>
        {props?.rooms?.data?.rows?.length === 0 ? (
          <Empty
            className='mt-10'
            description={(<span>Sorry! Any data was not found.</span>)}
          />
        ) : props?.error ? (
          <Result
            title='Failed to fetch'
            subTitle={props?.error?.message || 'Sorry! Something went wrong. App server error'}
            status='error'
          />
        ) : (
          <>
            <HostelFilter
              ourRooms={ourRooms}
              setOurFilteredRooms={setOurFilteredRooms}
            />
            <HostelList
              rooms={ourFilteredRooms}
            />
          </>
        )}
      </Skeleton>
    </MainLayout>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch data from the server-side API
    const response = await axios.get(`${publicRuntimeConfig.API_BASE_URL}/api/v1/all-hostel-list`);
    const rooms = response?.data?.result;

    return {
      props: {
        rooms,
        error: null
      }
    };
  } catch (err) {
    return {
      props: {
        rooms: null,
        error: err?.data
      }
    };
  }
}

export default Hostels;
