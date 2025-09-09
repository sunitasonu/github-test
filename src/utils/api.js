import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL; // ⬅️ Defined in .env file

// ✅ POST request (for login or other form submissions)
// export const postData = async (url, formData) => {
//   try {
//     const response = await axios.post(apiUrl + url, formData, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     return error.response?.data || { success: false, msg: 'Request failed' };
//   }
// };


export const postData = async (url, formData) => {
  try {
    const response = await axios.post(apiUrl + url, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    // Always return consistent structure
    return {
      success: false,
      result:
        error.response?.data?.result || "Something went wrong. Please try again.",
        status: error.response?.status || 500,
    };
  }
};



// ✅ GET request
// export const fetchData = async (url) => {
//   try {
//     const response = await axios.get(apiUrl + url, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     return error.response?.data || { success: false, msg: 'Request failed' };
//   }
// };

export const fetchData = async (url, options = {}) => {
  try {
    const response = await axios.get(apiUrl + url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, msg: 'Request failed' };
  }
};





// ✅ PUT request
export const updateData = async (url, updateData) => {
  try {
    const response = await axios.put(apiUrl + url, updateData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, msg: 'Update failed' };
  }
};




// ✅ DELETE request
export const deleteData = async (url) => {
  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, msg: 'Delete failed' };
  }
};




// ✅ Upload file (multipart/form-data)
export const uploadFile = async (url, fileData) => {
  try {
    const response = await axios.post(apiUrl + url, fileData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, msg: 'Upload failed' };
  }
};
