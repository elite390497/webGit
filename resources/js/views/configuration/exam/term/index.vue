<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('exam.term')}} 
                        <span class="card-subtitle d-none d-sm-inline" v-if="terms.total">{{trans('general.total_result_found',{count : terms.total, from: terms.from, to: terms.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="terms.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('exam.add_new_term')}}</span></button>
                        <sort-by :order-by-options="orderByOptions" :sort-by="filter.sort_by" :order="filter.order" @updateSortBy="value => {filter.sort_by = value}"  @updateOrder="value => {filter.order = value}"></sort-by>
                        <button class="btn btn-info btn-sm" v-if="!showFilterPanel" @click="showFilterPanel = !showFilterPanel"><i class="fas fa-filter"></i> <span class="d-none d-sm-inline">{{trans('general.filter')}}</span></button>
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'configuration.exam.term'"></help-button>
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
                                    <label for="">{{trans('exam.term_name')}}</label>
                                    <input class="form-control" name="name" v-model="filter.name">
                                </div>
                            </div>
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <label for="">{{trans('academic.course_group')}}</label>
                                    <v-select label="name" track-by="id" v-model="selected_course_groups" name="course_group_id" id="course_group_id" :options="course_groups" :placeholder="trans('academic.select_course_group')" @select="onCourseGroupSelect" :multiple="true" :close-on-select="false" :clear-on-select="false" :hide-selected="true" @remove="onCourseGroupRemove" :selected="selected_course_groups">
                                        <div class="multiselect__option" slot="afterList" v-if="!course_groups.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getTerms">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('exam.add_new_term')}}</h4>
                        <term-form @completed="getTerms" @cancel="showCreatePanel = !showCreatePanel"></term-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="terms.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('exam.term_name')}}</th>
                                    <th>{{trans('academic.course_group')}}</th>
                                    <th>{{trans('exam.term_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="term in terms.data">
                                    <td v-text="term.name"></td>
                                    <td v-text="term.course_group.name"></td>
                                    <td v-text="term.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('exam.edit_term')" @click.prevent="editTerm(term)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="term.id" v-confirm="{ok: confirmDelete(term)}" v-tooltip="trans('exam.delete_term')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!terms.total" module="exam" title="term_module_title" description="term_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="terms" @updateRecords="getTerms" @change.native="getTerms"></pagination-record>
                </div>
            </div>
        </div>
        <right-panel :topic="help_topic"></right-panel>
    </div>
</template>


<script>
    import termForm from './form'

    export default {
        components : { termForm },
        data() {
            return {
                terms: {
                    total: 0,
                    data: []
                },
                filter: {
                    course_group_id: [],
                    name: '',
                    sort_by: 'position',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'position',
                        translation: i18n.general.position
                    },
                    {
                        value: 'name',
                        translation: i18n.exam.term_name
                    }
                ],
                course_groups: [],
                selected_course_groups: null,
                showFilterPanel: false,
                showCreatePanel: false,
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getTerms();
        },
        methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            getTerms(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/exam/term?page=' + page + url)
                    .then(response => {
                        this.terms = response.exam_terms;
                        this.course_groups = response.filters.course_groups;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editTerm(term){
                this.$router.push('/configuration/exam/term/'+term.id+'/edit');
            },
            confirmDelete(term){
                return dialog => this.deleteTerm(term);
            },
            deleteTerm(term){
                let loader = this.$loading.show();
                axios.delete('/api/exam/term/'+term.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getTerms();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/exam/term/print',{filter: this.filter})
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
                axios.post('/api/exam/term/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onCourseGroupSelect(selectedOption){
                this.filter.course_group_id.push(selectedOption.id);
            },
            onCourseGroupRemove(removedOption){
                this.filter.course_group_id.splice(this.filter.course_group_id.indexOf(removedOption.id), 1);
            },
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getTerms();
            },
            'filter.order': function(val){
                this.getTerms();
            },
            'filter.page_length': function(val){
                this.getTerms();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
