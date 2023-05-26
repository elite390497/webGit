<template>
	<div>
        <form @submit.prevent="updateParent" @keydown="editParentForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <div class="form-group">
                        <label for="">{{trans('student.edit_parent')}}</label>
                        <v-select label="name" v-model="selected_student_parent" name="student_parent_id" id="student_parent_id" :options="student_parents" :placeholder="trans('student.select_parent')" @select="onStudentParentSelect" @close="editParentForm.errors.clear('student_parent_id')" @remove="editParentForm.student_parent_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!student_parents.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="editParentForm" prop-name="student_parent_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-6">
                	<button type="submit" class="btn btn-info waves-effect waves-light pull-right">{{trans('general.save')}}</button>
                </div>
            </div>
        </form>

        <hr />

	    <form @submit.prevent="submit" @keydown="parentForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('general.relation')}}</label>
                        <select v-model="parentForm.first_guardian_relation" class="custom-select col-12" name="first_guardian_relation" @change="parentForm.errors.clear('first_guardian_relation')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                            {{ relation.name }}
                          </option>
                        </select>
	                    <show-error :form-name="parentForm" prop-name="first_guardian_relation"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('general.relation')}}</label>
                        <select v-model="parentForm.second_guardian_relation" class="custom-select col-12" name="second_guardian_relation" @change="parentForm.errors.clear('second_guardian_relation')">
                          <option value="">{{trans('general.select_one')}}</option>
                          <option v-for="relation in guardian_relations" v-bind:value="relation.id">
                            {{ relation.name }}
                          </option>
                        </select>
	                    <show-error :form-name="parentForm" prop-name="second_guardian_relation"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_name')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_name" name="first_guardian_name" :placeholder="trans('student.first_guardian_name')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_name"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_name')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_name" name="second_guardian_name" :placeholder="trans('student.second_guardian_name')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_name"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_date_of_birth')}}</label>
	                    <datepicker v-model="parentForm.first_guardian_date_of_birth" :bootstrapStyling="true" @selected="parentForm.errors.clear('first_guardian_date_of_birth')" :placeholder="trans('student.first_guardian_date_of_birth')"></datepicker>
	                    <show-error :form-name="parentForm" prop-name="first_guardian_date_of_birth"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_date_of_birth')}}</label>
	                    <datepicker v-model="parentForm.second_guardian_date_of_birth" :bootstrapStyling="true" @selected="parentForm.errors.clear('second_guardian_date_of_birth')" :placeholder="trans('student.second_guardian_date_of_birth')"></datepicker>
	                    <show-error :form-name="parentForm" prop-name="second_guardian_date_of_birth"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_qualification')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_qualification" name="first_guardian_qualification" :placeholder="trans('student.first_guardian_qualification')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_qualification"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_qualification')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_qualification" name="second_guardian_qualification" :placeholder="trans('student.second_guardian_qualification')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_qualification"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_occupation')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_occupation" name="first_guardian_occupation" :placeholder="trans('student.first_guardian_occupation')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_occupation"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_occupation')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_occupation" name="second_guardian_occupation" :placeholder="trans('student.second_guardian_occupation')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_occupation"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_annual_income')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_annual_income" name="first_guardian_annual_income" :placeholder="trans('student.first_guardian_annual_income')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_annual_income"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_annual_income')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_annual_income" name="second_guardian_annual_income" :placeholder="trans('student.second_guardian_annual_income')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_annual_income"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_email')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_email" name="first_guardian_email" :placeholder="trans('student.first_guardian_email')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_email"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_email')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_email" name="second_guardian_email" :placeholder="trans('student.second_guardian_email')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_email"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_contact_number_1')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_contact_number_1" name="first_guardian_contact_number_1" :placeholder="trans('student.first_guardian_contact_number_1')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_contact_number_1"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_contact_number_1')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_contact_number_1" name="second_guardian_contact_number_1" :placeholder="trans('student.second_guardian_contact_number_1')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_contact_number_1"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_contact_number_2')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_contact_number_2" name="first_guardian_contact_number_2" :placeholder="trans('student.first_guardian_contact_number_2')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_contact_number_2"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_contact_number_2')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_contact_number_2" name="second_guardian_contact_number_2" :placeholder="trans('student.second_guardian_contact_number_2')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_contact_number_2"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.first_guardian_unique_identification_number')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.first_guardian_unique_identification_number" name="first_guardian_unique_identification_number" :placeholder="trans('student.first_guardian_unique_identification_number')">
	                    <show-error :form-name="parentForm" prop-name="first_guardian_unique_identification_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('student.second_guardian_unique_identification_number')}}</label>
	                    <input class="form-control" type="text" v-model="parentForm.second_guardian_unique_identification_number" name="second_guardian_unique_identification_number" :placeholder="trans('student.second_guardian_unique_identification_number')">
	                    <show-error :form-name="parentForm" prop-name="second_guardian_unique_identification_number"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	            	<upload-image id="first_guardian_photo" :upload-path="`/student/first-guardian/photo/${student.uuid}`" :remove-path="`/student/first-guardian/photo/remove/${student.uuid}`" :image-source="first_guardian_photo" @uploaded="updateFirstGuardian" @removed="updateFirstGuardian"></upload-image>
	            </div>
	            <div class="col-12 col-sm-6">
	            	<upload-image id="second_guardian_photo" :upload-path="`/student/second-guardian/photo/${student.uuid}`" :remove-path="`/student/second-guardian/photo/remove/${student.uuid}`" :image-source="second_guardian_photo" @uploaded="updateSecondGuardian" @removed="updateSecondGuardian"></upload-image>
	            </div>
	        </div>

	        <custom-field :fields="custom_fields" :customValues="custom_values" :clear="clearCustomField" :formErrors="customFieldFormErrors" @updateCustomValues="updateCustomValues"></custom-field>
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
				parentForm: new Form({
					first_guardian_name: null,
					first_guardian_relation: null,
					second_guardian_name: null,
					second_guardian_relation: null,
		          	first_guardian_email: null,
		          	second_guardian_email: null,
		          	first_guardian_date_of_birth: null,
		          	second_guardian_date_of_birth: null,
		          	first_guardian_qualification: null,
		          	second_guardian_qualification: null,
		          	first_guardian_occupation: null,
		          	second_guardian_occupation: null,
		          	first_guardian_annual_income: null,
		          	second_guardian_annual_income: null,
		          	first_guardian_contact_number_1: null,
		          	second_guardian_contact_number_1: null,
		          	first_guardian_contact_number_2: null,
		          	second_guardian_contact_number_2: null,
		          	first_guardian_unique_identification_number: null,
		          	second_guardian_unique_identification_number: null,
					type: 'parent',
                    custom_values: []
				},false),
				first_guardian_photo: '',
				second_guardian_photo: '',
				student_parents: [],
				editParentForm: new Form({
					student_parent_id: ''
				}),
                selected_student_parent: null,
                guardian_relations: [],
                custom_fields: [],
                custom_values: [],
                clearCustomField: false,
                customFieldFormErrors: {}
			}
		},
		mounted(){
            if(!helper.hasPermission('edit-student')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getParents();
		},
		methods: {
            updateCustomValues(value) {
                this.parentForm.custom_values = value;
            },
            onStudentParentSelect(selectedOption){
                this.editParentForm.student_parent_id = selectedOption.id;
            },
			getParents(){
				let loader = this.$loading.show();
				axios.get('/api/student/pre-requisite?form_type=student_parent')
					.then(response => {
						this.custom_fields = response.custom_fields;
						this.student_parents = response.student_parents;
						this.guardian_relations = response.guardian_relations;
						this.get(this.student);
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			get(student){
				let parent = student.parent;
				if (parent) {
		          	this.parentForm.first_guardian_name = parent.first_guardian_name;
		          	this.parentForm.first_guardian_relation = parent.first_guardian_relation;
		          	this.parentForm.second_guardian_name = parent.second_guardian_name;
		          	this.parentForm.second_guardian_relation = parent.second_guardian_relation;
		          	this.parentForm.first_guardian_date_of_birth = parent.first_guardian_date_of_birth;
		          	this.parentForm.second_guardian_date_of_birth = parent.second_guardian_date_of_birth;
		          	this.parentForm.first_guardian_qualification = parent.first_guardian_qualification;
		          	this.parentForm.second_guardian_qualification = parent.second_guardian_qualification;
		          	this.parentForm.first_guardian_occupation = parent.first_guardian_occupation;
		          	this.parentForm.second_guardian_occupation = parent.second_guardian_occupation;
		          	this.parentForm.first_guardian_annual_income = parent.first_guardian_annual_income;
		          	this.parentForm.second_guardian_annual_income = parent.second_guardian_annual_income;
		          	this.parentForm.first_guardian_email = parent.first_guardian_email;
		          	this.parentForm.second_guardian_email = parent.second_guardian_email;
		          	this.parentForm.first_guardian_contact_number_1 = parent.first_guardian_contact_number_1;
		          	this.parentForm.second_guardian_contact_number_1 = parent.second_guardian_contact_number_1;
		          	this.parentForm.first_guardian_contact_number_2 = parent.first_guardian_contact_number_2;
		          	this.parentForm.second_guardian_contact_number_2 = parent.second_guardian_contact_number_2;
		          	this.parentForm.first_guardian_unique_identification_number = parent.first_guardian_unique_identification_number;
		          	this.parentForm.second_guardian_unique_identification_number = parent.second_guardian_unique_identification_number;
		          	this.first_guardian_photo = parent.first_guardian_photo;
		          	this.second_guardian_photo = parent.second_guardian_photo;
		          	this.custom_values = parent.options && parent.options.hasOwnProperty('custom_values') ? parent.options.custom_values : [];
				}
	          },
			submit(){
				let loader = this.$loading.show();
				this.parentForm.patch('/api/student/'+this.student.uuid)
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
			updateParent(){
				let loader = this.$loading.show();
				this.editParentForm.post('/api/student/'+this.student.uuid+'/parent')
					.then(response => {
						this.$emit('completed');
						toastr.success(response.message);
						loader.hide();
					})
					.catch(error => {
						loader.hide();
						helper.showErrorMsg(error);
					})
			},
			updateFirstGuardian(){

			},
			updateSecondGuardian(){
				
			}
		},
		watch: { 
      		student(student) {
      			this.get(student);
	        }
	    }
	}
</script>