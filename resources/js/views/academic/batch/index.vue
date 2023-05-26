<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.batch')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="batches.total">{{trans('general.total_result_found',{count : batches.total, from: batches.from, to: batches.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="batches.total && !showCreatePanel && hasPermission('create-batch')" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_batch')}}</span></button>
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
                        <help-button @clicked="help_topic = 'academic.batch'"></help-button>
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
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <v-select label="name" track-by="id" group-values="courses" group-label="course_group" :group-select="false" v-model="selected_courses" name="course_id" id="course_id" :options="courses" :placeholder="trans('academic.select_course')" @select="onCourseSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseRemove" :selected="selected_courses">
                                        <div class="multiselect__option" slot="afterList" v-if="!courses.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getBatches">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade" v-if="hasPermission('create-batch')">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.add_new_batch')}}</h4>
                        <batch-form @completed="getBatches" @cancel="showCreatePanel = !showCreatePanel"></batch-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="batches.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.batch_name')}}</th>
                                    <th>{{trans('academic.course')}}</th>
                                    <th>{{trans('academic.max_strength')}}</th>
                                    <th>{{trans('academic.current_strength')}}</th>
                                    <th>{{trans('academic.roll_number_prefix')}}</th>
                                    <th>{{trans('academic.batch_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="batch in batches.data">
                                    <td v-text="batch.name"></td>
                                    <td v-text="batch.course.name"></td>
                                    <td v-text="batch.options ? batch.options.max_strength : getConfig('default_max_strength_per_batch')"></td>
                                    <td v-text="batch.student_records_count"></td>
                                    <td v-text="batch.options ? batch.options.roll_number_prefix : getConfig('default_roll_number_prefix')"></td>
                                    <td v-text="batch.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-if="hasPermission('edit-batch')" v-tooltip="trans('academic.edit_batch')" @click.prevent="editBatch(batch)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" v-if="hasPermission('delete-batch')" :key="batch.id" v-confirm="{ok: confirmDelete(batch)}" v-tooltip="trans('academic.delete_batch')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!batches.total" module="academic" title="batch_module_title" description="batch_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel && hasPermission('create-batch')" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="batches" @updateRecords="getBatches"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>

<script>
    import batchForm from './form'

    export default {
        components : { batchForm },
        data() {
            return {
                batches: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'name',
                    order: 'asc',
                    course_id: [],
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'name',
                        translation: i18n.academic.batch_name
                    }
                ],
                courses: [],
                selected_courses: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('list-batch')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getBatches();
            helper.showDemoNotification(['academic']);
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getBatches(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/batch?page=' + page + url)
                    .then(response => {
                        this.batches = response.batches;
                        this.courses = response.filters.courses;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editBatch(batch){
                this.$router.push('/academic/batch/'+batch.id+'/edit');
            },
            confirmDelete(batch){
                return dialog => this.deleteBatch(batch);
            },
            deleteBatch(batch){
                let loader = this.$loading.show();
                axios.delete('/api/batch/'+batch.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getBatches();
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
                axios.post('/api/batch/print',{filter: this.filter})
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
                axios.post('/api/batch/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCourseSelect(selectedOption){
                this.filter.course_id.push(selectedOption.id);
            },
            onCourseRemove(removedOption){
                this.filter.course_id.splice(this.filter.course_id.indexOf(removedOption.id), 1);
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
                this.getBatches();
            },
            'filter.order': function(val){
                this.getBatches();
            },
            'filter.page_length': function(val){
                this.getBatches();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>