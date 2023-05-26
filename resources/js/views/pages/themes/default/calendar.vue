<template>
    <div>
        <div class="page-title">
            <div class="fix-width fix-width-mobile">
                <h2>{{ page.title }}</h2>
            </div>
        </div>

        <div v-if="page.body" class="fix-width fix-width-mobile p-t-80">
            <div class="page-body" v-html="page.body"></div>

            <full-calendar :events="events" :config="config"></full-calendar>
        </div>

        <template v-if="page.options">
            <row-blocks v-if="page.options.show_blocks" :blocks="blocks"></row-blocks>
            <row-articles v-if="page.options.show_latest_articles" :articles="articles"></row-articles>
        </template>
    </div>
</template>

<script>
    import RowBlocks from '@views/pages/partials/row-blocks'
    import RowArticles from '@views/pages/partials/row-articles'
    import { FullCalendar } from 'vue-full-calendar'

    export default {
        components: {
            RowBlocks,
            RowArticles,
            FullCalendar
        },
        data(){
            return {
                slug:this.$route.params.page,
                page: {},
                blocks: [],
                articles: {},
                events: [],
                config: {
                    defaultView: 'month',
                    firstDay: helper.getDayInInteger(this.getConfig('first_day_of_week') || 'monday'),
                    isRTL: this.getConfig('direction') == 'rtl' ? true : false,
                    eventRender: function(event, element) {
                        $(element).tooltip({title: event.title});     
                        if(event.icon){          
                            element.find(".fc-title").prepend(" <i class='fas fa-"+event.icon+"'></i> ");
                        }        
                    }
                }
            }
        },
        mounted(){
            this.getData();

            this.getEvents();

            helper.showDemoNotification(['frontend_calendar']);
        },
        methods: {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/calendar/content')
                    .then(response => {
                        this.page = response.page;
                        this.blocks = response.blocks;
                        this.articles = response.articles;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/');
                    })
            },
            getEvents(){
                axios.get('/api/frontend/calendar/event')
                    .then(response => {
                        response.holidays.forEach(holiday => {
                            this.events.push({
                                title: holiday.description,
                                start: helper.toDate(holiday.date),
                                icon: 'coffee',
                                color: 'teal'
                            })
                        })
                        response.events.forEach(event => {
                            this.events.push({
                                title: event.title,
                                start: helper.toDate(event.start_date),
                                end: helper.toDate(event.end_date),
                                icon: 'bullhorn',
                                color: 'purple'
                            })
                        })
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            },
            getConfig(config) {
                return helper.getConfig(config)
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
    }
</script>

<style>
    .fc-row .fc-content-skeleton tbody td.fc-event-container {
        padding: 0 10px;
    }
    .fc-day-grid-event {
        border-radius: 5px;
        margin-top: 2px;
        margin-bottom: 2px;
    }
    .fc-day-grid-event .fc-content {
      white-space: nowrap; 
      overflow: hidden;
      text-overflow: ellipsis;
    }
</style>