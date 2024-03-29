import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

import { signOut } from '../contexts/AuthContext';


export const baseURL ='http://192.168.15.153:3001';

export function setupAPIClient(ctx = undefined) {
    let cookies = parseCookies(ctx);

    const api = axios.create({ 
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${cookies['@nextauth.token']}`
        }
    })

    api.interceptors.response.use(response => {
        return response
    }, (error: AxiosError) => {
        if (error.response.status === 401) {
            //qualquer erro 401 (não autorizado) devemos desloga o usuario
            if (typeof window !== undefined) {
                //Chama a função para deslogar o usuario
                signOut();
            } else {
                return Promise.reject(new AuthTokenError())
            }
        }

        return Promise.reject(error)
    })

    return api
}