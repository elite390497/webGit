<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('communication.my_notification')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="communications.total">{{trans('general.total_result_found',{count : communications.total, from: communications.from, to: communications.to})}}</span>
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
                    <div class="table-responsive" v-if="communications.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('communication.type')}}</th>
                                    <th>{{trans('communication.subject')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="communication in communications.data">
                                    <td>{{trans('communication.'+communication.type)}}</td>
                                    <td v-text="communication.subject"></td>
                                    <td>{{communication.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('general.view_detail')" @click.prevent="showAction(communication)"><i class="fas fa-arrow-circle-right"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <pagination-record :page-length.sync="filter.page_length" :records="communications" @updateRecords="getCommunications"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{communication.subject}}
                                <span class="float-right pointer" @click="showModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <div class="m-t-20" v-html="communication.body"></div>
                                <hr />
                                <p>
                                    <i class="far fa-clock"></i> <small>{{trans('general.created_at')}} {{communication.created_at | momentDateTime}}</small>
                                    <!-- <span class="pull-right">
                                        <i class="far fa-clock"></i> <small>{{trans('general.updated_at')}} {{communication.updated_at | momentDateTime}}</small>
                                    </span> -->
                                </p>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import communicationDetail from './show'

    export default {
        components : { communicationDetail},
        data() {
            return {
                communications: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    subject: '',
                    type: '',
                    start_date: '',
                    end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    },
                    {
                        value: 'subject',
                        translation: i18n.communication.subject
                    }
                ],
                types: [],
                help_topic: '',
                communication: {},
                showModal: false
            };
        },
        mounted(){
            this.getCommunications();
            helper.showDemoNotification(['communication']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            hasAnyPermission(permissions){
                return helper.hasAnyPermission(permissions);
            },
            showAction(communication){
                this.communication = communication;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getCommunications(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/notification?page=' + page + url)
                    .then(response => {
                        this.communications = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
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
                this.getCommunications();
            },
            'filter.order': function(val){
                this.getCommunications();
            },
            'filter.page_length': function(val){
                this.getCommunications();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>