// frontend/src/Config.js
export default {
    base_url: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    imgPath: process.env.REACT_APP_IMG_PATH || 'http://localhost:8000/storage/',
}
// export default {
//     base_url : 'http://localhost:8000/api/',
//     imgPath : 'http://localhost:80/SEY2_S2/laravel-api/public/storage/',
// }