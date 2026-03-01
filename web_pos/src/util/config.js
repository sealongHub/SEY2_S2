// frontend/src/Config.js
export default {
    base_url: import.meta.env.VITE_API_URL || 'https://sey2-s2.onrender.com/api/',
    
    // កែមកបែបនេះ (ដក api/ ចេញ)
    imgPath: import.meta.env.VITE_IMG_PATH || 'https://sey2-s2.onrender.com/storage/',
}
// export default {
//     base_url : 'http://localhost:8000/api/',
//     imgPath : 'http://localhost:80/SEY2_S2/laravel-api/public/storage/',
// }