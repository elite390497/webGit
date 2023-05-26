<template>
    <div>
        <form @submit.prevent="proceed" @keydown="syllabusForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.batch')}} </label>
                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="syllabusForm.errors.clear('batch_id')" @remove="syllabusForm.batch_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="syllabusForm" prop-name="batch_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group" v-if="syllabusForm.batch_id">
                        <label for="">{{trans('academic.subject')}} </label>
                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans('resource.select_subject')" @select="onSubjectSelect" @close="syllabusForm.errors.clear('subject_id')" @remove="syllabusForm.subject_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="syllabusForm" prop-name="subject_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('resource.syllabus_title')}}</label>
                        <input class="form-control" type="text" v-model="syllabusForm.title" name="title" :placeholder="trans('resource.syllabus_title')">
                        <show-error :form-name="syllabusForm" prop-name="title"></show-error>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <label for="">{{trans('resource.syllabus_description')}}</label>
                        <autosize-textarea v-model="syllabusForm.description" rows="2" name="description" :placeholder="trans('resource.syllabus_description')"></autosize-textarea>
                        <show-error :form-name="syllabusForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h4 class="card-title">{{trans('resource.syllabus_detail')}}</h4>
                    <template v-for="(detail,index) in syllabusForm.details">
                        <div class="form-group">
                            <label for="">{{trans('resource.syllabus_detail_title')}} 
                            <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_detail`" v-confirm="{ok: confirmDeleteDetail(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button></label>
                            <input class="form-control" type="text" v-model="detail.title" :name="getDetailTitleName(index)" :placeholder="trans('resource.syllabus_detail_title')">
                            <show-error :form-name="syllabusForm" :prop-name="getDetailTitleName(index)"></show-error>
                        </div>
                        <div class="form-group">
                            <label for="">{{trans('resource.syllabus_detail_description')}}</label>
                            <autosize-textarea v-model="detail.description" rows="2" :name="getDetailDescriptionName(index)" :placeholder="trans('resource.syllabus_detail_description')"></autosize-textarea>
                            <show-error :form-name="syllabusForm" :prop-name="getDetailDescriptionName(index)"></show-error>
                        </div>
                    </template>
                    <div class="form-group">
                        <button type="button" @click="addDetailRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('resource.syllabus_add_new_detail')}}</button>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <h4 class="card-title">{{trans('resource.syllabus_topic')}}</h4>
                    <template v-for="(topic,index) in syllabusForm.topics">
                        <div class="form-group">
                            <label for="">{{trans('resource.syllabus_topic_title')}} 
                                <button type="button" class="btn btn-xs btn-danger m-l-20" :key="`${index}_delete_topic`" v-confirm="{ok: confirmDeleteTopic(index)}" v-tooltip="trans('general.delete')"><i class="fas fa-times"></i></button></label>
                            <input class="form-control" type="text" v-model="topic.title" :name="getTopicTitleName(index)" :placeholder="trans('resource.syllabus_topic_title')">
                            <show-error :form-name="syllabusForm" :prop-name="getTopicTitleName(index)"></show-error>
                        </div>
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('resource.syllabus_topic_start_date')}}</label>
                                    <datepicker v-model="topic.start_date" :bootstrapStyling="true" @selected="syllabusForm.errors.clear(getTopicStartDateName(index))" :placeholder="trans('resource.syllabus_start_date')"></datepicker>
                                    <show-error :form-name="syllabusForm" :prop-name="getTopicStartDateName(index)"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('resource.syllabus_topic_end_date')}}</label>
                                    <datepicker v-model="topic.end_date" :bootstrapStyling="true" @selected="syllabusForm.errors.clear(getTopicEndDateName(index))" :placeholder="trans('resource.syllabus_end_date')"></datepicker>
                                    <show-error :form-name="syllabusForm" :prop-name="getTopicEndDateName(index)"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="">{{trans('resource.syllabus_topic_description')}}</label>
                            <autosize-textarea v-model="topic.description" rows="2" :name="getTopicDescriptionName(index)" :placeholder="trans('resource.syllabus_topic_description')"></autosize-textarea>
                            <show-error :form-name="syllabusForm" :prop-name="getTopicDescriptionName(index)"></show-error>
                        </div>
                    </template>
                    <div class="form-group">
                        <button type="button" @click="addTopicRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('resource.syllabus_add_new_topic')}}</button>
                    </div>
                </div>
                <div class="col-12">
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="syllabusForm.upload_token" module="syllabus" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/resource/syllabus" class="btn btn-danger waves-effect waves-light ">{{trans('general.cancel')}}</router-link>
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
                syllabusForm: new Form({
                    title: '',
                    description: '',
                    batch_id: '',
                    subject_id: '',
                    details: [],
                    topics: [],
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
            if(!helper.hasPermission('create-syllabus') && !helper.hasPermission('edit-syllabus')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else {
                this.addDetailRow();
                this.addTopicRow();
                this.syllabusForm.upload_token = this.$uuid.v4();
            }

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            addDetailRow(){
                let new_index = this.syllabusForm.details.push({
                    title: '',
                    description: ''
                })
            },
            confirmDeleteDetail(index){
                return dialog => this.deleteDetail(index);
            },
            deleteDetail(index){
                this.syllabusForm.details.splice(index, 1);
            },
            getDetailTitleName(index){
                return index+'_detail_title';
            },
            getDetailDescriptionName(index){
                return index+'_detail_description';
            },
            addTopicRow(){
                let new_index = this.syllabusForm.topics.push({
                    title: '',
                    start_date: '',
                    end_date: '',
                    description: ''
                })
            },
            confirmDeleteTopic(index){
                return dialog => this.deleteTopic(index);
            },
            deleteTopic(index){
                this.syllabusForm.topics.splice(index, 1);
            },
            getTopicTitleName(index){
                return index+'_topic_title';
            },
            getTopicDescriptionName(index){
                return index+'_topic_description';
            },
            getTopicStartDateName(index){
                return index+'_topic_start_date';
            },
            getTopicEndDateName(index){
                return index+'_topic_end_date';
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/syllabus/pre-requisite')
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
                    this.syllabusForm.subject_id = '';
                    this.selected_subject = null;
                }
                let loader = this.$loading.show();
                axios.post('/api/batch/'+this.syllabusForm.batch_id+'/subjects')
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
                this.syllabusForm.post('/api/syllabus')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.syllabusForm.upload_token = this.$uuid.v4();
                        this.selected_batch = null;
                        this.selected_subject = null;
                        this.syllabusForm.details = [];
                        this.syllabusForm.topics = [];
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
                axios.get('/api/syllabus/'+this.uuid)
                    .then(response => {
                        let syllabus = response.syllabus;
                        this.syllabusForm.title = syllabus.title;
                        this.syllabusForm.description = syllabus.description;
                        this.syllabusForm.batch_id = syllabus.subject.batch_id;
                        this.syllabusForm.subject_id = syllabus.subject_id;
                        this.selected_batch = this.syllabusForm.batch_id ? {id: syllabus.subject.batch_id, name: syllabus.subject.batch.course.name+' '+syllabus.subject.batch.name} : null;
                        this.selected_subject = syllabus.subject_id ? {id: syllabus.subject_id, name: syllabus.subject.name+' ('+syllabus.subject.code+')'} : null;
                        this.syllabusForm.upload_token = syllabus.upload_token;

                        syllabus.syllabus_details.forEach(syllabus_detail => {
                            this.syllabusForm.details.push({
                                title: syllabus_detail.title,
                                description: syllabus_detail.description
                            });
                        });
                        
                        syllabus.syllabus_topics.forEach(syllabus_topic => {
                            this.syllabusForm.topics.push({
                                title: syllabus_topic.title,
                                start_date: syllabus_topic.start_date,
                                end_date: syllabus_topic.end_date,
                                description: syllabus_topic.description
                            });
                        });
                        
                        this.module_id = syllabus.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/resource/syllabus');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.syllabusForm.patch('/api/syllabus/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/resource/syllabus');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.syllabusForm.batch_id = selectedOption.id;
            },
            onSubjectSelect(selectedOption){
                this.syllabusForm.subject_id = selectedOption.id;
            }
        },
        watch: {
            'syllabusForm.batch_id': function(val) {
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