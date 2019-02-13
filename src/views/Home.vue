<template>
    <v-container grid-list-lg>
        <div class="page">
            <v-layout row wrap>
                <v-flex xs12>
                    <v-autocomplete
                            v-model="searchSelected"
                            :items="searchResults"
                            :loading="isSearching"
                            :search-input.sync="search"
                            @keyup="searchDelay"
                            item-text="original_title"
                            item-value="id"
                            label="Search"
                            placeholder="Start typing to search"
                            prepend-icon="search"
                            return-object
                            hide-details
                    ></v-autocomplete>
                </v-flex>

                <v-flex>
                    <v-select
                            :items="yearsList"
                            v-model="options.year"
                            box
                            label="Year"
                            hide-details
                    ></v-select>
                </v-flex>

                <v-flex>
                    <v-select
                            :items="sorts"
                            v-model="options.sort"
                            box
                            label="Sort by"
                            hide-details
                    ></v-select>
                </v-flex>

                <v-flex>
                    <v-select
                            :items="directions"
                            v-model="options.direction"
                            box
                            label="Direction"
                            hide-details
                    ></v-select>
                </v-flex>
            </v-layout>

            <v-data-iterator
                    :items="movies"
                    :pagination.sync="pagination"
                    content-tag="v-layout"
                    hide-actions
                    row
                    wrap
            >
                <v-flex
                        slot="item"
                        slot-scope="props"
                        xs12
                        sm6
                        md3
                >
                    <MovieCard :data="props.item" />
                </v-flex>
            </v-data-iterator>

            <div class="text-xs-center pt-3">
                <v-pagination
                        v-model="options.page"
                        :length="pages"
                        :total-visible="8"
                ></v-pagination>
            </div>
        </div>
    </v-container>
</template>

<script>
    /*eslint no-console: "error"*/

    import MovieAPI from '../plugins/MovieAPI'
    import MovieCard from '../components/MovieCard'

    import * as _ from 'lodash'

    export default {
        components: {MovieCard},
        watch: {
            options: {
                handler () {
                    this.handlePagination()
                },
                deep: true
            },

            searchSelected (v) {
                this.$router.push('/movie/' + v.id)
            }
        },
        data: () => ({
            movies: [],

            pagination: {
                descending: true,
                rowsPerPage: 20,
            },

            options: {
                direction: 'desc',
                sort: 'popularity',
                year: 2019,
                page: 1,
            },

            pages: 1,

            sorts: [
                {text: 'Popularity', value: 'popularity'},
                {text: 'Rating', value: 'rating'},
                {text: 'Release Date Descending', value: 'release_date'},
                {text: 'Title', value: 'original_title'}
            ],

            directions: [
                {text: 'Ascending', value: 'asc'},
                {text: 'Descending', value: 'desc'},
            ],

            searchResults: [],
            search: null,
            isSearching: false,

            searchSelected: null

        }),
        created () {
            this.getMovies()
        },
        methods: {
            async getMovies () {
                try {
                    let request = await MovieAPI.discover(this.options.page, this.options.sort + '.' + this.options.direction, this.options.year,);

                    this.movies = request.data.results;
                    this.pages = request.data.total_pages;
                } catch (err) {
                    console.log(err);
                }
            },

            async searchQuery () {
                if (this.search) {
                    this.isSearching = true;
                    let request = await MovieAPI.search(this.search);

                    this.searchResults = request.data.results;

                    this.isSearching = false;
                }

            },

            handlePagination () {
                this.getMovies();

                this.pagination.descending = this.options.direction === 'desc';

                switch (this.options.sort) {
                    case 'popularity':
                        this.pagination.sortBy = 'popularity';
                        break;
                    case 'rating':
                        this.pagination.sortBy = 'vote_average';
                        break;
                    case 'original_title':
                        this.pagination.sortBy = 'original_title';
                        break;
                }
            }
        },
        computed: {
            searchDelay () {
                return _.debounce(this.searchQuery, 500)
            },

            yearsList () {
                let arr = [];

                for (let i = 2019; i >= 1900; i--) {
                    arr.push(i)
                }

                return arr
            }
        }
    }
</script>

<style lang="scss">
    .page {
        max-width: 1200px;
        margin: 40px auto;
    }
</style>
