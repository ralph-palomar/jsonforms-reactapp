import axios from 'axios';

const config = {
    headers: {
        'X-API-Key': process.env.REACT_APP_PERSISTENCE_API_KEY 
    }
};

export function postData(collection: any, data: any) {
    return axios.post(process.env.REACT_APP_PERSISTENCE_API_BASE_URL+'/save?collection='+collection, data, config);
}

export function getAllData(collection: any) {
    return axios.get(process.env.REACT_APP_PERSISTENCE_API_BASE_URL+'/retrieve?collection='+collection, config);
}