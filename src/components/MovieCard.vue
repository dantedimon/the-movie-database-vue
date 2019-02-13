<template>
    <v-card hover :to="'/movie/' + data.id">
        <v-img :src="poster">
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

        <v-divider></v-divider>

        <v-list two-line dense class="py-0">
            <v-list-tile>
                <v-list-tile-content>
                    <v-list-tile-title>
                        <strong>{{data.title}}</strong>
                    </v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                    <v-layout column justify-center>
                        <v-icon color="amber">star</v-icon>
                        <v-list-tile-action-text class="text-xs-center">{{ data.vote_average }}
                        </v-list-tile-action-text>
                    </v-layout>
                </v-list-tile-action>

                <v-list-tile-action>
                    <v-layout column justify-center>
                        <v-icon color="blue">poll</v-icon>
                        <v-list-tile-action-text class="text-xs-center">{{ popularity }}</v-list-tile-action-text>
                    </v-layout>
                </v-list-tile-action>
            </v-list-tile>
        </v-list>
    </v-card>
</template>

<script>
    import MovieAPI from '../plugins/MovieAPI'

    export default {
        name: "MovieCard",
        props: {
            data: {
                type: Object,
                default: () => ({})
            }
        },
        computed: {
            poster () {
                return this.hasPoster
                    ? MovieAPI.apiForImg + this.data.poster_path
                    : ''
            },

            hasPoster () {
                return !!this.data.poster_path
            },

            popularity () {
                return Math.ceil(this.data.popularity)
            }
        }
    }
</script>