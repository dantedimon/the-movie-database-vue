<template>
    <v-container grid-list-lg fill-height>
        <div class="page" v-if="!loading">
            <v-layout row wrap>
                <v-flex xs12 sm6 md4>
                    <v-img :src="poster" height="550" class="elevation-5">
                        <v-layout
                                slot="placeholder"
                                fill-height
                                align-center
                                justify-center
                                ma-0
                        >
                            <v-progress-circular indeterminate color="grey"></v-progress-circular>
                        </v-layout>

                        <v-layout
                                v-if="!hasPoster"
                                fill-height
                                align-center
                                justify-center
                                ma-0
                        >
                            <v-chip>No poster available</v-chip>
                        </v-layout>
                    </v-img>
                </v-flex>

                <v-flex xs12 sm6 md8>
                    <v-card-title>
                        <v-btn icon to="/">
                            <v-icon>arrow_back</v-icon>
                        </v-btn>

                        <h1>{{movie.original_title}} ({{releaseYear}})</h1>
                    </v-card-title>

                    <v-subheader>Details</v-subheader>

                    <v-list two-line dense class="transparent py-0 inline-list">
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="amber" large>star</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <strong>{{ movie.vote_average }} / 10 ({{movie.vote_count}}) votes</strong>
                                </v-list-tile-title>

                                <v-list-tile-sub-title>
                                    Rating
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon color="blue" large>poll</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <strong>{{ popularity }}</strong>
                                </v-list-tile-title>

                                <v-list-tile-sub-title>
                                    Popularity
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon large>date_range</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <strong>{{releaseDate}}</strong>
                                </v-list-tile-title>

                                <v-list-tile-sub-title>
                                    Release Date
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>

                        <v-list-tile v-if="productionCountries">
                            <v-list-tile-action>
                                <v-icon large>location_on</v-icon>
                            </v-list-tile-action>

                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <strong>{{productionCountries}}</strong>
                                </v-list-tile-title>

                                <v-list-tile-sub-title>
                                    Production Countries
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>

                    <v-divider class="mx-3 mt-2" />

                    <template v-if="productionCompanies.length">
                        <v-subheader>Production Companies</v-subheader>

                        <v-list dense two-line class="transparent py-0 inline-list">
                            <v-list-tile v-for="comp in productionCompanies" :key="comp.id">
                                <v-list-tile-avatar>
                                    <img v-if="comp.logo_path" :src="comp.logo" alt="">
                                    <v-icon v-else large>business</v-icon>
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        <strong>{{ comp.name }}</strong>
                                    </v-list-tile-title>

                                    <v-list-tile-sub-title>
                                        Origin country {{comp.origin_country}}
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list>

                        <v-divider class="mx-3 mt-2" />
                    </template>

                    <v-subheader>Overview</v-subheader>

                    <v-card-text class="py-0">{{movie.overview}}</v-card-text>
                </v-flex>
            </v-layout>

            <h2 class="text-xs-center py-2">Similar movies</h2>

            <v-data-iterator
                    :items="related"
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
                        md4
                        lg3
                >
                    <MovieCard :data="props.item"></MovieCard>
                </v-flex>
            </v-data-iterator>

            <div class="text-xs-center pt-3" v-if="releasePagesLength">
                <v-pagination
                        v-model="pagination.page"
                        :length="releasePagesLength"
                ></v-pagination>
            </div>
        </div>

        <v-layout v-else justify-center align-center>
            <v-progress-circular
                    :size="70"
                    :width="7"
                    color="green"
                    indeterminate
            ></v-progress-circular>
        </v-layout>
    </v-container>
</template>

<script>
    import MovieAPI from '../plugins/MovieAPI'
    import Moment from 'moment'

    import MovieCard from '../components/MovieCard'

    export default {
        components: {
            MovieCard
        },
        props: {
            id: String
        },
        data: () => ({
            movie: {},
            loading: false,
            related: [],
            pagination: {
                rowsPerPage: 4
            },
        }),
        watch: {
            '$route': {
                handler () {
                    this.getMovie();
                    this.getSimilar();
                },
                immediate: true
            }
        },
        methods: {
            async getMovie () {
                try {
                    this.loading = true;
                    let response = await MovieAPI.movie(this.id);
                    this.movie = response.data;
                    this.loading = false;
                } catch (err) {
                    console.log(err);
                }
            },

            async getSimilar () {
                try {
                    let response = await MovieAPI.related(this.id);

                    this.related = response.data.results
                } catch (err) {
                    console.log(err);
                }
            }
        },

        computed: {
            poster () {
                return this.hasPoster
                    ? MovieAPI.apiForImg + this.movie.poster_path
                    : ''
            },

            hasPoster () {
                return !!this.movie.poster_path
            },

            popularity () {
                return Math.ceil(this.movie.popularity)
            },

            releaseYear () {
                return new Date(this.movie.release_date).getFullYear()
            },

            releaseDate () {
                return Moment(this.movie.release_date).format('LL');
            },

            productionCompanies () {
                return this.movie.production_companies.map((comp) => {
                    comp.logo = MovieAPI.apiForImg + comp.logo_path;

                    return comp
                })
            },

            productionCountries () {
                return this.movie.production_countries.map((country) => country.name).join(', ')
            },

            releasePagesLength () {
                return Math.ceil(this.related.length / 4)
            }
        }
    }
</script>

<style lang="scss">
    .inline-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
