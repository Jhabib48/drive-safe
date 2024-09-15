import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
    location: {
        type: String, 
        required: [true, "Please choose a location"]
    },
    pickUpDate: {
        type: String, 
        required: [true, "Please choose a location"]
    },
    dropOfDate: {
        type: String, 
        required: [true, "Please enter a drop off time"]
    },
    pickUpTime: {
        type: String, 
        required: [true, "Please enter a pick up time"]
    },
    dropOfTime: {
        type: String, 
        required: [true, "Please enter a drop of time"]
    },
    contactNumber: {
        type: String, 
        required: [true, "Please choose a location"],
        min: 10
    },
})

export const Rental = mongoose.model("Rental", rentalSchema);