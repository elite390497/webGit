<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('calendar.anniversary')}} 
                        <span class="card-subtitle" v-if="anniversaries.total"><span class="d-none d-sm-inline">{{ trans('general.total_result_found',{count: anniversaries.total, from: anniversaries.from, to: anniversaries.to}) }}</span></span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline"> {{trans('general.filter')}}</span></button>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/calendar/celebration/birthday')"><i class="fas fa-birthday-cake"></i> {{trans('calendar.birthday')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="$router.push('/calendar/celebration/work/anniversary')"><i class="fas fa-gift"></i> {{trans('calendar.work_anniversary')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card border-left border-bottom" v-if="showFilterPanel">
                    <div class="card-body p-4">
                        <h4 class="card-title">{{trans('general.filter')}}
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger btn-sm pull-right">{{trans('general.cancel')}}</button>
                        </h4>
                        <div class="row">
                            <div class="col-12 col-sm-8">
                                <div class="form-group">
                                    <date-range-picker :start-date.sync="filter.start_date" :end-date.sync="filter.end_date" :label="trans('general.date_between')"></date-range-picker>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-info waves-effect waves-light pull-right" @click="getAnniversaries">{{trans('general.filter')}}</button>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <h6 class="p-3" v-if="filter.start_date && filter.end_date">{{trans('calendar.anniversary_between', {start_date: showDate(filter.start_date), end_date : showDate(filter.end_date)})}}</h6>
                    <div class="table-responsive" v-if="anniversaries.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('employee.date_of_anniversary')}}</th>
                                    <th>{{trans('employee.name')}}</th>
                                    <th>{{trans('employee.code')}}</th>
                                    <th>{{trans('employee.designation')}}</th>
                                    <th>{{trans('employee.contact_number')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="anniversary in anniversaries.data">
                                    <td>{{anniversary.date_of_anniversary | moment}} ({{getCount(anniversary.date_of_anniversary)+' '+trans('general.years')}})</td>
                                    <td>{{getEmployeeName(anniversary)}}</td>
                                    <td>{{getEmployeeCode(anniversary)}}</td>
                                    <td>{{getEmployeeDesignationOnDate(anniversary)}}</td>
                                    <td>{{anniversary.contact_number}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!anniversaries.total" module="calendar" title="anniversary_module_title" description="anniversary_module_description" icon="list"></module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="anniversaries" @updateRecords="getAnniversaries"></pagination-record>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components : { },
        data() {
            return {
                anniversaries: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'date',
                    order: 'asc',
                    start_date: '',
                    end_date: '',
                    page_length: helper.getConfig('page_length')
                },
                showFilterPanel: false,
            };
        },
        mounted(){
            if(!helper.hasPermission('list-anniversary')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }
            this.getAnniversaries();
            helper.showDemoNotification(['calendar']);
        },
        created(){
            this.filter.start_date = helper.today();
            this.filter.end_date = moment().add(1, 'weeks').format('YYYY-MM-DD');
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeCode(employee){
                return helper.getEmployeeCode(employee);
            },
            getCount(date){
                return moment().diff(date, 'years');
            },
            getEmployeeDesignationOnDate(employee){
                return helper.getEmployeeDesignationOnDate(employee, helper.today());
            },
            getAnniversaries(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                this.filter.start_date = helper.toDate(this.filter.start_date);
                this.filter.end_date = helper.toDate(this.filter.end_date);
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/anniversary?page=' + page + url)
                    .then(response => {
                        this.anniversaries = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/anniversary/print',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        let print = window.open("/print");
                        print.document.write(response);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            pdf(){
                let loader = this.$loading.show();
                axios.post('/api/anniversary/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            showDate(date){
                return helper.formatDate(date);
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
                this.getAnniversaries();
            },
            'filter.order': function(val) {
                this.getAnniversaries();
            },
            'filter.page_length': function(val) {
                this.getAnniversaries();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
