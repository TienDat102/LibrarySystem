const mongoose = require('mongoose')
const User = require('./User')
const Book = require('./Books')

const borrowSchema = mongoose.Schema({


    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    },
    borrowDate: {
        type: Date,
        default: new Date('2024-01-01')
    },
    returnDate: {
        type: Date,
        default: new Date('2024-01-10')
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned', 'overdue'],
        default: 'borrowed'
    }
});
module.exports = mongoose.model('Borrow', borrowSchema);
