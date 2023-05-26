<template>
    <div>
        <div class="main-banner" v-if="page.id">
            <div id="sliderCarousel" class="carousel slide" data-ride="carousel">
                <ol class="carousel-indicators">
                    <template v-for="(slider,index) in page.options.sliders">
                        <li data-target="#sliderCarousel" :data-slide-to="index" :class="[$first(slider, page.options.sliders) ? 'active' : '']"></li>
                    </template>
                </ol>
                <div class="carousel-inner" v-if="page.options.has_slider">
                    <template v-for="slider in page.options.sliders">
                        <div :class="['carousel-item', $first(slider, page.options.sliders) ? 'active' : '']">
                            <img class="d-block w-100" :src="slider.image" :alt="slider.title">
                            <div class="carousel-caption d-none d-md-block">
                                <h2>{{slider.title}}</h2>
                                <p>{{slider.description}}</p>
                            </div>
                        </div>
                    </template>
                </div>

                <a class="carousel-control-prev" href="#sliderCarousel" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#sliderCarousel" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
        </div>

        <div class="fix-width fix-width-mobile p-t-80">
            <div class="row">
                <div class="col-12 col-md-6 col-lg-7">
                    <h2 class="display-7">{{ page.title }}</h2>
                    <div class="page-body" v-html="page.body"></div>
                </div>
                <div class="col-12 col-md-6 col-lg-5">
                    <events-list v-if="events.length" :events="events" class="frontend-widget m-b-0" view-more-link="/events"></events-list>
                </div>
            </div>
        </div>

        <template v-if="page.options">
            <row-blocks v-if="page.options.show_blocks" :blocks="blocks"></row-blocks>
            <row-articles v-if="page.options.show_latest_articles" :articles="articles"></row-articles>
        </template>
    </div>
</template>

<script>
    import EventsList from '@js/widgets/events-list'
    import RowBlocks from '@views/pages/partials/row-blocks'
    import RowArticles from '@views/pages/partials/row-articles'

    export default {
        components: {
            EventsList,
            RowBlocks,
            RowArticles
        },
        data(){
            return {
                showEventModal: false,
                page: {},
                events: [],
                blocks: [],
                articles: {},
            }
        },
        mounted(){
            this.getData();
            
            helper.showDemoNotification(['frontend_home']);
        },
        methods: {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/home/content')
                    .then(response => {
                        this.page = response.page;
                        this.events = response.events;
                        this.blocks = response.blocks;
                        this.articles = response.articles;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/login');
                    })
            },
        }
    }
</script>

<style lang="scss">
    .frontend-widget {
        background: #f5f6f7;
        border: 1px solid #eaebec;
        border-radius: 10px;
        padding: 20px 5px;

        &.card.widget .card-title {
            padding: 0 0.5rem 0.5rem;
        }
    }
</style>
