<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.class_teacher')}} </h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
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
                        <help-button @clicked="help_topic = 'academic.class-teacher'"></help-button>
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
                            <div class="col-12 col-sm-4">
                                <div class="form-group">
                                    <switches class="m-t-10" v-model="filter.show_history" theme="bootstrap" color="success"></switches> {{trans('academic.show_class_teacher_history')}}
                                </div>
                            </div>
                        </div>

                        <div class="card-footer text-right">
                            <button type="button" @click="showFilterPanel = false" class="btn btn-danger">{{trans('general.cancel')}}</button>
                            <button type="button" class="btn btn-info waves-effect waves-light" @click="getDetail">{{trans('general.filter')}}</button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="card p-4">
                <div class="card-body font-80pc">
                    <form @submit.prevent="submit" @keydown="classTeacherForm.errors.clear($event.target.name)">
                        <fieldset v-for="course_group in course_groups" v-if="isRequired(course_group)" style="border:1px solid #f3f3f3;border-radius:0.25rem; margin-bottom:20px;padding:20px 0 5px 0;">
                            <legend style="border: 1px #f3f3f3 solid;margin-left: 20px;padding:5px 10px;width:auto;font-weight:500;font-size:16px;">{{course_group.name}}</legend>
                            <template v-for="course in course_group.courses" v-if="courseInFilterList(course.id)" class="m-b-20">
                                <h6 class="card-title font-weight-bold m-l-20">{{course.name}}</h6>
                                <div :class="['row p-3', batch.show ? 'hover' : '']" v-for="(batch, index) in classTeacherForm.batches" v-if="batch.course_id == course.id" @mouseover="showAction(index)" @mouseout="hideAction(index)" >
                                    <div class="col-12 col-sm-4">
                                        {{batch.name}}
                                        <span class="m-l-10" v-show="hasPermission('store-class-teacher')">
                                            <i class="fas fa-edit opaque-on-hover" style="cursor:pointer;" v-if="!batch.change" @click="showEditPanel(batch)"></i>
                                            <i class="fas fa-times-circle" style="cursor:pointer;" v-if="batch.change" @click="hideEditPanel(batch)"></i>
                                        </span>
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <span v-if="batch.class_teachers.length">
                                            {{getCurrentClassTeacherName(batch.class_teachers)}} 
                                            {{getCurrentClassTeacherDesignation(batch.class_teachers)}}
                                            <i class="fas fa-times-circle" v-show="batch.show" style="cursor:pointer;color:red;" :key="batch.class_teachers[0].id" v-confirm="{ok: confirmDelete(batch.class_teachers[0])}" v-tooltip="trans('academic.delete_class_teacher')" v-if="hasPermission('delete-class-teacher')"></i>
                                        </span>
                                        <span v-else>-</span>
                                    </div>
                                    <div class="col-12 col-sm-4" v-if="filter.show_history">
                                        <ul style="list-style:none;padding:0;margin:0;" v-if="batch.class_teachers.length">
                                            <li v-for="(class_teacher,idx) in batch.class_teachers">
                                                ({{idx+1}}) 
                                                {{getEmployeeName(class_teacher.employee)+' '+trans('general.from')}} {{class_teacher.date_effective | moment}} 
                                            </li>
                                        </ul>
                                        <span v-if="!batch.class_teachers.length">-</span>
                                    </div>

                                    <div class="col-12 my-4" v-if="batch.change">
                                        <div class="row">
                                            <div class="col-12 col-sm-4">
                                                <v-select label="name" v-model="batch.selected_employee" :name="getEmployeeFieldName(index)" :id="getEmployeeFieldName(index)" :options="class_teachers" :placeholder="trans('academic.select_class_teacher')" @select="onEmployeeSelect" @close="classTeacherForm.errors.clear(getEmployeeFieldName(index))" @remove="batch.employee_id = ''">
                                                <div class="multiselect__option" slot="afterList" v-if="!class_teachers.length">
                                                    {{trans('general.no_option_found')}}
                                                </div>
                                            </v-select>
                                                <show-error :form-name="classTeacherForm" :prop-name="getEmployeeFieldName(index)"></show-error>
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <datepicker v-model="batch.date_effective" :bootstrapStyling="true" :name="getDateEffectiveFieldName(index)" @selected="classTeacherForm.errors.clear(getDateEffectiveFieldName(index))" :placeholder="trans('academic.date_effective')"></datepicker>
                                                <show-error :form-name="classTeacherForm" :prop-name="getDateEffectiveFieldName(index)"></show-error> 
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <autosize-textarea v-model="batch.description" rows="1" :name="getDescriptionFieldName(index)" :placeholder="trans('academic.class_teacher_description')"></autosize-textarea>
                                                <show-error :form-name="classTeacherForm" :prop-name="getDescriptionFieldName(index)"></show-error>     
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr v-if="!$last(course, course_group.courses)" />
                            </template>
                        </fieldset>
                        <button v-if="edit_count" type="submit" class="btn btn-info waves-effect waves-light pull-right">{{trans('general.save')}}</button>
                    </form>
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
				classTeacherForm: new Form({
					batches: []
				},false),
				batches: [],
				class_teachers: [],
                course_groups: [],
                edit_count: 0,
                filter: {
                    course_id: [],
                    show_history: true
                },
                showFilterPanel: false,
                courses: [],
                selected_courses: null,
                help_topic: ''
			}
		},
		mounted(){
            this.getDetail();
            helper.showDemoNotification(['academic']);
		},
		methods: {
            getConfig(config){
                return helper.getConfig(config);
            },
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getDetail(){
                let loader = this.$loading.show();
                let url = helper.getFilterURL(this.filter);
                axios.get('/api/class/teacher?options=1'+url)
                    .then(response => {
                        this.batches = response.batches;
                        this.course_groups = response.course_groups;
                        this.courses = response.courses;
                        this.classTeacherForm.batches = [];
                        this.batches.forEach(batch => {
                            this.classTeacherForm.batches.push({
                                class_teachers: batch.class_teachers,
                                batch_id: batch.id,
                                course_id: batch.course_id,
                                name: batch.course.name+' '+batch.name,
                                change: false,
                                date_effective: '',
                                selected_employee: null,
                                employee_id: '',
                                description: '',
                                show: false,
                            })
                        })
                        this.class_teachers = response.class_teachers;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            showAction(index){
                let batch = this.classTeacherForm.batches[index];
                batch.show = true;
            },
            hideAction(index){
                let batch = this.classTeacherForm.batches[index];
                batch.show = false;
            },
            getDateEffectiveFieldName(index){
                return index+'_date_effective';
            },
            getDescriptionFieldName(index){
                return index+'_description';
            },
            getEmployeeFieldName(index){
                return index+'_employee_id';
            },
            onEmployeeSelect(selectedOption, id){
                let index = id.split('_')[0];
                this.classTeacherForm.batches[index].employee_id = selectedOption.id;
            },
            submit(){
                let loader = this.$loading.show();
                this.classTeacherForm.post('/api/class/teacher')
                    .then(response => {
                        toastr.success(response.message);
                        this.getDetail();
                        this.edit_count = 0;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getEmployeeName(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            showEditPanel(batch){
                batch.change = true;
                this.edit_count++;
            },
            hideEditPanel(batch){
                batch.change = false;
                this.edit_count--;
            },
            getCurrentClassTeacherName(class_teachers){
                let class_teacher = this.getCurrentClassTeacher(class_teachers);
                return (typeof class_teacher != 'undefined') ? this.getEmployeeName(class_teacher.employee) : '-';
            },
            getCurrentClassTeacherDesignation(class_teachers){
                let class_teacher = this.getCurrentClassTeacher(class_teachers);
                return class_teacher.length ? helper.getEmployeeDesignationOnDate(class_teacher[0].employee, class_teacher.date_effective) : '';
            },
            getCurrentClassTeacher(class_teachers){
                let class_teacher = class_teachers.find(o => o.date_effective <= helper.today());

                if (typeof class_teacher == 'undefined')
                    class_teacher = class_teachers[0];

                return class_teacher;
            },
            confirmDelete(class_teacher){
                return dialog => this.deleteClassTeacher(class_teacher);
            },
            deleteClassTeacher(class_teacher){
                let loader = this.$loading.show();
                axios.delete('/api/class/teacher/'+class_teacher.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.edit_count = 0;
                        this.getDetail();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/class/teacher/print',{filter: this.filter})
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
                axios.post('/api/class/teacher/pdf',{filter: this.filter})
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
            },
            courseInFilterList(course_id){
                return (!this.filter.course_id.length) || this.filter.course_id.includes(course_id);
            },
            isRequired(course_group){
                return course_group.courses.some(course => {
                    return ! this.filter.course_id.length || this.filter.course_id.indexOf(course.id) > -1;
                });
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
        computed: {
            authToken(){
                return helper.getAuthToken();
            }
        }
	}
</script>