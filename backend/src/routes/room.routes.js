const router = require('express').Router();
const roomImageUpload = require('../middleware/room.image.upload');
const { isAuthenticatedUser, isAdmin } = require('../middleware/app.authentication');

const {
  createRoom, getRoomsList, getRoomByIdOrSlugName, editRoomByAdmin, deleteRoomById, getFeaturedRoomsList,
  createHostel,
  getHostelsList,
  getHostelByIdOrSlugName,
  editHostelByAdmin,
  deleteHostelById,
  getFeaturedHostelList
} = require('../controllers/room.controllers');

// route for create new room
router.route('/create-room').post(isAuthenticatedUser, isAdmin, roomImageUpload.array('room_images', 5), createRoom);
router.route('/create-hostel').post(isAuthenticatedUser, isAdmin, roomImageUpload.array('hostel_images', 5), createHostel);

// routes for get all, single and featured rooms list
router.route('/all-rooms-list').get(getRoomsList);
router.route('/all-hostel-list').get(getHostelsList);
router.route('/get-room-by-id-or-slug-name/:id').get(getRoomByIdOrSlugName);
router.route('/get-hostel-by-id-or-slug-name/:id').get(getHostelByIdOrSlugName);
router.route('/featured-rooms-list').get(getFeaturedRoomsList);
router.route('/featured-hostel-list').get(getFeaturedHostelList);

// routes for edit and delete room by admin
router.route('/edit-room/:id').put(isAuthenticatedUser, isAdmin, roomImageUpload.array('room_images', 5), editRoomByAdmin);
router.route('/edit-hostel/:id').put(isAuthenticatedUser, isAdmin, roomImageUpload.array('hostel_images', 5), editHostelByAdmin);
router.route('/delete-room/:id').delete(isAuthenticatedUser, isAdmin, deleteRoomById);
router.route('/delete-hostel/:id').delete(isAuthenticatedUser, isAdmin, deleteHostelById);

module.exports = router;

