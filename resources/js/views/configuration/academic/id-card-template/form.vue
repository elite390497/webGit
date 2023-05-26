<template>
	<div>
	    <form @submit.prevent="proceed" @keydown="idCardTemplateForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('academic.id_card_template_name')}}</label>
	                    <input class="form-control" type="text" v-model="idCardTemplateForm.name" name="name" :placeholder="trans('academic.id_card_template_name')">
	                    <show-error :form-name="idCardTemplateForm" prop-name="name"></show-error>
	                </div>
	                <div class="row">
	                	<div class="col-12 col-sm-6">
		                    <div class="form-group">
		                        <div class="radio radio-success">
		                            <input type="radio" value="student" id="student" v-model="idCardTemplateForm.type" :checked="idCardTemplateForm.type" name="type" @click="idCardTemplateForm.errors.clear('type')">
		                            <label for="student">{{trans('student.student')}}</label>
		                        </div>
		                        <div class="radio radio-success">
		                            <input type="radio" value="employee" id="employee" v-model="idCardTemplateForm.type" :checked="!idCardTemplateForm.type" name="type" @click="idCardTemplateForm.errors.clear('type')">
		                            <label for="employee">{{trans('employee.employee')}}</label>
		                        </div>
		                        <show-error :form-name="idCardTemplateForm" prop-name="type"></show-error>
		                    </div>
		                </div>
		            </div>
	            </div>
                <div class="col-12 col-sm-6">
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('academic.id_card_template_width')}}</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" v-model="idCardTemplateForm.width" name="width" :placeholder="trans('academic.id_card_template_width')">
                                    <div class="input-group-append"><span class="input-group-text">mm</span></div>
                                </div>
                                <show-error :form-name="idCardTemplateForm" prop-name="width"></show-error>
                            </div>
                        </div>
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('academic.id_card_template_height')}}</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" v-model="idCardTemplateForm.height" name="height" :placeholder="trans('academic.id_card_template_height')">
                                    <div class="input-group-append"><span class="input-group-text">mm</span></div>
                                </div>
                                <show-error :form-name="idCardTemplateForm" prop-name="height"></show-error>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 col-sm-6">
                            <div class="form-group">
                                <label for="">{{trans('academic.id_card_template_per_page_limit')}}</label>
                                <input class="form-control" type="text" v-model="idCardTemplateForm.per_page_limit" name="per_page_limit" :placeholder="trans('academic.id_card_template_per_page_limit')">
                                <show-error :form-name="idCardTemplateForm" prop-name="per_page_limit"></show-error>
                            </div>
                        </div>
                    </div>
                </div>
	        </div>
	        <div class="card-footer text-right">
	            <router-link to="/configuration/academic/id-card/template" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                idCardTemplateForm: new Form({
                    name : '',
                    type: '',
                    per_page_limit: '',
                    height: '',
                    width: ''
                })
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.idCardTemplateForm.post('/api/academic/id-card/template')
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
            get(){
                let loader = this.$loading.show();
                axios.get('/api/academic/id-card/template/'+this.id)
                    .then(response => {
                        this.idCardTemplateForm.name = response.name;
                        this.idCardTemplateForm.type = response.type;
                        this.idCardTemplateForm.height = response.height;
                        this.idCardTemplateForm.width = response.width;
                        this.idCardTemplateForm.per_page_limit = response.options.per_page_limit;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/academic/id-card/template');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.idCardTemplateForm.patch('/api/academic/id-card/template/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/academic/id-card/template');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>