<template>
    <div>
        <form @submit.prevent="proceed" @keydown="lessonPlanForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.batch')}} </label>
                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="lessonPlanForm.errors.clear('batch_id')" @remove="lessonPlanForm.batch_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="lessonPlanForm" prop-name="batch_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group" v-if="lessonPlanForm.batch_id">
                        <label for="">{{trans('academic.subject')}} </label>
                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans('resource.select_subject')" @select="onSubjectSelect" @close="lessonPlanForm.errors.clear('subject_id')" @remove="lessonPlanForm.subject_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="lessonPlanForm" prop-name="subject_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('resource.lesson_plan_start_date')}}</label>
                        <datepicker v-model="lessonPlanForm.start_date" :bootstrapStyling="true" @selected="lessonPlanForm.errors.clear('start_date')" :placeholder="trans('resource.lesson_plan_start_date')"></datepicker>
                        <show-error :form-name="lessonPlanForm" prop-name="start_date"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('resource.lesson_plan_end_date')}}</label>
                        <datepicker v-model="lessonPlanForm.end_date" :bootstrapStyling="true" @selected="lessonPlanForm.errors.clear('end_date')" :placeholder="trans('resource.lesson_plan_end_date')"></datepicker>
                        <show-error :form-name="lessonPlanForm" prop-name="end_date"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('resource.lesson_plan_topic')}}</label>
                        <input class="form-control" type="text" v-model="lessonPlanForm.topic" name="topic" :placeholder="trans('resource.lesson_plan_topic')">
                        <show-error :form-name="lessonPlanForm" prop-name="topic"></show-error>
                    </div>
                    <template v-for="(detail,index) in lessonPlanForm.details">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('resource.lesson_plan_detail_title')}} 
                                    <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDeleteDetail(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button></label>
                                    <input class="form-control" type="text" v-model="detail.title" :name="getDetailTitleName(index)" :placeholder="trans('resource.lesson_plan_detail_title')">
                                    <show-error :form-name="lessonPlanForm" :prop-name="getDetailTitleName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('resource.lesson_plan_detail_description')}}</label>
                                    <autosize-textarea v-model="detail.description" rows="2" :name="getDetailDescriptionName(index)" :placeholder="trans('resource.lesson_plan_detail_description')"></autosize-textarea>
                                    <show-error :form-name="lessonPlanForm" :prop-name="getDetailDescriptionName(index)"></show-error>
                                </div>
                            </div>
                        </div>
                    </template>
                    <div class="form-group">
                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('resource.lesson_plan_add_new_detail')}}</button>
                    </div>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="lessonPlanForm.upload_token" module="lesson_plan" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/resource/lesson/plan" class="btn btn-danger waves-effect waves-light ">{{trans('general.cancel')}}</router-link>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="uuid">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>
    </div>
</template>


<script>

    export default {
        components: {},
        data() {
            return {
                lessonPlanForm: new Form({
                    batch_id: '',
                    subject_id: '',
                    topic: '',
                    start_date: '',
                    end_date: '',
                    details: [],
                    upload_token: ''
                }),
                batches: [],
                selected_batch: null,
                subjects: [],
                selected_subject: null,
                subject_detail: [],
                module_id: '',
                clearAttachment: true
            };
        },
        props: ['uuid'],
        mounted() {
            if(!helper.hasPermission('create-lesson-plan') && !helper.hasPermission('edit-lesson-plan')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else {
                this.addRow();
                this.lessonPlanForm.upload_token = this.$uuid.v4();
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            addRow(){
                let new_index = this.lessonPlanForm.details.push({
                    title: '',
                    description: ''
                })
            },
            confirmDeleteDetail(index){
                return dialog => this.deleteDetail(index);
            },
            deleteDetail(index){
                this.lessonPlanForm.details.splice(index, 1);
            },
            getDetailTitleName(index){
                return index+'_detail_title';
            },
            getDetailDescriptionName(index){
                return index+'_detail_description';
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/lesson/plan/pre-requisite')
                    .then(response => {
                        this.batches = response.batches;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            getSubjects(){
                if (!this.uuid) {
                    this.lessonPlanForm.subject_id = '';
                    this.selected_subject = null;
                }
                let loader = this.$loading.show();
                axios.post('/api/batch/'+this.lessonPlanForm.batch_id+'/subjects')
                    .then(response => {
                        this.subjects = response.subjects;
                        this.subject_details = response.subject_details;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.lessonPlanForm.post('/api/lesson/plan')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.lessonPlanForm.upload_token = this.$uuid.v4();
                        this.selected_batch = null;
                        this.selected_subject = null;
                        this.lessonPlanForm.details = [];
                        this.addRow();
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
                axios.get('/api/lesson/plan/'+this.uuid)
                    .then(response => {
                        let lesson_plan = response.lesson_plan;
                        this.lessonPlanForm.title = lesson_plan.title;
                        this.lessonPlanForm.start_date = lesson_plan.start_date;
                        this.lessonPlanForm.end_date = lesson_plan.end_date;
                        this.lessonPlanForm.batch_id = lesson_plan.subject.batch_id;
                        this.lessonPlanForm.subject_id = lesson_plan.subject_id;
                        this.selected_batch = this.lessonPlanForm.batch_id ? {id: lesson_plan.subject.batch_id, name: lesson_plan.subject.batch.course.name+' '+lesson_plan.subject.batch.name} : null;
                        this.selected_subject = lesson_plan.subject_id ? {id: lesson_plan.subject_id, name: lesson_plan.subject.name+' ('+lesson_plan.subject.code+')'} : null;
                        this.lessonPlanForm.upload_token = lesson_plan.upload_token;

                        lesson_plan.lesson_plan_details.forEach(lesson_plan_detail => {
                            this.lessonPlanForm.details.push({
                                title: lesson_plan_detail.title,
                                description: lesson_plan_detail.description
                            });
                        });
                        
                        this.module_id = lesson_plan.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/resource/lesson/plan');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.lessonPlanForm.patch('/api/lesson/plan/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/resource/lesson/plan');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.lessonPlanForm.batch_id = selectedOption.id;
            },
            onSubjectSelect(selectedOption){
                this.lessonPlanForm.subject_id = selectedOption.id;
            }
        },
        watch: {
            'lessonPlanForm.batch_id': function(val) {
                if (val) {
                    this.getSubjects();
                }
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>