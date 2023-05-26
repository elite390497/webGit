<template>
    <div class="card card-box with-shadow event-card">
        <div class="card-body">
            <div class="event-info">
                <div class="event-schedule pull-left">
                    <span class="day">{{event.start_date | momentCustomGetDOM}}</span>
                    <span class="month">{{event.start_date | momentCustomGetMOY}}</span>
                </div>
                <p>
                    <span class="event-title">{{event.title}}</span>
                    <span class="meta-data text-muted">
                        <small class="type">{{event.event_type.name}}</small>
                        <small class="location"><i class="fas fa-map-marker-alt"></i> {{event.venue}}</small>
                        <small class="date"><i class="far fa-clock"></i> {{event.start_date | moment}} <template v-if="event.start_time">{{event.start_time | momentTime}}</template> {{trans('general.to')}} {{event.end_date | moment}} <template v-if="event.end_time">{{event.end_time | momentTime}}</template></small>
                    </span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: { 
            event: {
              type: Object,
              default: function () {
                return {}
              }
            },
        },
        methods: {
            getEmployeePhoto(employee){
                return '/' + employee.photo;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignation(employee, date){
                return helper.getEmployeeDesignation(employee, date);
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentTime(date) {
            return helper.formatTime(date);
          },
          momentCustomGetDOM(date) {
            return moment(date).format('Do');
          },
          momentCustomGetMOY(date) {
            return moment(date).format('MMM');
          },
        },
    }
</script>

<style scoped lang="scss">
    .card.event-card {
        opacity: 0.9;
        transition: all 0.3s ease-in-out;
        cursor: pointer;
        padding: 0;

        .event-info {
            .event-schedule {
                float: left;
                width: 100px;
                height: 100px;
                background: #e1e2e3;
                margin-right: 20px;
                text-align: center;
                padding-top: 10px;

                .day {
                    display: block;
                    font-size: 2rem;
                    font-weight: 500;
                }
                .month {
                    display: block;
                    font-weight: 500;
                }
            }
            p{
                padding-top: 15px;
                margin-bottom: 0;

                span {
                    display: block;

                    &.event-title{
                        font-size: 150%;
                        font-weight: 500;
                    }
                    &.meta-data{
                        font-size: 125%;
                    }
                    small + small {
                        margin-left: 0.5rem;
                    }
                }
            }
        }
    }
</style>