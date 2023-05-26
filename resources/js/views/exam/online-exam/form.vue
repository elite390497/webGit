<template>
    <div>
        <form @submit.prevent="proceed" @keydown="onlineExamForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_name')}}</label>
                        <input class="form-control" type="text" v-model="onlineExamForm.name" name="name" :placeholder="trans('exam.online_exam_name')">
                        <show-error :form-name="onlineExamForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.batch')}} </label>
                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="onlineExamForm.errors.clear('batch_id')" @remove="onlineExamForm.batch_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="onlineExamForm" prop-name="batch_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.subject')}} </label>
                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans('academic.select_subject')" @select="onSubjectSelect" @close="onlineExamForm.errors.clear('subject_id')" @remove="onlineExamForm.subject_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="onlineExamForm" prop-name="subject_id"></show-error>
                    </div>
                </div>
                <!-- <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_type')}}</label>
                        <select v-model="onlineExamForm.exam_type" class="custom-select col-12" name="exam_type"@change="onlineExamForm.errors.clear('exam_type')">
                          <option value="" selected>{{trans('general.select_one')}}</option>
                          <option v-for="option in exam_types" v-bind:value="option.value">
                            {{ option.text }}
                          </option>
                        </select>
                        <show-error :form-name="onlineExamForm" prop-name="exam_type"></show-error>
                    </div>
                </div> -->
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_date')}}</label>
                        <datepicker v-model="onlineExamForm.date" :bootstrapStyling="true" @selected="onlineExamForm.errors.clear('date')" :placeholder="trans('exam.online_exam_date')"></datepicker>
                        <show-error :form-name="onlineExamForm" prop-name="date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_start_time')}}</label>
                        <timepicker :hour.sync="start_time.hour" :minute.sync="start_time.minute" :meridiem.sync="start_time.meridiem"></timepicker>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_end_time')}}</label>
                        <timepicker :hour.sync="end_time.hour" :minute.sync="end_time.minute" :meridiem.sync="end_time.meridiem"></timepicker>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_passing_percentage')}}</label>
                        <div class="input-group mb-3">
                            <input class="form-control" type="text" v-model="onlineExamForm.passing_percentage" name="passing_percentage" :placeholder="trans('exam.online_exam_passing_percentage')">
                            <div class="input-group-append"><span class="input-group-text">%</span></div>
                        </div>
                        <show-error :form-name="onlineExamForm" prop-name="passing_percentage"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <div>{{trans('exam.online_exam_is_negative_mark_applicable')}}</div>
                        <switches class="m-t-10" v-model="onlineExamForm.is_negative_mark_applicable" theme="bootstrap" color="success"></switches> 
                        <show-error :form-name="onlineExamForm" prop-name="online_exam_is_negative_mark_applicable"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4" v-if="onlineExamForm.is_negative_mark_applicable">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_negative_mark_percentage_per_question')}}</label>
                        <div class="input-group mb-3">
                            <input class="form-control" type="text" v-model="onlineExamForm.negative_mark_percentage_per_question" name="negative_mark_percentage_per_question" :placeholder="trans('exam.online_exam_negative_mark_percentage_per_question')">
                            <div class="input-group-append"><span class="input-group-text">%</span></div>
                        </div>
                        <show-error :form-name="onlineExamForm" prop-name="negative_mark_percentage_per_question"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_instructions')}}</label>
                        <html-editor name="instructions" :model.sync="onlineExamForm.instructions" height="200" :isUpdate="uuid ? true : false" @clearErrors="onlineExamForm.errors.clear('instructions')"></html-editor>
                        <show-error :form-name="onlineExamForm" prop-name="instructions"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('exam.online_exam_description')}}</label>
                        <input class="form-control" type="text" v-model="onlineExamForm.description" name="description" :placeholder="trans('exam.online_exam_description')">
                        <show-error :form-name="onlineExamForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/online-exam" class="btn btn-danger waves-effect waves-light ">{{trans('general.cancel')}}</router-link>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>
    import onlineExamForm from '../form'

    export default {
        components: {onlineExamForm},
        data() {
            return {
                onlineExamForm: new Form({
                    name: '',
                    batch_id: '',
                    subject_id: '',
                    date: '',
                    start_time: '',
                    end_time: '',
                    exam_type: 'mcq',
                    passing_percentage: '',
                    is_negative_mark_applicable: '',
                    negative_mark_percentage_per_question: '',
                    instructions: '',
                    description: ''
                }),
                start_time: {
                    hour: '',
                    minute: '',
                    meridiem: 'am'
                },
                end_time: {
                    hour: '',
                    minute: '',
                    meridiem: 'am'
                },
                exam_types: [],
                batches: [],
                selected_batch: null,
                selected_subject: null,
                batch_with_subjects: [],
                subjects: [],
                showExamModal: false
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-online-exam') && !helper.hasPermission('edit-online-exam')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/online-exam/pre-requisite')
                    .then(response => {
                        this.batches = response.batches;
                        this.batch_with_subjects = response.batch_with_subjects;
                        this.exam_types = response.exam_types;

                        if(this.uuid)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getSubjects(){
                let loader = this.$loading.show();

                let batch = this.batch_with_subjects.find(o => o.id == this.onlineExamForm.batch_id);

                if (typeof batch == 'undefined') {
                    loader.hide();
                    return;
                }

                this.subjects = [];
                this.selected_subject = '';

                batch.subjects.forEach(subject => {
                    this.subjects.push({
                        id: subject.id,
                        name: subject.name+' ('+subject.code+')'
                    });
                });
                
                loader.hide();
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.onlineExamForm.start_time = helper.toTime(this.start_time);
                this.onlineExamForm.end_time   = helper.toTime(this.end_time);
                this.onlineExamForm.post('/api/online-exam')
                    .then(response => {
                        toastr.success(response.message);
                        this.onlineExamForm.exam_type = 'mcq';
                        this.selected_batch = null;
                        this.selected_subject = null;
                        this.start_time.hour = ''
                        this.start_time.minute = ''
                        this.end_time.hour = ''
                        this.end_time.minute = ''
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/online-exam/'+this.uuid)
                    .then(response => {
                        loader.hide();
                        this.onlineExamForm.name = response.online_exam.name;
                        this.onlineExamForm.batch_id = response.online_exam.batch_id;
                        this.onlineExamForm.subject_id = response.online_exam.subject_id;
                        this.onlineExamForm.description = response.online_exam.description;
                        this.onlineExamForm.instructions = response.online_exam.instructions;
                        this.onlineExamForm.exam_type = response.online_exam.exam_type;
                        this.onlineExamForm.passing_percentage = response.online_exam.passing_percentage;
                        this.onlineExamForm.is_negative_mark_applicable = response.online_exam.is_negative_mark_applicable ? 1 : 0;
                        this.onlineExamForm.negative_mark_percentage_per_question = response.online_exam.is_negative_mark_applicable ? response.online_exam.negative_mark_percentage_per_question : 0;
                        this.selected_batch = response.selected_batch;
                        this.selected_subject = response.selected_subject;
                        this.onlineExamForm.date = response.online_exam.date;
                        this.start_time = response.start_time;
                        this.end_time = response.end_time;
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/online-exam');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.onlineExamForm.start_time = helper.toTime(this.start_time);
                this.onlineExamForm.end_time   = helper.toTime(this.end_time);
                this.onlineExamForm.patch('/api/online-exam/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/online-exam');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.onlineExamForm.batch_id = selectedOption.id;
                this.getSubjects();
            },
            onSubjectSelect(selectedOption){
                this.onlineExamForm.subject_id = selectedOption.id;
            }
        },
        watch: {
        }
    }
</script>