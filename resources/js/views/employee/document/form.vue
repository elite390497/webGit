<template>
	<div>
        <form @submit.prevent="proceed" @keydown="documentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.document_title')}}</label>
                        <input class="form-control" type="text" v-model="documentForm.title" name="title" :placeholder="trans('employee.document_title')">
                        <show-error :form-name="documentForm" prop-name="title"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('employee.document_type')}}</label>
                        <v-select label="name" v-model="selected_employee_document_type" name="employee_document_type_id" id="employee_document_type_id" :options="employee_document_types" :placeholder="trans('general.select_one')" @select="onDocumentTypeSelect" @close="documentForm.errors.clear('employee_document_type_id')" @remove="documentForm.employee_document_type_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!employee_document_types.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="documentForm" prop-name="employee_document_type_id"></show-error>
                    </div>
                </div>
            </div>
            <div class="form-group">
            	<autosize-textarea v-model="documentForm.description" rows="2" name="description" :placeholder="trans('employee.document_description')"></autosize-textarea>
                <show-error :form-name="documentForm" prop-name="description"></show-error>
            </div>
            <div class="form-group">
                <file-upload-input :button-text="trans('general.upload_document')" :token="documentForm.upload_token" module="employee_document" :clear-file="clearAttachment" :module-id="module_id"></file-upload-input>
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
                    employee_document_type_id: '',
                    description : '',
                    upload_token: ''
                }),
                selected_employee_document_type: null,
                employee_document_types: [],
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
                axios.get('/api/employee/'+this.uuid+'/document/pre-requisite')
                    .then(response => {
                        this.employee_document_types = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            storeDocument(){
                let loader = this.$loading.show();
                this.documentForm.post('/api/employee/'+this.uuid+'/document')
                    .then(response => {
                        toastr.success(response.message);
                        this.clearAttachment = !this.clearAttachment;
                        this.$emit('completed');
                        this.selected_employee_document_type = null;
                        this.documentForm.upload_token = this.$uuid.v4();
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getDocument(){
                let loader = this.$loading.show();
                axios.get('/api/employee/'+this.uuid+'/document/'+this.did)
                    .then(response => {
                        this.documentForm.title = response.employee_document.title;
                        this.documentForm.employee_document_type_id = response.employee_document.employee_document_type_id;
                        this.selected_employee_document_type = {id: response.employee_document.employee_document_type_id, name: response.employee_document.employee_document_type.name};
                        this.documentForm.description = response.employee_document.description;
                        this.documentForm.upload_token = response.employee_document.upload_token;
                        this.module_id = response.employee_document.id;
                        this.$emit('loaded');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        this.$router.push('/employee/'+this.uuid);
                    });
            },
            updateDocument(){
                let loader = this.$loading.show();
                this.documentForm.patch('/api/employee/'+this.uuid+'/document/'+this.did)
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
            	this.documentForm.employee_document_type_id = selectedOption.id;
            }
        }
    }
</script>
