// import axios from 'axios';
// import Config from './Config';

// export const request = (url="", method="", data={}) => {
//     let headers = {
//         Accept : 'application/json',
//         "Content-Type" : 'application/json',
//     }

//     if(data instanceof FormData){
//         headers = {
//             Accept : 'application/json',
//             "Content-Type" : 'multipart/form-data',
//         }
//     }
//     return axios ({
//         url : Config.base_url + url,
//         method : method,
//         data : data,
//         ...headers
//     }).then(res => {
//         return res.data;
//     }).catch((error) => {
//         const respsonse = error.response;

//         if(respsonse){
//             const status = respsonse.status;
//             const data = respsonse.data;
//             let error = {};

//             if(data.errors){
//                 Object.keys(data.errors).map((key) => {
//                     error[key] = {
//                         validateStatus : "error",
//                         help : data.errors[key][0],
//                         hasFeedback : true
//                     }
//                 })
//             }
        
//             return {
//                 status : status,
//                 errors : error,
//             }
//         }
//     })
// }
import axios from "axios"; // គួរប្រើការ import បែបធម្មតា
import Config from "/src/util/config.js";

export const request = (url = "", method = "get", data = {}) => {
    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    // បើកូដជា FormData (សម្រាប់ upload រូបភាព) ត្រូវដូរ Content-Type
    if (data instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }

    return axios({
        url: Config.base_url + url,
        method: method,
        data: data,
        headers: headers, // បញ្ជាក់៖ ត្រូវដាក់ក្នុង Key ឈ្មោះ "headers"
    }).then(res => {
        return res.data;
    }).catch((error) => {
        const response = error.response; // កែអក្ខរាវិរុទ្ធពី respsonse មក response

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
        // ករណី Server ងាប់ ឬបាត់បង់ការតភ្ជាប់ (Network Error)
        return { status: 500, errors: { message: "Network Error or Server is down" } };
    });
};