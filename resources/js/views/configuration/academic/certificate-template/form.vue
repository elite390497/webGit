<template>
	<div>
	    <form @submit.prevent="proceed" @keydown="certificateTemplateForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('academic.certificate_template_name')}}</label>
	                    <input class="form-control" type="text" v-model="certificateTemplateForm.name" name="name" :placeholder="trans('academic.certificate_template_name')">
	                    <show-error :form-name="certificateTemplateForm" prop-name="name"></show-error>
	                </div>
	                <div class="row">
	                	<div class="col-12 col-sm-6">
		                    <div class="form-group">
		                        <div class="radio radio-success">
		                            <input type="radio" value="student" id="student" v-model="certificateTemplateForm.type" :checked="certificateTemplateForm.type" name="type" @click="certificateTemplateForm.errors.clear('type')">
		                            <label for="student">{{trans('student.student')}}</label>
		                        </div>
		                        <div class="radio radio-success">
		                            <input type="radio" value="employee" id="employee" v-model="certificateTemplateForm.type" :checked="!certificateTemplateForm.type" name="type" @click="certificateTemplateForm.errors.clear('type')">
		                            <label for="employee">{{trans('employee.employee')}}</label>
		                        </div>
		                        <show-error :form-name="certificateTemplateForm" prop-name="type"></show-error>
		                    </div>
		                </div>
	                	<div class="col-12 col-sm-6">
		                    <div class="form-group">
		                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light pull-right">{{trans('academic.add_new_certificate_template_custom_field')}}</button>
		                    </div>
	                	</div>
		            </div>
	            </div>
	            <div class="col-12 col-sm-6">
	            	<div class="form-group" v-for="(custom_field, index) in certificateTemplateForm.custom_fields">
	        			<label for="">{{trans('academic.certificate_template_custom_field')}} {{index+1}}</label>
	        			<div class="row">
	                		<div class="col-12 col-sm-11">
		                        <input class="form-control" type="text" v-model="custom_field.name" :name="getCustomFieldName(index)" :placeholder="trans('academic.certificate_template_custom_field_name')">
		                        <show-error :form-name="certificateTemplateForm" :prop-name="getCustomFieldName(index)"></show-error>
	                		</div>
	                		<div class="col-12 col-sm-1">
		                        <label for="">
		                            <button type="button" class="btn btn-xs btn-danger" :key="`${index}_delete_custom_field`" v-confirm="{ok: confirmDeleteCustomField(index)}" v-tooltip="trans('academic.delete_certificate_template_custom_field')"><i class="fas fa-times"></i></button>
		                        </label>
	                		</div>
	                	</div>
	                </div>
	            </div>
	            <div class="col-12">
	            	<p v-if="certificateTemplateForm.type">{{trans('academic.certificate_template_available_variables')}}: 
	            		<span v-if="certificateTemplateForm.type == 'student'">{{student_custom_fields.join(', ')}}</span>
	            		<span v-if="certificateTemplateForm.type == 'employee'">{{employee_custom_fields.join(', ')}}</span>
	            	</p>
                    <div class="form-group">
                        <html-editor name="body" :model.sync="certificateTemplateForm.body" height="300" :isUpdate="id ? true : false" @clearErrors="certificateTemplateForm.errors.clear('body')"></html-editor>
                        <show-error :form-name="certificateTemplateForm" prop-name="body"></show-error>
                    </div>
	            </div>	
	        </div>
	        <div class="card-footer text-right">
	            <router-link to="/configuration/academic/certificate/template" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
	            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
	            <button type="submit" class="btn btn-info waves-effect waves-light">
	                <span v-if="id">{{trans('general.update')}}</span>
	                <span v-else>{{trans('general.save')}}</span>
	            </button>
	        </div>
	    </form>
	</div>
</template>

<script>
    export default {
        data() {
            return {
                certificateTemplateForm: new Form({
                    name : '',
                    type: '',
                    body: '',
                    custom_fields: []
                }),
                student_custom_fields: [],
                employee_custom_fields: []
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();

            this.getPreRequisite();
        },
        methods: {
        	getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/academic/certificate/template/pre-requisite')
                    .then(response => {
                        this.student_custom_fields = response.student_custom_fields;
                        this.employee_custom_fields = response.employee_custom_fields;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
        	},
            addRow(){
                let new_index = this.certificateTemplateForm.custom_fields.push({
                    name: ''
                })
            },
            getCustomFieldName(index){
                return index+'_custom_field_name';
            },
            confirmDeleteCustomField(index){
                return dialog => this.deleteCustomField(index);
            },
            deleteCustomField(index){
                this.certificateTemplateForm.custom_fields.splice(index, 1);
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.certificateTemplateForm.post('/api/academic/certificate/template')
                    .then(response => {
                        toastr.success(response.message);
                        this.certificateTemplateForm.custom_fields = [];
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
                axios.get('/api/academic/certificate/template/'+this.id)
                    .then(response => {
                        this.certificateTemplateForm.name = response.name;
                        this.certificateTemplateForm.type = response.type;
                        this.certificateTemplateForm.body = response.body;
                        response.options.custom_fields.forEach(custom_field => {
                        	this.certificateTemplateForm.custom_fields.push({name: custom_field});
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/academic/certificate/template');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.certificateTemplateForm.patch('/api/academic/certificate/template/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/academic/certificate/template');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>