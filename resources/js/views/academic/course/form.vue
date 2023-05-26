<template>
    <div>
        <form @submit.prevent="proceed" @keydown="courseForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.course_name')}}</label>
                        <input class="form-control" type="text" v-model="courseForm.name" name="name" :placeholder="trans('academic.course_name')">
                        <show-error :form-name="courseForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.course_group')}} </label> <button type="button" class="btn btn-xs btn-info pull-right" v-if="hasPermission('access-configuration')" @click="showCourseGroupModal = true">{{trans('general.add_new')}}</button>
                        <v-select label="name" v-model="selected_course_group" name="course_group_id" id="course_group_id" :options="course_groups" :placeholder="trans('academic.select_course_group')" @select="onCourseGroupSelect" @close="courseForm.errors.clear('course_group_id')" @remove="courseForm.course_group_id = ''">
                            <div class="multiselect__option" slot="afterList" v-if="!course_groups.length">
                                {{trans('general.no_option_found')}}
                            </div>
                        </v-select>
                        <show-error :form-name="courseForm" prop-name="course_group_id"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.course_description')}}</label>
                        <input class="form-control" type="text" v-model="courseForm.description" name="description" :placeholder="trans('academic.course_description')">
                        <show-error :form-name="courseForm" prop-name="description"></show-error>
                    </div>
                </div>
                <!-- <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('student.attendance_type')}}</label>
                        <select v-model="courseForm.attendance_type" class="custom-select col-12" name="attendance_type" @change="courseForm.errors.clear('attendance_type')">
                          <option v-for="option in attendance_types" v-bind:value="option.value">
                            {{ option.text }}
                          </option>
                        </select>
                        <show-error :form-name="courseForm" prop-name="attendance_type"></show-error>
                    </div>
                </div> -->
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <div>{{trans('student.enable_registration')}}</div>
                        <switches class="m-t-10" v-model="courseForm.enable_registration" theme="bootstrap" color="success"></switches> 
                        <show-error :form-name="courseForm" prop-name="enable_registration"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <div>{{trans('student.enable_registration_fee')}}</div>
                        <switches class="m-t-10" v-model="courseForm.enable_registration_fee" theme="bootstrap" color="success"></switches> 
                        <show-error :form-name="courseForm" prop-name="enable_registration_fee"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3" v-if="courseForm.enable_registration_fee">
                    <div class="form-group">
                        <label for="">{{trans('student.registration_fee')}}</label>
                        <currency-input :position="default_currency.position" :symbol="default_currency.symbol" name="registration_fee" :placeholder="trans('student.registration_fee')" v-model="courseForm.registration_fee" @input.native="courseForm.errors.clear('registration_fee')"></currency-input>
                        <show-error :form-name="courseForm" prop-name="registration_fee"></show-error>
                    </div>
                </div>
            </div>

            <div class="card-footer text-right">
                <router-link to="/academic/course" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
                <button v-if="!id" type="button" class="btn btn-danger waves-effect waves-light " @click="$emit('cancel')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">
                    <span v-if="id">{{trans('general.update')}}</span>
                    <span v-else>{{trans('general.save')}}</span>
                </button>
            </div>
        </form>

        <transition name="modal" v-if="showCourseGroupModal">
            <div class="modal-mask">
                <div class="modal-wrapper">
                    <div class="modal-container modal-lg">
                        <div class="modal-header">
                            <slot name="header">
                                {{trans('academic.add_new_course_group')}}
                                <span class="float-right pointer" @click="showCourseGroupModal = false">x</span>
                            </slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body">
                                <course-group-form @completed="getPreRequisite" @cancel="showCourseGroupModal = false"></course-group-form>
                                <div class="clearfix"></div>
                            </slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    import courseGroupForm from '../../configuration/academic/course-group/form'

    export default {
        components: {courseGroupForm},
        data() {
            return {
                courseForm: new Form({
                    name : '',
                    description : '',
                    course_group_id: '',
                    attendance_type: helper.getConfig('default_attendance_type'),
                    enable_registration: '',
                    enable_registration_fee: '',
                    registration_fee: ''
                }),
                course_groups: [],
                selected_course_group: null,
                default_currency: helper.getConfig('default_currency'),
                attendance_types: [
                    {
                        "text": i18n.student.attendance_type_daily,
                        "value": "daily"
                    }
                    // {
                    //     "text": i18n.student.attendance_type_subject_wise,
                    //     "value": "subject_wise"
                    // }
                ],
                showCourseGroupModal: false
            };
        },
        props: ['id'],
        mounted() {
            if(!helper.hasPermission('create-course') && !helper.hasPermission('edit-course')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            if(this.id)
                this.get();

            this.getPreRequisite();
        },
        methods: {
            hasPermission(permission){
                return helper.hasPermission(permission);
            },
            proceed(){
                if(this.id)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/course/pre-requisite')
                    .then(response => {
                        this.course_groups = response;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            store(){
                let loader = this.$loading.show();
                this.courseForm.post('/api/course')
                    .then(response => {
                        toastr.success(response.message);
                        this.courseForm.attendance_type = helper.getConfig('default_attendance_type');
                        this.selected_course_group = null;
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
                axios.get('/api/course/'+this.id)
                    .then(response => {
                        this.courseForm.name = response.name;
                        this.courseForm.description = response.description;
                        this.courseForm.attendance_type = response.options ? response.options.attendance_type : helper.getConfig('default_attendance_type');
                        this.courseForm.enable_registration = response.options ? response.options.enable_registration : helper.getConfig('enable_registration');
                        this.courseForm.enable_registration_fee = response.options ? response.options.enable_registration_fee : helper.getConfig('enable_registration_fee');
                        this.courseForm.registration_fee = response.options ? response.options.registration_fee : helper.getConfig('registration_fee');
                        this.courseForm.course_group_id = response.course_group_id;
                        this.selected_course_group = {id: response.course_group_id, name: response.course_group.name};
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/academic/course');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.courseForm.patch('/api/course/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/academic/course');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getConfig(config) {
                return helper.getConfig(config);
            },
            onCourseGroupSelect(selectedOption){
                this.courseForm.course_group_id = selectedOption.id;
            },
            hideCourseGroupForm(){
                $('.add-course-group-form').modal('hide');
            }
        }
    }
</script>

<style>
.loading-overlay.is-full-page{
    z-index: 1060;
}
</style>