<template>
    <div class="card widget events-widget">
        <div :class="['card-body', bodyClass]">
            <h4 class="card-title">
                {{trans('calendar.upcoming_events')}}
                <router-link v-if="viewMoreLink" :to="viewMoreLink" class="btn btn-default btn-sm">{{trans('general.view_more')}}</router-link>
            </h4>
            <a class="list-item" v-for="event in events" @click.prevent="showEvent(event)">
                <h5>{{event.title}}</h5>
                <div class="meta-data">
                    <span class="type">{{event.event_type.name}}</span>
                    <span class="location"><i class="fas fa-map-marker-alt"></i> {{event.venue}}</span>
                    <span class="date"><i class="far fa-clock"></i> {{event.start_date | moment}} <template v-if="event.start_time">{{event.start_time | momentTime}}</template> {{trans('general.to')}} {{event.end_date | moment}} <template v-if="event.end_time">{{event.end_time | momentTime}}</template></span>
                </div>
            </a>
        </div>
        <event-detail v-if="showEventModal" @close="showEventModal = false" :uuid="showEventUuid" :url="`/frontend/event/${showEventUuid}/detail`"></event-detail>
    </div>
</template>

<script>
    import EventDetail from '@views/calendar/event/show'

    export default {
        props: { 
            events: {
              type: Array,
              default: function () {
                return []
              }
            },
            bodyClass: String,
            viewMoreLink: String,
            source: {
                type: String,
                default: "dashboard"
            }
        },
        components: {
            EventDetail
        },
        data() {
            return {
                showEventModal: false
            }
        },
        methods: {
            showEvent(event){
                this.showEventUuid = event.uuid;
                this.showEventModal = true;
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          },
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
    }
</script>