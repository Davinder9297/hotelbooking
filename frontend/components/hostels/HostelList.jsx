import React from 'react';
import { v4 as uniqueId } from 'uuid';
import Hostel from '../shared/Hostel';

export default function HostelList({ rooms }) {
  if (rooms.length === 0) {
    return (
      <div className='empty-search'>
        <h3>unfortunately no rooms matched your search parameters</h3>
      </div>
    );
  }

  return (
    <section className='rooms-list'>
      <div className='rooms-list-center'>
        {rooms.map((room) => (
          <Hostel key={uniqueId()} room={room} />
        ))}
      </div>
    </section>
  );
}
