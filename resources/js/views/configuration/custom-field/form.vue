<template>
	<div>
	    <form @submit.prevent="proceed" @keydown="customFieldForm.errors.clear($event.target.name)">
	        <div class="row">
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('configuration.custom_field_form')}}</label>
                        <select v-model="customFieldForm.form" :placeholder="trans('general.select_one')" class="custom-select col-12" name="form" @change="customFieldForm.errors.clear('form')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="form in forms" v-bind:value="form.value">
                            {{ form.text }}
                          </option>
                        </select>
                        <show-error :form-name="customFieldForm" prop-name="form"></show-error>
                    </div>
                </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('configuration.custom_field_name')}}</label>
	                    <input class="form-control" type="text" v-model="customFieldForm.name" name="name" :placeholder="trans('configuration.custom_field_name')">
	                    <show-error :form-name="customFieldForm" prop-name="name"></show-error>
	                </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label class="custom-control custom-checkbox m-t-20"> <br />
                            <input type="checkbox" class="custom-control-input" v-model="customFieldForm.is_required" value="1" name="is_required">
                            <span class="custom-control-label">{{trans('configuration.custom_field_required')}}</span>
                        </label>
                        <show-error :form-name="customFieldForm" prop-name="is_required"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('configuration.custom_field_type')}}</label>
                        <select v-model="customFieldForm.type" class="custom-select col-12" name="type" @change="customFieldForm.errors.clear('type')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="type in types" v-bind:value="type.value">
                            {{ type.text }}
                          </option>
                        </select>
                        <show-error :form-name="customFieldForm" prop-name="type"></show-error>
                    </div>
                </div>
                <template v-if="customFieldForm.type === 'numeric_input'">
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('configuration.custom_field_min_value')}}</label>
                            <input class="form-control" type="number" v-model="customFieldForm.min_value" name="min_value" :placeholder="trans('configuration.custom_field_min_value')">
                            <show-error :form-name="customFieldForm" prop-name="min_value"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('configuration.custom_field_max_value')}}</label>
                            <input class="form-control" type="number" v-model="customFieldForm.max_value" name="max_value" :placeholder="trans('configuration.custom_field_max_value')">
                            <show-error :form-name="customFieldForm" prop-name="max_value"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('configuration.custom_field_decimal_place')}}</label>
                            <input class="form-control" type="number" v-model="customFieldForm.decimal_place" name="decimal_place" :placeholder="trans('configuration.custom_field_decimal_place')">
                            <show-error :form-name="customFieldForm" prop-name="decimal_place"></show-error>
                        </div>
                    </div>
                </template>
                <template v-if="customFieldForm.type === 'text_input' || customFieldForm.type === 'multi_line_input'">
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('configuration.custom_field_min_length')}}</label>
                            <input class="form-control" type="number" v-model="customFieldForm.min_length" name="min_length" :placeholder="trans('configuration.custom_field_min_length')">
                            <show-error :form-name="customFieldForm" prop-name="min_length"></show-error>
                        </div>
                    </div>
                    <div class="col-12 col-sm-4">
                        <div class="form-group">
                            <label for="">{{trans('configuration.custom_field_max_length')}}</label>
                            <input class="form-control" type="number" v-model="customFieldForm.max_length" name="max_length" :placeholder="trans('configuration.custom_field_max_length')">
                            <show-error :form-name="customFieldForm" prop-name="max_length"></show-error>
                        </div>
                    </div>
                </template>
                <div class="col-12 col-sm-4">
                    <div class="form-group">
                        <label for="">{{trans('configuration.custom_field_width')}}</label>
                        <select v-model="customFieldForm.width" class="custom-select col-12" name="width" @change="customFieldForm.errors.clear('width')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="width in widths" v-bind:value="width.value">
                            {{ width.text }}
                          </option>
                        </select>
                        <show-error :form-name="customFieldForm" prop-name="width"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-4" v-if="showValue">
                    <div class="form-group">
                        <label for="">&nbsp;</label> <br />
                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('configuration.add_new_custom_field_value')}}</button>
                    </div>
	            </div>
            </div>
            <div class="row" v-if="showValue">
	            <div class="col-12 col-sm-6">
	            	<div class="form-group" v-for="(value, index) in customFieldForm.values">
	        			<label for="">{{trans('configuration.custom_field_value')}} {{index+1}}</label>
	        			<div class="row">
	                		<div class="col-12 col-sm-8">
		                        <input class="form-control" type="text" v-model="value.name" :name="getValueName(index)" :placeholder="trans('configuration.custom_field_value_name')">
		                        <show-error :form-name="customFieldForm" :prop-name="getValueName(index)"></show-error>
	                		</div>
	                		<div class="col-12 col-sm-4">
		                        <label for="">
		                            <button type="button" class="btn btn-xs btn-danger" :key="`${index}_delete_value`" v-confirm="{ok: confirmDeleteValue(index)}" v-tooltip="trans('configuration.delete_custom_field_value')"><i class="fas fa-times"></i></button>
		                        </label>
	                		</div>
	                	</div>
	                </div>
	            </div>
	        </div>
	        <div class="card-footer text-right">
	            <router-link to="/configuration/custom-field" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                customFieldForm: new Form({
                    name : '',
                    type: '',
                    width: '',
                    form: '',
                    min_length: '',
                    max_length: '',
                    min_value: '',
                    max_value: '',
                    decimal_place: 2,
                    is_required: false,
                    values: []
                }),
                forms: [],
                types: [],
                widths: []
            };
        },
        props: ['id'],
        mounted() {
            this.getPreRequisite();
        },
        methods: {
        	getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/custom-field/pre-requisite')
                    .then(response => {
                        this.forms = response.forms;
                        this.types = response.types;
                        this.widths = response.widths;
                        
                        if(this.id)
                            this.get();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
        	},
            addRow(){
                let new_index = this.customFieldForm.values.push({
                    name: ''
                })
            },
            getValueName(index){
                return index+'_value_name';
            },
            confirmDeleteValue(index){
                return dialog => this.deleteValue(index);
            },
            deleteValue(index){
                this.customFieldForm.values.splice(index, 1);
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            store(){
                let loader = this.$loading.show();
                this.customFieldForm.post('/api/custom-field')
                    .then(response => {
                        toastr.success(response.message);
                        this.customFieldForm.values = [];
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
                axios.get('/api/custom-field/'+this.id)
                    .then(response => {
                        this.customFieldForm.name = response.name;
                        this.customFieldForm.type = response.type;
                        this.customFieldForm.form = response.form;
                        this.customFieldForm.width = response.width;
                        this.customFieldForm.is_required = response.is_required;
                        this.customFieldForm.min_length = response.options.hasOwnProperty('min_length') ? response.options.min_length : '';
                        this.customFieldForm.max_length = response.options.hasOwnProperty('max_length') ? response.options.max_length : '';
                        this.customFieldForm.min_value = response.options.hasOwnProperty('min_value') ? response.options.min_value : '';
                        this.customFieldForm.max_value = response.options.hasOwnProperty('max_value') ? response.options.max_value : '';
                        this.customFieldForm.decimal_place = response.options.hasOwnProperty('decimal_place') ? response.options.decimal_place : '';
                        response.values.forEach(value => {
                        	this.customFieldForm.values.push({name: value});
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/custom-field');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.customFieldForm.patch('/api/custom-field/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/custom-field');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        },
        computed: {
            showValue() {
                if (this.customFieldForm.type == 'checkbox_input' || this.customFieldForm.type == 'radio_input' || this.customFieldForm.type == 'dropdown_input')
                    return true;
                else
                    return false;
            }
        }
    }
</script>