"use client"
import axios from "axios";
import { parseCookies } from "nookies"
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 422) {
        return Promise.reject(error.response.data)
    }
    return Promise.reject(error);
});


axios.interceptors.request.use(function (response) {
    const cookieList = parseCookies()
    if (cookieList.token) {
        response.headers.set("Authorization", `Bearer ${cookieList.token}`)
    }
    return response;
}, function (error) {
    if (error.response.status === 422) {
        return Promise.reject(error.response.data)
    }
    return Promise.reject(error);
});

export default axios