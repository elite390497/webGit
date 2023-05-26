<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('communication.meeting')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="meetings.total">{{trans('general.total_result_found',{count : meetings.total, from: meetings.from, to: meetings.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="meetings.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('communication.meeting_title')}}</th>
                                    <th>{{trans('communication.meeting_duration')}}</th>
                                    <th>{{trans('communication.meeting_created_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="meeting in meetings.data">
                                    <td>
                                        {{meeting.title}}
                                        <span v-if="meeting.is_live" class="badge badge-success">{{trans('communication.live')}}</span>

                                        <span v-if="meeting.is_expired" class="badge badge-danger">{{trans('communication.expired')}}</span>
                                    </td>
                                    <td>
                                        {{meeting.date | moment}} <span v-if="meeting.start_time">{{meeting.start_time | momentTime }}</span> 
                                        <span v-if="meeting.end_time"> {{trans('general.to')}} 
                                        {{meeting.end_time | momentTime }}</span>
                                    </td>
                                    <td>{{getEmployeeName(meeting.user.employee)}} <br > {{getEmployeeDesignationOnDate(meeting.user.employee, meeting.date)}}</td>
                                    <td>{{meeting.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" @click.prevent="showMeeting(meeting)"><i class="fas fa-arrow-circle-right"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!meetings.total" module="communication" title="my_meeting_not_found_title" description="my_meeting_not_found_description" icon="list">
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="meetings" @updateRecords="getMeetings"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components : { },
        data() {
            return {
                meetings: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date',
                    order: 'desc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'date',
                        translation: i18n.communication.meeting_date
                    },
                    {
                        value: 'title',
                        translation: i18n.communication.meeting_title
                    }
                ],
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-meeting')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getMeetings();
            helper.showDemoNotification(['communication']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getMeetings(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/my-meeting?page=' + page + url)
                    .then(response => {
                        this.meetings = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            showMeeting(meeting){
                this.$router.push('/communication/meeting/'+meeting.uuid);
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
          },
          momentTime(time) {
            return helper.formatTime(time);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getMeetings();
            },
            'filter.order': function(val){
                this.getMeetings();
            },
            'filter.page_length': function(val){
                this.getMeetings();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>