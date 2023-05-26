<template>
    <div>
        <div class="page-title">
            <div class="fix-width fix-width-mobile">
                <h2>{{ page.title }}</h2>
            </div>
        </div>

        <div v-if="page.body" class="fix-width fix-width-mobile p-t-80">
            <div class="page-body" v-html="page.body"></div>
        </div>

        <div class="fix-width fix-width-mobile p-y-80">
            <div class="row">
                <div class="col-12">
                    <div class="event-feed" v-if="events.total">
                        <div v-for="event in events.data" @click="showEvent(event)">
                            <event-card class="event-item" :event="event"></event-card>
                        </div>
                    </div>
                    <pagination-record :page-length.sync="filter.page_length" :records="events" @updateRecords="getEvents"></pagination-record>
                </div>
            </div>
        </div>
        <event-detail v-if="showEventModal" @close="showEventModal = false" :uuid="showEventUuid" :url="`/frontend/event/${showEventUuid}/detail`"></event-detail>
    </div>
</template>

<script>
    import EventCard from '@js/widgets/event-card'
    import EventDetail from '@views/calendar/event/show'

    export default {
        components: {
            EventCard,
            EventDetail
        },
        data(){
            return {
                page: {},
                events: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date_of_event',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
                showEventModal: false
            }
        },
        mounted(){
            this.getData();
            this.getEvents();
        },
        methods: {
            getData(){
                let loader = this.$loading.show();
                axios.get('/api/frontend/page/events/content')
                    .then(response => {
                        this.page = response.page;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);

                        if (error.response.status == 422)
                            this.$router.push('/');
                    })
            },
            getEvents(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/frontend/event/list?page=' + page + url)
                    .then(response => {
                        this.events = response.events;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            showEvent(event){
                this.showEventUuid = event.uuid;
                this.showEventModal = true;
            }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getEvents();
            },
            'filter.order': function(val){
                this.getEvents();
            },
            'filter.page_length': function(val){
                this.getEvents();
            }
        },
    }
</script>