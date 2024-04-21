import React from 'react';
import { v4 as uniqueId } from 'uuid';
import Title from './Title';
import Hostel from '../shared/Hostel';

function FeaturedHostels({ featuredRoom }) {
  return (
    <section className='featured-rooms'>
      <Title title='featured hostels' />

      <div className='featured-rooms-center'>
        {featuredRoom?.map((room) => (
          <Hostel key={uniqueId()} room={room} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedHostels;
