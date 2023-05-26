<template>
	<div>
	    <form @submit.prevent="submit" @keydown="basicForm.errors.clear($event.target.name)">
            <div class="row">
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.first_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.first_name" name="first_name" :placeholder="trans('employee.first_name')">
	                    <show-error :form-name="basicForm" prop-name="first_name"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.middle_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.middle_name" name="middle_name" :placeholder="trans('employee.middle_name')">
	                    <show-error :form-name="basicForm" prop-name="middle_name"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.last_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.last_name" name="last_name" :placeholder="trans('employee.last_name')">
	                    <show-error :form-name="basicForm" prop-name="last_name"></show-error>
                    </div>
    			</div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.gender')}}</label>
                        <div class="radio radio-info p-l-0">
                            <div class="form-check form-check-inline " v-for="gender in genders">
                                <input class="form-check-input" type="radio" :value="gender.id" :id="gender.id" v-model="basicForm.gender" :checked="basicForm.gender == gender.id" name="gender" @click="basicForm.errors.clear('gender')">
                                <label class="form-check-label" :for="gender.id"> {{trans('list.'+gender.id)}}</label>
                            </div>
                        </div>
	                    <show-error :form-name="basicForm" prop-name="gender"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.marital_status')}}</label>
                        <select v-model="basicForm.marital_status" class="custom-select col-12" name="marital_status" @change="basicForm.errors.clear('marital_status')" required>
                          <option value=null disabled selected>{{trans('general.select_one')}}</option>
                          <option v-for="marital_status in marital_statuses" v-bind:value="marital_status.id">
                            {{trans('list.'+marital_status.id)}}
                          </option>
                        </select>
	                    <show-error :form-name="basicForm" prop-name="marital_status"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.date_of_birth')}}</label>
	                    <datepicker v-model="basicForm.date_of_birth" :bootstrapStyling="true" @selected="basicForm.errors.clear('date_of_birth')" :placeholder="trans('employee.date_of_birth')"></datepicker>
	                    <show-error :form-name="basicForm" prop-name="date_of_birth"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('employee.date_of_anniversary')}}</label>
	                    <datepicker v-model="basicForm.date_of_anniversary" :bootstrapStyling="true" @selected="basicForm.errors.clear('date_of_anniversary')" :placeholder="trans('employee.date_of_anniversary')"></datepicker>
	                    <show-error :form-name="basicForm" prop-name="date_of_anniversary"></show-error>
	                </div>
	            </div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.unique_identification_number')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.unique_identification_number" name="unique_identification_number" :placeholder="trans('employee.unique_identification_number')">
	                    <show-error :form-name="basicForm" prop-name="unique_identification_number"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.father_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.father_name" name="father_name" :placeholder="trans('employee.father_name')">
	                    <show-error :form-name="basicForm" prop-name="father_name"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.mother_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.mother_name" name="mother_name" :placeholder="trans('employee.mother_name')">
	                    <show-error :form-name="basicForm" prop-name="mother_name"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.nationality')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.nationality" name="nationality" :placeholder="trans('employee.nationality')">
	                    <show-error :form-name="basicForm" prop-name="nationality"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('employee.mother_tongue')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.mother_tongue" name="mother_tongue" :placeholder="trans('employee.mother_tongue')">
	                    <show-error :form-name="basicForm" prop-name="mother_tongue"></show-error>
                    </div>
    			</div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('misc.caste')}}</label>
	                    <v-select label="name" v-model="selected_caste" name="caste_id" id="caste_id" :options="castes" :placeholder="trans('misc.select_caste')" @select="onCasteSelect" @close="basicForm.errors.clear('caste_id')" @remove="basicForm.caste_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!castes.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
	                    <show-error :form-name="basicForm" prop-name="caste_id"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('misc.category')}}</label>
	                    <v-select label="name" v-model="selected_category" name="category_id" id="category_id" :options="categories" :placeholder="trans('misc.select_category')" @select="onCategorySelect" @close="basicForm.errors.clear('category_id')" @remove="basicForm.category_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!categories.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
	                    <show-error :form-name="basicForm" prop-name="category_id"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('misc.religion')}}</label>
	                    <v-select label="name" v-model="selected_religion" name="religion_id" id="religion_id" :options="religions" :placeholder="trans('misc.select_religion')" @select="onReligionSelect" @close="basicForm.errors.clear('religion_id')" @remove="basicForm.religion_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!religions.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
	                    <show-error :form-name="basicForm" prop-name="religion_id"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('misc.blood_group')}}</label>
	                    <v-select label="name" v-model="selected_blood_group" name="blood_group_id" id="blood_group_id" :options="blood_groups" :placeholder="trans('misc.select_blood_group')" @select="onBloodGroupSelect" @close="basicForm.errors.clear('blood_group_id')" @remove="basicForm.blood_group_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!blood_groups.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
	                    <show-error :form-name="basicForm" prop-name="blood_group_id"></show-error>
	                </div>
	            </div>
    		</div>
    		<custom-field :fields="custom_fields" :customValues="custom_values" :formErrors="customFieldFormErrors" @updateCustomValues="updateCustomValues"></custom-field>
            <div class="card-footer text-right">
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
	   	</form>
	</div>
