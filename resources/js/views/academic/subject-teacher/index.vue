<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.subject_teacher')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <div class="btn-group">
                            <button type="button" class="btn btn-info btn-sm dropdown-toggle no-caret " role="menu" id="moreOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-tooltip="trans('general.more_option')">
                                <i class="fas fa-ellipsis-h"></i> <span class="d-none d-sm-inline"></span>
                            </button>
                            <div :class="['dropdown-menu',getConfig('direction') == 'ltr' ? 'dropdown-menu-right' : '']" aria-labelledby="moreOption">
                                <button class="dropdown-item custom-dropdown" @click="filter.show_history = !filter.show_history">
                                    <span v-if="filter.show_history"><i class="fas fa-eye-slash"></i> {{trans('academic.hide_subject_teacher_history')}}</span>
                                    <span v-else><i class="fas fa-eye"></i> {{trans('academic.show_subject_teacher_history')}}</span>
                                </button>
                                <button class="dropdown-item custom-dropdown" @click="print"><i class="fas fa-print"></i> {{trans('general.print')}}</button>
                                <button class="dropdown-item custom-dropdown" @click="pdf"><i class="fas fa-file-pdf"></i> {{trans('general.generate_pdf')}}</button>
                            </div>
                        </div>
                        <help-button @clicked="help_topic = 'academic.subject-teacher'"></help-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card p-4">
                <div class="card-body">
                	<form @submit.prevent="submit" @keydown="subjectTeacherForm.errors.clear($event.target.name)">
                		<div class="row">
                			<div class="col-12">
				                <div class="form-group">
				                    <label for="">{{trans('academic.batch')}}</label>
				                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="subjectTeacherForm.errors.clear('batch_id')" @remove="subjectTeacherForm.batch_id = ''">
                                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                            {{trans('general.no_option_found')}}
                                        </div>
                                    </v-select>
				                    <show-error :form-name="subjectTeacherForm" prop-name="batch_id"></show-error>
				                </div>
                			</div>
                		</div>
                        <div class="row m-b-20" v-if="subjectTeacherForm.batch_id && subjectTeacherForm.subjects.length">
                            <div class="col-12 col-sm-4">
                                <h6>{{trans('academic.subject')}}</h6>
                            </div>
                            <div class="col-12 col-sm-4">
                                <h6>{{trans('academic.current_subject_teacher')}}</h6>
                            </div>
                            <div class="col-12 col-sm-4" v-if="filter.show_history">
                                <h6>{{trans('academic.subject_teacher_history')}}</h6>
                            </div>
                        </div>
                        <p class="has-error" v-if="subjectTeacherForm.batch_id && !subjectTeacherForm.subjects.length">
                            {{trans('academic.could_not_find_any_subject')}}
                        </p>
                        <div class="row m-b-10" v-for="(subject, index) in subjectTeacherForm.subjects" @mouseover="showAction(index)" @mouseout="hideAction(index)">
                            <div class="col-12 col-sm-4">
                                {{subject.name}}
                                <span class="m-l-10" v-show="subject.show">
                                    <i class="fas fa-edit" style="cursor:pointer;" v-if="!subject.change && hasPermission('store-subject-teacher')" @click="showEditPanel(subject)"></i>
                                    <i class="fas fa-times-circle" style="cursor:pointer;" v-if="subject.change" @click="hideEditPanel(subject)"></i>
                                </span>
                            </div>
                            <div class="col-12 col-sm-4">
                                <span v-if="subject.subject_teachers.length">
                                    {{getCurrentSubjectTeacherName(subject.subject_teachers)}}
                                    <i class="fas fa-times-circle m-l-10" v-show="subject.show && hasPermission('store-subject-teacher')" style="cursor:pointer;color:red;" :key="subject.subject_teachers[0].id" v-confirm="{ok: confirmDelete(subject.subject_teachers[0])}" v-tooltip="trans('academic.delete_subject_teacher')"></i>
                                </span>
                                <span v-else>-</span>
                            </div>
                            <div class="col-12 col-sm-4" v-if="filter.show_history">
                                <ul style="list-style:none;padding:0;margin:0;" v-if="subject.subject_teachers.length">
                                    <li v-for="(subject_teacher,idx) in subject.subject_teachers">
                                        ({{idx+1}}) 
                                        {{getEmployeeName(subject_teacher.employee)+' '+trans('general.from')}} {{subject_teacher.date_effective | moment}} 
                                    </li>
                                </ul>
                                <span v-if="!subject.subject_teachers.length">-</span>
                            </div>

                            <div class="col-12 my-4" v-if="subject.change">
                                <div class="row">
                                    <div class="col-12 col-sm-4">
                                        <v-select label="name" v-model="subject.selected_employee" :name="getEmployeeFieldName(index)" :id="getEmployeeFieldName(index)" :options="subject_teachers" :placeholder="trans('academic.select_subject_teacher')" @select="onEmployeeSelect" @close="subjectTeacherForm.errors.clear(getEmployeeFieldName(index))" @remove="subject.employee_id = ''">
                                            <div class="multiselect__option" slot="afterList" v-if="!subject_teachers.length">
                                                {{trans('general.no_option_found')}}
                                            </div>
                                        </v-select>
                                        <show-error :form-name="subjectTeacherForm" :prop-name="getEmployeeFieldName(index)"></show-error>
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <datepicker v-model="subject.date_effective" :bootstrapStyling="true" :name="getDateEffectiveFieldName(index)" @selected="subjectTeacherForm.errors.clear(getDateEffectiveFieldName(index))" :placeholder="trans('academic.date_effective')"></datepicker>
                                        <show-error :form-name="subjectTeacherForm" :prop-name="getDateEffectiveFieldName(index)"></show-error> 
                                    </div>
                                    <div class="col-12 col-sm-4">
                                        <autosize-textarea v-model="subject.description" rows="1" :name="getDescriptionFieldName(index)" :placeholder="trans('academic.subject_teacher_description')"></autosize-textarea>
                                        <show-error :form-name="subjectTeacherForm" :prop-name="getDescriptionFieldName(index)"></show-error>     
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <button v-if="edit_count" type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                        </div>
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
				subjectTeacherForm: new Form({
					batch_id: '',
					subjects: []
				},false),
                filter: {
                    batch_id: '',
                    show_history: true
                },
				selected_batch: null,
				batches: [],
				subjects: [],
				subject_teachers: [],
                edit_count: 0,
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
                axios.get('/api/subject/teacher')
                    .then(response => {
                        this.batches = response.batches;
                        this.subject_teachers = response.subject_teachers;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getSubjects(){
                let loader = this.$loading.show();
            	axios.post('/api/subject/teacher/'+this.subjectTeacherForm.batch_id)
                    .then(response => {
                    	this.subjects = response;
                    	this.subjectTeacherForm.subjects = [];
                        this.subjects.forEach(subject => {
	                    	this.subjectTeacherForm.subjects.push({
                                subject_teachers: subject.subject_teachers,
                                subject_id: subject.id,
                                name: subject.name+' ('+subject.code+')',
                                change: false,
                                date_effective: '',
                                selected_employee: null,
                                employee_id: '',
                                description: '',
                                show: false
	                    	});
	                    });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            submit(){
                let loader = this.$loading.show();
                this.subjectTeacherForm.post('/api/subject/teacher')
                    .then(response => {
                        toastr.success(response.message);
                        this.edit_count = 0;
                        this.getSubjects();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.filter.batch_id = selectedOption.id;
            	this.subjectTeacherForm.batch_id = selectedOption.id;
            	this.getSubjects();
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
                this.subjectTeacherForm.subjects[index].employee_id = selectedOption.id;
            },
            showEditPanel(subject){
                subject.change = true;
                this.edit_count++;
            },
            hideEditPanel(subject){
                subject.change = false;
                this.edit_count--;
            },
            getEmployeeName(employee){
                return helper.getEmployeeNameWithCode(employee);
            },
            getCurrentSubjectTeacherName(subject_teachers){
                let subject_teacher = this.getCurrentSubjectTeacher(subject_teachers);
                return (typeof subject_teacher != 'undefined') ? this.getEmployeeName(subject_teacher.employee) : '-';
            },
            getCurrentSubjectTeacher(subject_teachers){
                let subject_teacher = subject_teachers.find(o => o.date_effective <= helper.today());

                if (typeof subject_teacher == 'undefined')
                    subject_teacher = subject_teachers[0];

                return subject_teacher;
            },
            confirmDelete(subject_teacher){
                return dialog => this.deleteSubjectTeacher(subject_teacher);
            },
            deleteSubjectTeacher(subject_teacher){
                let loader = this.$loading.show();
                axios.delete('/api/subject/teacher/'+subject_teacher.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.edit_count = 0;
                        this.getSubjects();
                        loader.hide();
                    }).catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            showAction(index){
                let subject = this.subjectTeacherForm.subjects[index];
                subject.show = true;
            },
            hideAction(index){
                let subject = this.subjectTeacherForm.subjects[index];
                subject.show = false;
            },
            print(){
                let loader = this.$loading.show();
                axios.post('/api/subject/teacher/print',{filter: this.filter})
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
                axios.post('/api/subject/teacher/pdf',{filter: this.filter})
                    .then(response => {
                        loader.hide();
                        window.open('/download/report/'+response+'?token='+this.authToken);
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
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