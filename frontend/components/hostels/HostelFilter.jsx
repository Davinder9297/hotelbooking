import React, { useEffect, useState } from 'react';
import Title from '../home/Title';

export default function ({ ourRooms, setOurFilteredRooms }) {
  const [allowBreakfast, setAllowBreakfast] = useState(false);
  const [allowlunch, setAllowlunch] = useState(false);
  const [allowdinner, setAllowdinner] = useState(false);
  const [mess, setmess] = useState(false);

  // function to handle `room_type` filed filtering
//   const roomTypeFiltering = (value) => {
//     if (value === 'all') {
//       setOurFilteredRooms(ourRooms);
//     } else {
//       const filteredRooms = ourRooms.filter((room) => room.room_type === value);
//       setOurFilteredRooms(filteredRooms);
//     }
//   };

  // function to handle `room_price` filed filtering
  const roomPriceFiltering = (value) => {
    const filteredRooms = ourRooms.filter((room) => room.hostel_price <= parseInt(value, 10));
    setOurFilteredRooms(filteredRooms);
  };

  // function to handle `provide_breakfast` filed filtering
  useEffect(() => {
    if (allowBreakfast) {
      const filteredRooms = ourRooms.filter((room) => room.provide_breakfast === allowBreakfast);
      setOurFilteredRooms(filteredRooms);
    } else {
      setOurFilteredRooms(ourRooms);
    }
  }, [allowBreakfast]);

  useEffect(() => {
    if (allowlunch) {
      const filteredRooms = ourRooms.filter((room) => room.provide_lunch === allowlunch);
      setOurFilteredRooms(filteredRooms);
    } else {
      setOurFilteredRooms(ourRooms);
    }
  }, [allowlunch]);

  useEffect(() => {
    if (allowdinner) {
      const filteredRooms = ourRooms.filter((room) => room.provide_dinner === allowdinner);
      setOurFilteredRooms(filteredRooms);
    } else {
      setOurFilteredRooms(ourRooms);
    }
  }, [allowdinner]);

  // function to handle `allow_pets` filed filtering
  useEffect(() => {
    if (mess) {
      const filteredRooms = ourRooms.filter((room) => room.mess === mess);
      setOurFilteredRooms(filteredRooms);
    } else {
      setOurFilteredRooms(ourRooms);
    }
  }, [mess]);

  return (
    <section className='filter-container'>
      <Title title='search rooms' />

      <form className='filter-form'>
        {/* select type start */}
        {/* select type end */}

        {/* room price start */}
        <div className='form-group'>
          <label htmlFor='price'>started price $ 100</label>
          <input
            className='form-control'
            type='range'
            name='price'
            id='price'
            min={100}
            max={1000}
            defaultValue={1000}
            onChange={(e) => roomPriceFiltering(e.target.value)}
          />
        </div>
        {/* room price end */}

        {/* extras start */}
        <div className='form-group'>
          {/* breakfast checked */}
          <div className='single-extra'>
            <input
              name='breakfast'
              type='checkbox'
              id='breakfast'
              checked={allowBreakfast}
              onChange={() => setAllowBreakfast(!allowBreakfast)}
            />
            <label htmlFor='breakfast'>Breakfast</label>
          </div>

          <div className='single-extra'>
            <input
              name='lunch'
              type='checkbox'
              id='lunch'
              checked={allowlunch}
              onChange={() => setAllowlunch(!allowlunch)}
            />
            <label htmlFor='lunch'>Lunch</label>
          </div>

          <div className='single-extra'>
            <input
              name='dinner'
              type='checkbox'
              id='dinner'
              checked={allowdinner}
              onChange={() => setAllowdinner(!allowdinner)}
            />
            <label htmlFor='dinner'>Dinner</label>
          </div>
          <div className='single-extra'>
            <input
              name='mess'
              type='checkbox'
              id='mess'
              checked={mess}
              onChange={() => setmess(!mess)}
            />
            <label htmlFor='mess'>Mess</label>
          </div>
        </div>
        {/* extras end */}
      </form>
    </section>
  );
}
