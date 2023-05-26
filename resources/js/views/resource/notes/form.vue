<template>
    <div>
        <form @submit.prevent="proceed" @keydown="notesForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('academic.batch')}} </label>
                        <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false" name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="notesForm.errors.clear('batch_id')" @remove="notesForm.batch_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!batches.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="notesForm" prop-name="batch_id"></show-error>
                    </div>
                    <div class="form-group" v-if="notesForm.batch_id">
                        <label for="">{{trans('academic.subject')}} </label>
                        <v-select label="name" v-model="selected_subject" name="subject_id" id="subject_id" :options="subjects" :placeholder="trans('resource.select_subject')" @select="onSubjectSelect" @close="notesForm.errors.clear('subject_id')" @remove="notesForm.subject_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!subjects.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="notesForm" prop-name="subject_id"></show-error>
                    </div>
                    <div class="form-group">
                        <label for="">{{trans('resource.notes_title')}}</label>
                        <input class="form-control" type="text" v-model="notesForm.title" name="title" :placeholder="trans('resource.notes_title')">
                        <show-error :form-name="notesForm" prop-name="title"></show-error>
                    </div>
                    <div class="form-group">
                        <file-upload-input :button-text="trans('general.upload_document')" :token="notesForm.upload_token" module="notes" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <html-editor name="description" :model.sync="notesForm.description" height="300" :isUpdate="uuid ? true : false" @clearErrors="notesForm.errors.clear('description')"></html-editor>
                        <show-error :form-name="notesForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <router-link to="/resource/notes" class="btn btn-danger waves-effect waves-light " v-show="uuid">{{trans('general.cancel')}}</router-link>
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
                notesForm: new Form({
                    batch_id: '',
                    subject_id: '',
                    title: '',
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
            if(!helper.hasPermission('create-notes') && !helper.hasPermission('edit-notes')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.uuid)
                this.get();
            else
                this.notesForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/notes/pre-requisite')
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
                    this.notesForm.subject_id = '';
                    this.selected_subject = null;
                }
                let loader = this.$loading.show();
                axios.post('/api/batch/'+this.notesForm.batch_id+'/subjects')
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
                this.notesForm.post('/api/notes')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.notesForm.upload_token = this.$uuid.v4();
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
                axios.get('/api/notes/'+this.uuid)
                    .then(response => {
                        let notes = response.notes;
                        this.notesForm.title = notes.title;
                        this.notesForm.description = notes.description;
                        this.notesForm.batch_id = notes.subject.batch_id;
                        this.notesForm.subject_id = notes.subject_id;
                        this.selected_batch = this.notesForm.batch_id ? {id: notes.subject.batch_id, name: notes.subject.batch.course.name+' '+notes.subject.batch.name} : null;
                        this.selected_subject = notes.subject_id ? {id: notes.subject_id, name: notes.subject.name+' ('+notes.subject.code+')'} : null;
                        this.notesForm.upload_token = notes.upload_token;
                        this.module_id = notes.id;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/resource/notes');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.notesForm.patch('/api/notes/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/resource/notes');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onBatchSelect(selectedOption){
                this.notesForm.batch_id = selectedOption.id;
            },
            onSubjectSelect(selectedOption){
                this.notesForm.subject_id = selectedOption.id;
            }
        },
        watch: {
            'notesForm.batch_id': function(val) {
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