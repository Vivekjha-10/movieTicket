import Show from "../models/Show.js"

// Function to check availability of selected seats for a movie show
const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) return false; 

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;

    } catch (error) {
        console.log(error.message);
        return false;
    }
}



export const createBooking = async (req, res) => {
    try {
        const {userId} = req.auth();
        const { showId, selectedSeats } = req.body; 
        const { origin } = req.headers; 

        //Check if the seat is available for the selected show
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);

        if (!isAvailable) {
            return res.json({ success: false, message: 'Selected seats are not available' });
        }

        //get the show data
        const showData = await Show.findById(showId).populate('movie');

        //Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map(seat => {
            showData.occupiedSeats[seat] = true; //mark the seat as occupied 
        })

        showData.markModified('occupiedSeats');
        await showData.save();  

        //Create a payment link using Razorpay

        res.json({ success: true, message: 'Booked successfully'});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        const { showId } = req.params;

        //get the show data
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats)
        res.json({ success: true, occupiedSeats});
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}   