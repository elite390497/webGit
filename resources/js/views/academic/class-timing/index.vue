<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.class_timing')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="class_timings.total">{{trans('general.total_result_found',{count : class_timings.total, from: class_timings.from, to: class_timings.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="class_timings.total && hasPermission('create-class-timing')" @click="$router.push('/academic/class/timing/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_class_timing')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="filter.show_session = !filter.show_session">
                                    <span v-if="filter.show_session"><i class="fas fa-eye-slash"></i> {{trans('academic.hide_class_timing_session')}}</span>
                                    <span v-else><i class="fas fa-eye"></i> {{trans('academic.show_class_timing_session')}}</span>
                                </button>
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'academic.class-timing'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="class_timings.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.class_timing_name')}}</th>
                                    <th>{{trans('academic.class_timing_session')}}</th>
                                    <th>{{trans('academic.class_timing_duration')}}</th>
                                    <th>{{trans('academic.class_timing_description')}}</th>
                                    <th>{{trans('general.updated_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="class_timing in class_timings.data">
                                    <td v-text="class_timing.name"></td>
                                    <td>
                                        {{class_timing.session+' '+trans('academic.class_timing_session')}}
                                        <span v-if="class_timing.break"> + {{class_timing.break+' '+trans('academic.class_timing_break')}}</span>
                                    </td>
                                    <td>
                                        <template v-if="!filter.show_session">{{getStartTime(class_timing)+' '+trans('general.to')+' '+getEndTime(class_timing)}}</template>
                                        <template v-else>
                                            <ul style="list-style:none;padding:0;margin:0;">
                                                <li v-for="session in class_timing.class_timing_sessions">
                                                    {{session.name}} {{getSessionStartTime(session)+' '+trans('general.to')+' '+getSessionEndTime(session)}}
                                                </li>
                                            </ul>
                                        </template>
                                    </td>
                                    <td v-text="class_timing.description"></td>
                                    <td>{{class_timing.updated_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <template v-if="class_timing.timetable_allocations.length">
                                                <button class="btn btn-info btn-sm" v-if="hasPermission('edit-class-timing')" v-tooltip="trans('academic.class_timing_associated_with_timetable')"><i class="fas fa-lock"></i></button>
                                            </template>
                                            <template v-else>
                                                <button class="btn btn-info btn-sm" v-if="hasPermission('edit-class-timing')" v-tooltip="trans('academic.edit_class_timing')" @click.prevent="editClassTiming(class_timing)"><i class="fas fa-edit"></i></button>
                                                <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-class-timing')" :key="class_timing.uuid" v-confirm="{ok: confirmDelete(class_timing)}" v-tooltip="trans('academic.delete_class_timing')"><i class="fas fa-trash"></i></button>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!class_timings.total" module="academic" title="class_timing_module_title" description="class_timing_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('create-class-timing')" @click="$router.push('/academic/class/timing/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="class_timings" @updateRecords="getClassTimings"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    export default {
        components: {},
        data(){
            return {
                class_timings: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    show_session: false,
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.academic.class_timing_name
                    }
                ],
                showFilterPanel: false,
                help_topic: ''
            }
        },
        mounted(){
            if(!helper.hasPermission('list-class-timing')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getClassTimings();
            helper.showDemoNotification(['academic']);
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getClassTimings(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/class/timing?page=' + page + url)
                    .then(response => {
                        this.class_timings = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editClassTiming(class_timing){
                this.$router.push('/academic/class/timing/'+class_timing.uuid+'/edit');
            },
            confirmDelete(class_timing){
                return dialog => this.deleteClassTiming(class_timing);
            },
            deleteClassTiming(class_timing){
                let loader = this.$loading.show();
                axios.delete('/api/class/timing/'+class_timing.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getClassTimings();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/class/timing/print',{filter: this.filter})
                    .then(response => {
                        let print = window.open("/print");
                        loader.hide();
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/class/timing/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getStartTime(class_timing){
                return moment(class_timing.class_timing_sessions[0].start, 'HH:mm:ss').format('h:mm a');
            },
            getEndTime(class_timing){
                let session_count = class_timing.class_timing_sessions.length;
                return moment(class_timing.class_timing_sessions[session_count - 1].end, 'HH:mm:ss').format('h:mm a');
            },
            getSessionStartTime(session){
                return moment(session.start, 'HH:mm:ss').format('h:mm a');
            },
            getSessionEndTime(session){
                return moment(session.end, 'HH:mm:ss').format('h:mm a');
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
        watch: {
            'filter.sort_by': function(val) {
                this.getClassTimings();
            },
            'filter.order': function(val) {
                this.getClassTimings();
            },
            'filter.page_length': function(val) {
                this.getClassTimings();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>