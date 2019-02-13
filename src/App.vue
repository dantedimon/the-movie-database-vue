<template>
    <v-app>
        <v-toolbar app>
            <v-toolbar-title class="headline text-uppercase">
                <span>THE MOVIE DATABASE</span>
            </v-toolbar-title>
        </v-toolbar>

        <v-content>
            <router-view />
        </v-content>

        <v-footer
                height="auto"
                class="teal"
        >
            <v-layout
                    justify-center
                    row
                    wrap
            >
                <v-flex
                        py-3
                        text-xs-center
                        white--text
                        xs12
                >
                    &copy;{{currentYear}} — <strong>dantedimon</strong>
                </v-flex>
            </v-layout>
        </v-footer>
    </v-app>
</template>

<script>
    export default {
        name: 'App',
        components: {},
        data () {
            return {
                //
            }
        },
        computed: {
            currentYear () {
                return new Date().getFullYear()
            }
        }
    }
</script>
