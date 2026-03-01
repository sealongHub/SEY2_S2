import axios from 'axios';
import Config from './Config';

export const request = (url="", method="", data={}) => {
    let headers = {
        Accept : 'application/json',
        "Content-Type" : 'application/json',
    }

    if(data instanceof FormData){
        headers = {
            Accept : 'application/json',
            "Content-Type" : 'multipart/form-data',
        }
    }
    return axios ({
        url : Config.base_url + url,
        method : method,
        data : data,
        ...headers
    }).then(res => {
        return res.data;
    }).catch((error) => {
        const respsonse = error.response;

        if(respsonse){
            const status = respsonse.status;
            const data = respsonse.data;
            let error = {};

            if(data.errors){
                Object.keys(data.errors).map((key) => {
                    error[key] = {
                        validateStatus : "error",
                        help : data.errors[key][0],
                        hasFeedback : true
                    }
                })
            }
        
            return {
                status : status,
                errors : error,
            }
        }
    })
}