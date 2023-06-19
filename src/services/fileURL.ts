import { baseURL } from "./api";


export function fileUrl(imageName: string) {
    return baseURL + '/files/' + imageName
}
