import axios from "axios"; 
import Config from "/src/util/config.js";

export const request = (url = "", method = "get", data = {}) => {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    
    if (data instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }

    return axios({
        url: Config.base_url + url,
        method: method,
        data: data,
        headers: headers, 
    }).then(res => {
        return res.data;
    }).catch((error) => {
        const response = error.response; 

        if (response) {
            const status = response.status;
            const responseData = response.data;
            let validationErrors = {};

            if (responseData.errors) {
                Object.keys(responseData.errors).forEach((key) => {
                    validationErrors[key] = {
                        validateStatus: "error",
                        help: responseData.errors[key][0],
                        hasFeedback: true
                    };
                });
            }

            return {
                status: status,
                errors: validationErrors,
            };
        }
       
        return { status: 500, errors: { message: "Network Error or Server is down" } };
    });
};