<template>
	<div>
	    <form @submit.prevent="submit" @keydown="basicForm.errors.clear($event.target.name)">
            <div class="row">
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('student.first_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.first_name" name="first_name" :placeholder="trans('student.first_name')">
	                    <show-error :form-name="basicForm" prop-name="first_name"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('student.middle_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.middle_name" name="middle_name" :placeholder="trans('student.middle_name')">
	                    <show-error :form-name="basicForm" prop-name="middle_name"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('student.last_name')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.last_name" name="last_name" :placeholder="trans('student.last_name')">
	                    <show-error :form-name="basicForm" prop-name="last_name"></show-error>
                    </div>
    			</div>
	            <div class="col-12 col-sm-4">
	                <div class="form-group">
	                    <label for="">{{trans('student.gender')}}</label>
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
	                    <label for="">{{trans('student.date_of_birth')}}</label>
	                    <datepicker v-model="basicForm.date_of_birth" :bootstrapStyling="true" @selected="basicForm.errors.clear('date_of_birth')" :placeholder="trans('student.date_of_birth')"></datepicker>
	                    <show-error :form-name="basicForm" prop-name="date_of_birth"></show-error>
	                </div>
	            </div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('student.birth_place')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.birth_place" name="birth_place" :placeholder="trans('student.birth_place')">
	                    <show-error :form-name="basicForm" prop-name="birth_place"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('student.unique_identification_number')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.unique_identification_number" name="unique_identification_number" :placeholder="trans('student.unique_identification_number')">
	                    <show-error :form-name="basicForm" prop-name="unique_identification_number"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('student.nationality')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.nationality" name="nationality" :placeholder="trans('student.nationality')">
	                    <show-error :form-name="basicForm" prop-name="nationality"></show-error>
                    </div>
    			</div>
    			<div class="col-12 col-sm-4">
                    <div class="form-group">
            			<label for="">{{trans('student.mother_tongue')}}</label>
	                    <input class="form-control" type="text" v-model="basicForm.mother_tongue" name="mother_tongue" :placeholder="trans('student.mother_tongue')">
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
		props: ['student'],
		data() {
			return {
				basicForm: new Form({
					first_name: '',
					middle_name: '',
					last_name: '',
					date_of_birth: '',
					gender: '',
					mother_tongue: '',
					unique_identification_number: '',
					birth_place: '',
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
				customFieldFormErrors: {}
			}
		},
		mounted(){
            if(!helper.hasPermission('edit-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getPreRequisite();
	        this.get(this.student);
		},
		methods: {
			getPreRequisite(){
	            let loader = this.$loading.show();
	            axios.get('/api/student/pre-requisite?form_type=student_basic')
	            	.then(response => {
	            		this.castes = response.castes;
	            		this.religions = response.religions;
	            		this.blood_groups = response.blood_groups;
	            		this.categories = response.categories;
	            		this.genders = response.genders;
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
			get(student){
	          	this.basicForm.first_name = student.first_name;
	          	this.basicForm.middle_name = student.middle_name || '';
	          	this.basicForm.last_name = student.last_name || '';
	          	this.basicForm.date_of_birth = student.date_of_birth;
	          	this.basicForm.birth_place = student.birth_place;
	          	this.basicForm.nationality = student.nationality;
	          	this.basicForm.gender = student.gender;
	          	this.basicForm.unique_identification_number = student.unique_identification_number;
	          	this.basicForm.mother_tongue = student.mother_tongue;
	          	this.basicForm.caste_id = student.caste_id;
	          	this.basicForm.category_id = student.category_id;
	          	this.basicForm.religion_id = student.religion_id;
	          	this.basicForm.blood_group_id = student.blood_group_id;
	          	this.selected_caste = student.caste_id ? {id: student.caste_id, name: student.caste.name} : null;
	          	this.selected_category = student.category_id ? {id: student.category_id, name: student.category.name} : null;
	          	this.selected_religion = student.religion_id ? {id: student.religion_id, name: student.religion.name} : null;
	          	this.selected_blood_group = student.blood_group_id ? {id: student.blood_group_id, name: student.blood_group.name} : null;
	          	this.custom_values = student.options && student.options.hasOwnProperty('custom_values') ? student.options.custom_values : [];
	        },
			submit(){
				let loader = this.$loading.show();
				this.basicForm.patch('/api/student/'+this.student.uuid)
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
      		student(student) {
      			this.get(student);
	        }
	    }
	}
</script>