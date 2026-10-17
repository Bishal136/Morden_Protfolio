const Message = require('../models/Message');

/**
 * @desc    Submit a direct contact message
 * @route   POST /api/messages
 * @access  Public (Rate limited)
 */
const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject && subject.trim() ? subject.trim() : 'General Inquiry',
      message: message.trim(),
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. Bishal will get back to you shortly.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all direct messages with unread counts
 * @route   GET /api/messages
 * @access  Private (Admin)
 */
const getAllMessages = async (req, res, next) => {
  try {
    const { filter } = req.query; // 'all', 'unread', 'read'

    let query = {};
    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter === 'read') {
      query.isRead = true;
    }

    const [messages, unreadCount, totalCount] = await Promise.all([
      Message.find(query).sort({ createdAt: -1 }),
      Message.countDocuments({ isRead: false }),
      Message.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: messages.length,
      totalCount,
      unreadCount,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single message details and mark as read
 * @route   GET /api/messages/:id
 * @access  Private (Admin)
 */
const getMessageById = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    if (!message.isRead) {
      message.isRead = true;
      await message.save();
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle message read/unread status
 * @route   PATCH /api/messages/:id/read
 * @access  Private (Admin)
 */
const toggleMessageRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    message.isRead = !message.isRead;
    await message.save();

    res.status(200).json({
      success: true,
      message: `Message marked as ${message.isRead ? 'read' : 'unread'}`,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a message
 * @route   DELETE /api/messages/:id
 * @access  Private (Admin)
 */
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  toggleMessageRead,
  deleteMessage,
};
