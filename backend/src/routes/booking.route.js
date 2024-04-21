const router = require('express').Router();
const { isAuthenticatedUser, isBlocked, isAdmin } = require('../middleware/app.authentication');
const {
  placedBookingOrder, getBookingOrderByUserId, cancelSelfBookingOrder, getBookingOrderForAdmin, updatedBookingOrderByAdmin,
  placedHostelBookingOrder,
  getHostelBookingOrderByUserId,
  cancelSelfHostelBookingOrder,
  getHostelBookingOrderForAdmin,
  updatedHostelBookingOrderByAdmin
} = require('../controllers/booking.controllers');

// route for placed a room booking order
router.route('/placed-booking-order/:id').post(isAuthenticatedUser, isBlocked, placedBookingOrder);
router.route('/placed-hostelbooking-order/:id').post(isAuthenticatedUser, isBlocked, placedHostelBookingOrder);

// routes for a user get bookings list and cancel booking order
router.route('/get-user-booking-orders').get(isAuthenticatedUser, isBlocked, getBookingOrderByUserId);
router.route('/get-user-hostelbooking-orders').get(isAuthenticatedUser, isBlocked, getHostelBookingOrderByUserId);
router.route('/cancel-booking-order/:id').put(isAuthenticatedUser, isBlocked, cancelSelfBookingOrder);
router.route('/cancel-hostelbooking-order/:id').put(isAuthenticatedUser, isBlocked, cancelSelfHostelBookingOrder);

// routes for admin get all bookings list, rejected, approved and checkout placed order
router.route('/get-all-booking-orders').get(isAuthenticatedUser, isBlocked, isAdmin, getBookingOrderForAdmin);
router.route('/get-all-hostelbooking-orders').get(isAuthenticatedUser, isBlocked, isAdmin, getHostelBookingOrderForAdmin);
router.route('/updated-booking-order/:id').put(isAuthenticatedUser, isBlocked, isAdmin, updatedBookingOrderByAdmin);
router.route('/updated-hostelbooking-order/:id').put(isAuthenticatedUser, isBlocked, isAdmin, updatedHostelBookingOrderByAdmin);

module.exports = router;
