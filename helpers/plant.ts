import axios from "axios";

const baseUrl = "https://my-api.plantnet.org";
const api = axios.create({
    baseURL: baseUrl
});

export default async function identifyPlant(image: Array<File>, src?: string) {
    const apiKey = process.env.EXPO_PUBLIC_PLANT_API_KEY;

    const formData = new FormData();

    formData.append('file', {
        uri: src,
        name: 'media',
        type: 'image/jpeg'
    } as any);

    // image.forEach((img, index) => {
    //     formData.append('image', img, "image");
    // });

    console.log("FormData:", formData);

    return await api.post("/v2/identify/all", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        params: {
            "api-key": apiKey,
            "include-related-images": true,
            "lang": "pt-br"
        }
    }).then(response => {
        return response;
    }).catch(error => {
        console.log("Error identifying plant:", error.message);
    });
}