const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the prodict name"],
        trim: true,
        maxLength: [100, "Length can't exceed 100 characters"]
    },
    images: [
        {
            image: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter the category type"],
        enum: {
            values: [
                'pencil sketch',
                'color sketch',
                'digital art', ,
                'vector art',
                'smudge art'
            ],
            message: "Please select correct category"
        }
    },
    price: {
        type: Number,
        required: [true, "please enter product price"],
    },
    description: {
        type: String,
        required: [true, "please enter product description"]
    },
    ratings: {
        type: String,
        default: 0
    },
    stock: {
        type: String,
        required: [true, "Please enter the stock value"]
    },
    quantity: {
        type: String,
        required: [true, "Please enter the stock value"]
    },
    Artist: {
        type: String,
        required: [true, "please select Artist"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    numofReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: mongoose.Schema.Types.ObjectId,

            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]

})

let Schema = mongoose.model('Products', productSchema)

module.exports = Schema 