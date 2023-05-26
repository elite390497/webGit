<template>
	<div>
        <form @submit.prevent="proceed" @keydown="documentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.document_title')}}</label>
                        <input class="form-control" type="text" v-model="documentForm.title" name="title" :placeholder="trans('student.document_title')">
                        <show-error :form-name="documentForm" prop-name="title"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.document_type')}}</label>
                        <v-select label="name" v-model="selected_student_document_type" name="student_document_type_id" id="student_document_type_id" :options="student_document_types" :placeholder="trans('general.select_one')" @select="onDocumentTypeSelect" @close="documentForm.errors.clear('student_document_type_id')" @remove="documentForm.student_document_type_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!student_document_types.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="documentForm" prop-name="student_document_type_id"></show-error>
                    </div>
                </div>
            </div>
            <div class="form-group">
            	<autosize-textarea v-model="documentForm.description" rows="2" name="description" :placeholder="trans('student.document_description')"></autosize-textarea>
                <show-error :form-name="documentForm" prop-name="description"></show-error>
            </div>
            <div class="form-group">
                <file-upload-input :button-text="trans('general.upload_document')" :token="documentForm.upload_token" module="student_document" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
            </div>
            <button type="submit" class="btn btn-info waves-effect waves-light pull-right">
                <span v-if="did">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </form>
        <div class="clearfix"></div>
    </div>
</template>


<script>

    export default {
        components:{},
        data() {
            return {
                documentForm: new Form({
                    title : '',
                    student_document_type_id: '',
                    description : '',
                    upload_token: ''
                }),
                selected_student_document_type: null,
                student_document_types: [],
                module_id: '',
                clearAttachment: true
            };
        },
        props: ['uuid','did'],
        mounted() {
            this.documentForm.upload_token = this.$uuid.v4();

            this.getPreRequisite();

            if(this.did)
                this.getDocument();
        },
        methods: {
            proceed(){
                if(this.did)
                    this.updateDocument();
                else
                    this.storeDocument();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.uuid+'/document/pre-requisite')
                    .then(response => {
                        this.student_document_types = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            storeDocument(){
                let loader = this.$loading.show();
                this.documentForm.post('/api/student/'+this.uuid+'/document')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.$emit('completed');
                        this.documentForm.upload_token = this.$uuid.v4();
                        this.selected_student_document_type = null;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getDocument(){
                let loader = this.$loading.show();
                axios.get('/api/student/'+this.uuid+'/document/'+this.did)
                    .then(response => {
                        this.documentForm.title = response.student_document.title;
                        this.documentForm.student_document_type_id = response.student_document.student_document_type_id;
                        this.selected_student_document_type = {id: response.student_document.student_document_type_id, name: response.student_document.student_document_type.name};
                        this.documentForm.description = response.student_document.description;
                        this.documentForm.upload_token = response.student_document.upload_token;
                        this.module_id = response.student_document.id;
                        this.$emit('loaded');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/student/'+this.uuid);
                    });
            },
            updateDocument(){
                let loader = this.$loading.show();
                this.documentForm.patch('/api/student/'+this.uuid+'/document/'+this.did)
                    .then(response => {
                        toastr.success(response.message);
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onDocumentTypeSelect(selectedOption){
            	this.documentForm.student_document_type_id = selectedOption.id;
            }
        }
    }
</script>
