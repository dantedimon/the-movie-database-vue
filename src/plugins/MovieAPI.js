import axios from 'axios'

class MovieAPI {
    constructor () {
        this.apiUrl = 'https://api.themoviedb.org/3/';
        this.apiKey = 'af76764ddbbb7d31731b56103555ad39';
        this.apiForImg = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2';

        this.init();
    }

    init () {
        this.api = axios.create({
            baseURL: this.apiUrl
        })
    }

    discover (page, sortBy, year) {
        return this.api.get(`discover/movie?page=${page}&sort_by=${sortBy}&api_key=${this.apiKey}&year=${year}`)
    }

    search (query) {
        return this.api.get(`search/multi?api_key=${this.apiKey}&query=${query}`)
    }

    movie (id) {
        return this.api.get(`movie/${id}?api_key=${this.apiKey}`)
    }

    related (id) {
        return this.api.get(`movie/${id}/similar?api_key=${this.apiKey}`)
    }
}

export default new MovieAPI()