import Link from 'next/link';
import React from 'react';

function Hostel({ room }) {
  return (
    <article className='room'>
      <div className='img-container'>
        <img
          src={room?.hostel_images[0]?.url || '/img/jpeg/room-1.jpeg'}
          alt='single room'
        />

        <div className='price-top'>
          <h6>{`$ ${room?.hostel_price}`}</h6>
          <p>per night</p>
        </div>

        <Link
          className='btn-primary room-link'
          href={`/hostels/${room?.hostel_slug}`}
        >
          Feature
        </Link>
      </div>

      <p className='room-info'>
        {room?.hostel_name}
      </p>
    </article>
  );
}

export default Hostel;
