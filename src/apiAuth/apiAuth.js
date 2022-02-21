import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import apiConfig from '../config/config';
import deviceStorage from '../services/deviceStorage';


const client = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
        Accept: 'application/json',
        Authorization: deviceStorage.getToken()
    },
});

// const client = () => {
//     loginClient.defaults.headers.common.Authorization = getAccessToken();
//     return loginClient;
// };

export default client;

function getUrl(config) {
    if (config.baseURL) {
        return config.url.replace(config.baseURL, '');
    }
    return config.url;
}
// Intercept all requests
client.interceptors.request.use(
    config => {
        console.log(`%c ${config.method.toUpperCase()} - ${getUrl(config)}:`, 'color: #0086b3; font-weight: bold', config);
        return config;
    }, error => Promise.reject(error));

// Intercept all responses
client.interceptors.response.use(
    async response => {
        if (response.status === 401) {
            try {
                const value = await AsyncStorage.getItem('token');
                if (value !== null) {
                    // We have data!!
                    AsyncStorage.clear();
                    NavigationService.navigate('AuthStackScreen');
                }
            } catch (error) {
                // Error retrieving data
                console.log(error, 'logged in client error');
            }
        } console.log(`%c ${response.status} - ${getUrl(response.config)}:`, 'color: #008000; font-weight: bold', response); return response;
    },
    error => {
        console.log(error, 'error console');
        if (error.response.status === 429) {
            Alert.alert('Too many requests. Please try again later.');
        } console.log(`%c ${error.response.status} - ${getUrl(error.response.config)}:`, 'color: #a71d5d; font-weight: bold', error.response);
        return Promise.reject(error);
    });