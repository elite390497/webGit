<template>
    <div>
        <form @submit.prevent="proceed" @keydown="assignmentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('academic.batch')}} </label>
                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="assignmentForm.errors.clear('batch_id')" @remove="assignmentForm.batch_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="assignmentForm" prop-name="batch_id"></show-error>
                    </div>
                    <div class="form-group" v-if="assignmentForm.batch_id">
                        <label for="">{{trans('academic.subject')}} </label>
                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans('resource.select_subject')" @select="onSubjectSelect" @close="assignmentForm.errors.clear('subject_id')" @remove="assignmentForm.subject_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="assignmentForm" prop-name="subject_id"></show-error>
                    </div>
                    <div class="form-group">
                        <label for="">{{trans('resource.assignment_title')}}</label>
                        <input class="form-control" type="text" v-model="assignmentForm.title" name="title" :placeholder="trans('resource.assignment_title')">
                        <show-error :form-name="assignmentForm" prop-name="title"></show-error>
                    </div>
                    <div class="form-group">
                        <label for="">{{trans('resource.date_of_assignment')}}</label>
                        <datepicker v-model="assignmentForm.date_of_assignment" :bootstrapStyling="true" @selected="assignmentForm.errors.clear('date_of_assignment')" :placeholder="trans('resource.date_of_assignment')"></datepicker>
                        <show-error :form-name="assignmentForm" prop-name="date_of_assignment"></show-error>
                    </div>
                    <div class="form-group">
                        <label for="">{{trans('resource.due_date_of_assignment')}}</label>
                        <datepicker v-model="assignmentForm.due_date" :bootstrapStyling="true" @selected="assignmentForm.errors.clear('due_date')" :placeholder="trans('resource.due_date_of_assignment')"></datepicker>
                        <show-error :form-name="assignmentForm" prop-name="due_date"></show-error>
                    </div>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="assignmentForm.upload_token" module="assignment" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <html-editor name="description" :model.sync="assignmentForm.description" height="300" :isUpdate="uuid ? true : false" @clearErrors="assignmentForm.errors.clear('description')"></html-editor>
                        <show-error :form-name="assignmentForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/resource/assignment" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
                <button v-if="!uuid" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
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
                assignmentForm: new Form({
                    batch_id: '',
                    subject_id: '',
                    title: '',
                    date_of_assignment: '',
                    due_date: '',
                    description: '',
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
            if(!helper.hasPermission('create-assignment') && !helper.hasPermission('edit-assignment')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else
                this.assignmentForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/assignment/pre-requisite')
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
                    this.assignmentForm.subject_id = '';
                    this.selected_subject = null;
                }
                let loader = this.$loading.show();
                axios.post('/api/batch/'+this.assignmentForm.batch_id+'/subjects')
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
                this.assignmentForm.post('/api/assignment')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.assignmentForm.upload_token = this.$uuid.v4();
                        this.selected_batch = null;
                        this.selected_subject = null;
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
                axios.get('/api/assignment/'+this.uuid)
                    .then(response => {
                        let assignment = response.assignment;
                        this.assignmentForm.title = assignment.title;
                        this.assignmentForm.date_of_assignment = assignment.date_of_assignment;
                        this.assignmentForm.due_date = assignment.due_date;
                        this.assignmentForm.description = assignment.description;
                        this.assignmentForm.batch_id = assignment.subject.batch_id;
                        this.assignmentForm.subject_id = assignment.subject_id;
                        this.selected_batch = this.assignmentForm.batch_id ? {id: assignment.subject.batch_id, name: assignment.subject.batch.course.name+' '+assignment.subject.batch.name} : null;
                        this.selected_subject = assignment.subject_id ? {id: assignment.subject_id, name: assignment.subject.name+' ('+assignment.subject.code+')'} : null;
                        this.assignmentForm.upload_token = assignment.upload_token;
                        this.module_id = assignment.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/resource/assignment');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.assignmentForm.patch('/api/assignment/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/resource/assignment');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.assignmentForm.batch_id = selectedOption.id;
            },
            onSubjectSelect(selectedOption){
                this.assignmentForm.subject_id = selectedOption.id;
            }
        },
        watch: {
            'assignmentForm.batch_id': function(val) {
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