</template>

<script>
	export default {
		components: {},
		props: ['employee'],
		data() {
			return {
				basicForm: new Form({
					first_name: '',
					middle_name: '',
					last_name: '',
					date_of_birth: '',
					date_of_anniversary: '',
					father_name: '',
					mother_name: '',
					marital_status: '',
					gender: '',
					mother_tongue: '',
					unique_identification_number: '',
					nationality: '',
					caste_id: '',
					category_id: '',
					religion_id: '',
					blood_group_id: '',
					custom_values: [],
					type: 'basic'
				},false),
				custom_fields: [],
				custom_values: [],
				castes: [],
                selected_caste: null,
				religions: [],
                selected_religion: null,
				blood_groups: [],
                selected_blood_group: null,
				categories: [],
                selected_category: null,
				genders: [],
				marital_statuses: [],
				customFieldFormErrors: {}
			}
		},
		mounted(){
            if(!helper.hasPermission('edit-employee')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
	        this.get(this.employee);
		},
		methods: {
			getPreRequisite(){
	            let loader = this.$loading.show();
	            axios.get('/api/employee/basic/pre-requisite?form_type=employee_basic')
	            	.then(response => {
	            		this.castes = response.castes;
	            		this.religions = response.religions;
	            		this.blood_groups = response.blood_groups;
	            		this.categories = response.categories;
	            		this.genders = response.genders;
	            		this.marital_statuses = response.marital_statuses;
	            		this.custom_fields = response.custom_fields;
	            		loader.hide();
	            	})
	            	.catch(error => {
	            		loader.hide();
	            		helper.showErrorMsg(error);
	            	});	
			},
			updateCustomValues(value) {
				this.basicForm.custom_values = value;
			},
			get(employee){
	          	this.basicForm.first_name = employee.first_name;
	          	this.basicForm.middle_name = employee.middle_name;
	          	this.basicForm.last_name = employee.last_name;
	          	this.basicForm.date_of_birth = employee.date_of_birth;
	          	this.basicForm.date_of_anniversary = employee.date_of_anniversary;
	          	this.basicForm.father_name = employee.father_name;
	          	this.basicForm.mother_name = employee.mother_name;
	          	this.basicForm.nationality = employee.nationality;
	          	this.basicForm.gender = employee.gender;
	          	this.basicForm.marital_status = employee.marital_status;
	          	this.basicForm.unique_identification_number = employee.unique_identification_number;
	          	this.basicForm.mother_tongue = employee.mother_tongue;
	          	this.basicForm.caste_id = employee.caste_id;
	          	this.basicForm.category_id = employee.category_id;
	          	this.basicForm.religion_id = employee.religion_id;
	          	this.basicForm.blood_group_id = employee.blood_group_id;
	          	this.selected_caste = employee.caste_id ? {id: employee.caste_id, name: employee.caste.name} : null;
	          	this.selected_category = employee.category_id ? {id: employee.category_id, name: employee.category.name} : null;
	          	this.selected_religion = employee.religion_id ? {id: employee.religion_id, name: employee.religion.name} : null;
	          	this.selected_blood_group = employee.blood_group_id ? {id: employee.blood_group_id, name: employee.blood_group.name} : null;
	          	this.custom_values = employee.options && employee.options.hasOwnProperty('custom_values') ? employee.options.custom_values : [];
	        },
			submit(){
				let loader = this.$loading.show();
				this.basicForm.patch('/api/employee/'+this.employee.uuid)
					.then(response => {
						this.$emit('complete');
						toastr.success(response.message);
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						this.customFieldFormErrors = error;
						helper.showErrorMsg(error);
					})
			},
			onCasteSelect(selectedOption){
				this.basicForm.caste_id = selectedOption.id;
			},
			onCategorySelect(selectedOption){
				this.basicForm.category_id = selectedOption.id;
			},
			onReligionSelect(selectedOption){
				this.basicForm.religion_id = selectedOption.id;
			},
			onBloodGroupSelect(selectedOption){
				this.basicForm.blood_group_id = selectedOption.id;
			}
		},
		watch: { 
      		employee(employee) {
      			this.get(employee);
	        }
	    }
	}
</script>