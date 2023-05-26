<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('resource.syllabus')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="syllabuses.total">{{trans('general.total_result_found',{count : syllabuses.total, from: syllabuses.from, to: syllabuses.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="syllabuses.total && hasPermission('create-syllabus')" @click="$router.push('/resource/syllabus/create')" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('resource.add_new_syllabus')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'resource.syllabus'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showFilterPanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('general.filter')}}</h4>
                        <div class="row">
                            <div class="col-12 col-sm-3">
                                <div class="form-group">
                                    <label for="">{{trans('academic.batch')}}</label>
                                    <v-select label="name" track-by="id" group-values="batches" group-label="course_group" :group-select="false" v-model="selected_batches" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onBatchRemove" :selected="selected_batches">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getSyllabuses">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="syllabuses.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.subject')}}</th>
                                    <th>{{trans('academic.batch')}}</th>
                                    <th>{{trans('resource.syllabus_title')}}</th>
                                    <th>{{trans('resource.syllabus_created_by')}}</th>
                                    <th>{{trans('general.created_at')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="syllabus in syllabuses.data">
                                    <td v-text="syllabus.subject.name+' ('+syllabus.subject.code+')'"></td>
                                    <td v-text="syllabus.subject.batch.course.name+' '+syllabus.subject.batch.name"></td>
                                    <td v-text="syllabus.title"></td>
                                    <td>{{getEmployeeName(syllabus.employee)}} <br > {{getEmployeeDesignationOnDate(syllabus.employee, syllabus.start_date)}}</td>
                                    <td>{{syllabus.created_at | momentDateTime}}</td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <a target="_blank" :href="`/resource/syllabus/${syllabus.uuid}/print?token=${authToken}`" v-tooltip="trans('general.print')" class="btn btn-secondary btn-sm">
                                                <i class="fas fa-print"></i>
                                            </a>
                                            <button class="btn btn-success btn-sm" v-tooltip="trans('resource.view_syllabus')" @click.prevent="showAction(syllabus)"><i class="fas fa-arrow-circle-right"></i></button>
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-syllabus')" v-tooltip="trans('resource.edit_syllabus')" @click.prevent="editSyllabus(syllabus)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-syllabus')" :key="syllabus.id" v-confirm="{ok: confirmDelete(syllabus)}" v-tooltip="trans('resource.delete_syllabus')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!syllabuses.total" module="resource" title="syllabus_module_title" description="syllabus_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="hasPermission('create-syllabus')" @click="$router.push('/resource/syllabus/create')"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="syllabuses" @updateRecords="getSyllabuses"></pagination-record>
                </div>
            </div>
        </div>
        <syllabus-detail v-if="showModal" @close="showModal = false" :uuid="showUuid"></syllabus-detail>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import syllabusForm from './form'
    import syllabusDetail from './show'

    export default {
        components : { syllabusForm,syllabusDetail},
        data() {
            return {
                syllabuses: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'created_at',
                    order: 'desc',
                    topic: '',
                    batch_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'created_at',
                        translation: i18n.general.created_at
                    }
                ],
                batches: [],
                selected_batches: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: '',
                showUuid: '',
                showModal: false
            };
        },
        mounted(){
            if(!helper.hasPermission('list-syllabus')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getSyllabuses();
            helper.showDemoNotification(['resource']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            showAction(syllabus){
                this.showUuid = syllabus.uuid;
                this.showModal = true;
            },
            getEmployeeName(employee){
                return helper.getEmployeeName(employee);
            },
            getEmployeeDesignationOnDate(employee, date){
                return helper.getEmployeeDesignationOnDate(employee, date);
            },
            getSyllabuses(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/syllabus?page=' + page + url)
                    .then(response => {
                        this.syllabuses = response.syllabuses;
                        this.batches = response.filters.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editSyllabus(syllabus){
                this.$router.push('/resource/syllabus/'+syllabus.uuid+'/edit');
            },
            confirmDelete(syllabus){
                return dialog => this.deleteSyllabus(syllabus);
            },
            deleteSyllabus(syllabus){
                let loader = this.$loading.show();
                axios.delete('/api/syllabus/'+syllabus.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        this.getSyllabuses();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config)
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/syllabus/print',{filter: this.filter})
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
                axios.post('/api/syllabus/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id.push(selectedOption.id);
            },
            onBatchRemove(removedOption){
                this.filter.batch_id.splice(this.filter.batch_id.indexOf(removedOption.id), 1);
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
            'filter.sort_by': function(val){
                this.getSyllabuses();
            },
            'filter.order': function(val){
                this.getSyllabuses();
            },
            'filter.page_length': function(val){
                this.getSyllabuses();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>