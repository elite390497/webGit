<template>
    <form @submit.prevent="proceed" @keydown="designationForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.designation_name')}}</label>
                    <input class="form-control" type="text" v-model="designationForm.name" name="name" :placeholder="trans('employee.designation_name')">
                    <show-error :form-name="designationForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <div>{{trans('employee.is_teaching_employee')}}</div>
                    <switches class="m-t-20" v-model="designationForm.is_teaching_employee" theme="bootstrap" color="success"></switches> 
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.category')}}</label>
                    <v-select label="name" v-model="selected_employee_category" name="employee_category_id" id="employee_category_id" :options="employee_categories" :placeholder="trans('employee.select_employee_category')" @select="onEmployeeCategorySelect" @close="designationForm.errors.clear('employee_category_id')" @remove="designationForm.employee_category_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!employee_categories.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="designationForm" prop-name="employee_category_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.top_designation')}}</label>
                    <v-select label="name" v-model="selected_top_designation" name="top_designation_id" id="top_designation_id" :options="top_designations" :placeholder="trans('employee.select_top_designation')" @select="onTopDesignationSelect" @close="designationForm.errors.clear('top_designation_id')" @remove="designationForm.top_designation_id = ''">
                        <div class="multiselect__option" slot="afterList" v-if="!top_designations.length">
                            {{trans('general.no_option_found')}}
                        </div>
                    </v-select>
                    <show-error :form-name="designationForm" prop-name="top_designation_id"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.designation_description')}}</label>
                    <input class="form-control" type="text" v-model="designationForm.description" name="description" :placeholder="trans('employee.designation_description')">
                    <show-error :form-name="designationForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/employee/designation" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
            <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
            <button type="submit" class="btn btn-info waves-effect waves-light">
                <span v-if="id">{{trans('general.update')}}</span>
                <span v-else>{{trans('general.save')}}</span>
            </button>
        </div>
    </form>
</template>


<script>
    export default {
        components: {},
        data() {
            return {
                designationForm: new Form({
                    name : '',
                    description : '',
                    employee_category_id: '',
                    top_designation_id: '',
                    is_teaching_employee: false
                }),
                employee_categories: [],
                top_designations: [],
                selected_employee_category: null,
                selected_top_designation: null
            };
        },
        props: ['id'],
        mounted() {
            if(this.id)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/employee/designation/pre-requisite')
                    .then(response => {
                        this.employee_categories = response.employee_categories;
                        this.top_designations = response.top_designations;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            store(){
                let loader = this.$loading.show();
                this.designationForm.post('/api/employee/designation')
                    .then(response => {
                        toastr.success(response.message);
                        this.selected_employee_category = null;
                        this.selected_top_designation = null;
                        this.top_designations.push(response.new_designation);
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
                axios.get('/api/employee/designation/'+this.id)
                    .then(response => {

                        if (response.designation.name == helper.getConfig('system_admin_designation')) {
                            toastr.error(i18n.user.permission_denied);
                            loader.hide();
                            this.$router.push('/configuration/employee/designation');
                        }

                        this.designationForm.name = response.designation.name;
                        this.designationForm.description = response.designation.description;
                        this.designationForm.is_teaching_employee = response.designation.is_teaching_employee;
                        this.designationForm.employee_category_id = response.designation.employee_category_id;
                        this.designationForm.top_designation_id = response.designation.top_designation_id;
                        this.selected_employee_category = response.selected_employee_category;
                        this.selected_top_designation = response.selected_top_designation;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/employee/designation');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.designationForm.patch('/api/employee/designation/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/employee/designation');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            onEmployeeCategorySelect(selectedOption){
                this.designationForm.employee_category_id = selectedOption.id;
            },
            onTopDesignationSelect(selectedOption){
                this.designationForm.top_designation_id = selectedOption.id;
            }
        }
    }
</script>
