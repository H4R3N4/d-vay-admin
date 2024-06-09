import { io } from "socket.io-client";
import Cookies from 'js-cookie';


const token = Cookies.get('token')

export const socket = io('http://localhost:8080', {
  transportOptions: {
    polling: {
      extraHeaders: {
        'token': token
      }
    }
  }
});