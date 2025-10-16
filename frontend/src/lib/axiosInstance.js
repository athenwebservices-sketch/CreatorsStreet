import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://as:3000',
  headers: {
    'x-api-key': process.env.REACT_APP_API_KEY, // Example of adding an Authorization header
    'Content-Type': 'application/json', // Set content type to JSON
    // Add other headers as needed
  },
});


console.log("Axios baseURL:", axiosInstance.defaults.baseURL); // Check the base URL here
export default axiosInstance;

