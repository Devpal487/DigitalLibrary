import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


// export const HOST_URL = 'https://libapi.mssplonline.com:8139/';
export const HOST_URL = 'http://103.12.1.132:8156/';
//export const File_Preview = 'https://weblibraryfilepath.mssplonline.com:8130/'
export const File_Preview = 'https://adhyalibdoc.mssplonline.com:8130/'


const api = axios.create({
  baseURL: HOST_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const Bot_URL = 'http://103.12.1.132:8184/';
export const Chat = axios.create({
  baseURL: Bot_URL,
});

api.interceptors.request.use(
  (config) => {
    const uniqueId = sessionStorage.getItem('uniqueId');
       
    const removeQuotes = (str:any) => {
      if (typeof str === 'string') {
        return str.replace(/^"(.*)"$/, '$1'); 
      }
      return str;
    };
    
    const cleanedUniqueId = removeQuotes(uniqueId);
    
    if (cleanedUniqueId) {
      (config.headers as any)['UniqueId'] = cleanedUniqueId;
      (config.headers as any)['Accept'] = '*/*';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      
      Logout();
    }
    return Promise.reject(error);
  }
);

function Logout() {
  
  localStorage.clear();
  sessionStorage.clear();
  toast.success("Token expired. Logging out...");
  const navigate=useNavigate();
  navigate("/");
}


export default api;