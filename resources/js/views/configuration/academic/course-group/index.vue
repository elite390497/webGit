<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.course_group')}}
                        <span class="card-subtitle d-none d-sm-inline" v-if="course_groups.total">{{trans('general.total_result_found',{count : course_groups.total, from: course_groups.from, to: course_groups.to})}}</span>
                        <span class="card-subtitle d-none d-sm-inline" v-else>{{trans('general.no_result_found')}}</span>
                    </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" v-if="course_groups.total && !showCreatePanel" @click="showCreatePanel = !showCreatePanel" v-tooltip="trans('general.add_new')"><i class="fas fa-plus"></i> <span class="d-none d-sm-inline">{{trans('academic.add_new_course_group')}}</span></button>
                        <button class="btn btn-info btn-sm" v-if="course_groups.total" @click="showReorderModal = true" v-tooltip="trans('academic.reorder_course_group')"><i class="fas fa-arrows-alt"></i> <span class="d-none d-sm-inline">{{trans('academic.reorder_course_group')}}</span></button>
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
                        <help-button @clicked="help_topic = 'configuration.academic.course-group'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <transition name="fade">
                <div class="card card-form" v-if="showCreatePanel">
                    <div class="card-body">
                        <h4 class="card-title">{{trans('academic.add_new_course_group')}}</h4>
                        <course-group-form @completed="getCourseGroups" @cancel="showCreatePanel = !showCreatePanel"></course-group-form>
                    </div>
                </div>
            </transition>
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive" v-if="course_groups.total">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>{{trans('academic.course_group_name')}}</th>
                                    <th>{{trans('academic.course')}}</th>
                                    <th>{{trans('academic.course_group_description')}}</th>
                                    <th class="table-option">{{trans('general.action')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="course_group in course_groups.data">
                                    <td>
                                        {{course_group.name}}
                                    </td>
                                    <td>
                                        <ul style="list-style:none;padding:0;margin:0;">
                                            <li v-for="course in course_group.courses">{{course.name}}</li>
                                        </ul>
                                    </td>
                                    <td v-text="course_group.description"></td>
                                    <td class="table-option">
                                        <div class="btn-group">
                                            <button class="btn btn-info btn-sm" v-tooltip="trans('academic.edit_course_group')" @click.prevent="editCourseGroup(course_group)"><i class="fas fa-edit"></i></button>
                                            <button class="btn btn-danger btn-sm" :key="course_group.id" v-confirm="{ok: confirmDelete(course_group)}" v-tooltip="trans('academic.delete_course_group')"><i class="fas fa-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <module-info v-if="!course_groups.total" module="academic" title="course_group_module_title" description="course_group_module_description" icon="list">
                        <div slot="btn">
                            <button class="btn btn-info btn-md" v-if="!showCreatePanel" @click="showCreatePanel = !showCreatePanel"><i class="fas fa-plus"></i> {{trans('general.add_new')}}</button>
                        </div>
                    </module-info>
                    <pagination-record :page-length.sync="filter.page_length" :records="course_groups" @updateRecords="getCourseGroups" @change.native="getCourseGroups"></pagination-record>
                </div>
            </div>
        </div>

        <transition name="modal" v-if="showReorderModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('academic.reorder_course_group')}}
                                <span class="float-right pointer" @click="showReorderModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <draggable v-model="list" @start="drag=true" @end="drag=false" class="list-group">
                                    <div class="list-group-item pointer" v-for="item in list" :key="item.id"><i class="fas fa-arrows-alt"></i> {{item}}</div>
                                </draggable>
                                <button type="button" class="btn btn-info pull-right m-t-10" @click="reorderCourseGroup">{{trans('general.save')}}</button>
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
    import courseGroupForm from './form'

    export default {
        components : { courseGroupForm },
        data() {
            return {
                course_groups: {
                    total: 0,
                    data: []
                },
                filter: {
                    sort_by : 'position',
                    order: 'asc',
                    page_length: helper.getConfig('page_length')
                },
                orderByOptions: [
                    {
                        value: 'position',
                        translation: i18n.academic.course_group_order
                    },
                    {
                        value: 'name',
                        translation: i18n.academic.course_group_name
                    }
                ],
                showCreatePanel: false,
                showReorderModal: false,
                list: [],
                help_topic: ''
            };
        },
        mounted(){
            if(!helper.hasPermission('access-configuration')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getCourseGroups();
        },
        methods: {
            getCourseGroups(page){
                let loader = this.$loading.show();
                if (typeof page !== 'number') {
                    page = 1;
                }
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/academic/course/group?page=' + page + url)
                    .then(response => {
                        this.list = [];
                        this.course_groups = response;
                        this.course_groups.data.forEach(course_group => {
                            this.list.push(course_group.name);
                        })
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            editCourseGroup(course_group){
                this.$router.push('/configuration/academic/course/group/'+course_group.id+'/edit');
            },
            confirmDelete(course_group){
                return dialog => this.deleteCourseGroup(course_group);
            },
            deleteCourseGroup(course_group){
                let loader = this.$loading.show();
                axios.delete('/api/academic/course/group/'+course_group.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.getCourseGroups();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config){
                return helper.getConfig(config);
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/academic/course/group/print',{filter: this.filter})
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
                axios.post('/api/academic/course/group/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            reorderCourseGroup(){
                axios.post('/api/academic/course/group/reorder',{list: this.list})
                    .then(response => {
                        toastr.success(response.message);
                        this.showReorderModal = false;
                        this.getCourseGroups();
                    })
                    .catch(error => {
                        helper.showErrorMsg(error);
                    })
            }
        },
        filters: {
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
            'filter.sort_by': function(val){
                this.getCourseGroups();
            },
            'filter.order': function(val){
                this.getCourseGroups();
            },
            'filter.page_length': function(val){
                this.getCourseGroups();
            }
        },
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
    }
</script>
