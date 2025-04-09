const { Room } = require('../models');

class RoomController {
  static async getAllRooms(req, res) {
    try {
      const rooms = await Room.findAll();
      res.status(200).json(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = RoomController;