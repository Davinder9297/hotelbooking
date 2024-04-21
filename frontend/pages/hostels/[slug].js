import { Button } from 'antd';
import axios from 'axios';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import Banner from '../../components/home/Banner';
import MainLayout from '../../components/layout';
import StyledHero from '../../components/rooms/StyledHero';
import Loading from '../../components/shared/Loading';
import OrderPlaceModal from '../../components/utilities/OrderPlaceModal';
import RoomReviewList from '../../components/utilities/RoomReviewList';
import { getSessionToken, getSessionUser } from '../../utils/authentication';
import notificationWithIcon from '../../utils/notification';
import HostelOrderPlaceModal from '../../components/utilities/HostelOrderplace';

const { publicRuntimeConfig } = getConfig();

function HostelPreview(props) {
  const [bookingModal, setBookingModal] = useState({ open: false, roomId: null });
  const token = getSessionToken();
  const user = getSessionUser();
  const router = useRouter();

  // function to handle place booking order
  const handleOrder = () => {
    if (!token && !user) {
      notificationWithIcon('error', 'ERROR', 'Please Registration/Login first to place an order.');
      router.push('/auth/login');
    } else {
      setBookingModal((prevState) => (
        { ...prevState, open: true, roomId: props?.room?.data?.id }
      ));
    }
  };

  return (
    <>
      <MainLayout title='Beach Resort ― Hostel Preview'>
        {!props?.room && !props?.error ? (
          <Loading />
        ) : props?.error ? (
          <div className='error'>
            <h3>{props?.error?.message || 'No such hostel could be found!'}</h3>
            <Link className='btn-primary' href='/rooms'>
              Back to hostels
            </Link>
          </div>
        ) : (
          <>
            <StyledHero>
              <Banner title={`${props?.room?.data?.hostel_name} hostel`}>
                <Link className='btn-primary' href='/hostels'>
                  Back to hostels
                </Link>
              </Banner>
            </StyledHero>

            <section className='single-room'>
              <div className='single-room-images'>
                {props?.room?.data?.hostel_images?.map((item) => (
                  <img
                    key={uniqueId()}
                    src={item?.url}
                    alt={item?.url || 'hostel-details-img'}
                  />
                ))}
              </div>

              <div className='single-room-info'>
                <article className='desc'>
                  <h3>Details:</h3>
                  <p>{props?.room?.data?.hostel_description}</p>
                </article>

                <article className='info'>
                  <h3>Information:</h3>
                  <h6>
                    {`Price : $ ${props?.room?.data?.hostel_price}`}
                  </h6>
                  <h6>
                    {`Size : ${props?.room?.data?.hostel_size} SQFT`}
                  </h6>
                  <h6>
                    {`Location : ${props?.room?.data?.hostel_location}`}
                  </h6>
                  <h6>{props?.room?.data?.provide_breakfast && 'free breakfast included'}</h6>
                  <h6>{props?.room?.data?.provide_lunch && 'free lunch included'}</h6>
                  <h6>{props?.room?.data?.provide_dinner && 'free dinner included'}</h6>

                  {props?.room?.data?.hostel_status === 'available' ? (
                    <Button
                      className='btn-primary'
                      type='default'
                      size='large'
                      onClick={handleOrder}
                    >
                      Place Room Booking Order
                    </Button>
                  ) : (
                    <Button
                      className='btn-primary'
                      type='default'
                      size='large'
                      disabled
                    >
                      Hostel Unavailable! Can&#39;t Place Order
                    </Button>
                  )}
                </article>
              </div>

              {/* room reviews list */}
              {/* <div className='single-room-images'>
                {props?.room?.data?.id && (
                  <RoomReviewList roomId={props?.room?.data?.id} />
                )}
              </div> */}
            </section>
          </>
        )}
      </MainLayout>

      {/* room booking order place modal */}
      {bookingModal.open && (
        <HostelOrderPlaceModal
          bookingModal={bookingModal}
          setBookingModal={setBookingModal}
        />
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  try {
    // Fetch data from the server-side API
    const response = await axios.get(
      `${publicRuntimeConfig.API_BASE_URL}/api/v1/get-hostel-by-id-or-slug-name/${ctx.query.slug}`
    );
    console.log();
    const room = response?.data?.result;

    return {
      props: {
        room,
        error: null
      }
    };
  } catch (err) {
    return {
      props: {
        room: null,
        error: err?.data
      }
    };
  }
}

export default HostelPreview;
