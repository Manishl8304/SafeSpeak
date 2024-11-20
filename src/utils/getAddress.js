import axios from "axios";

const getAddress = async ({ latitude, longitude }) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
    );

    // Check if the response contains the expected data
    if (response.data && response.data.display_name) {
      return response.data.display_name; // Return the display name if found
    } else {
      return "Address not found"; // Fallback if no address found
    }
  } catch (err) {
    return "Address not found"; // Fallback error message
  }
};

export default getAddress;
