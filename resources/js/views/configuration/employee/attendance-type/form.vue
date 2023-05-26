<template>
    <form @submit.prevent="proceed" @keydown="attendanceTypeForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.attendance_type_name')}}</label>
                    <input class="form-control" type="text" v-model="attendanceTypeForm.name" name="name" :placeholder="trans('employee.attendance_type_name')">
                    <show-error :form-name="attendanceTypeForm" prop-name="name"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.attendance_type_alias')}}</label>
                    <input class="form-control" type="text" v-model="attendanceTypeForm.alias" name="alias" :placeholder="trans('employee.attendance_type_alias')">
                    <show-error :form-name="attendanceTypeForm" prop-name="alias"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.attendance_type')}}</label>
                    <select v-model="attendanceTypeForm.type" class="custom-select col-12" name="type" @change="attendanceTypeForm.errors.clear('type')">
                      <option value="null">{{trans('general.select_one')}}</option>
                      <option v-for="option in types" v-bind:value="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                    <show-error :form-name="attendanceTypeForm" prop-name="type"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3" v-if="attendanceTypeForm.type == 'production_based_earning' || attendanceTypeForm.type == 'production_based_deduction'">
                <div class="form-group">
                    <label for="">{{trans('employee.attendance_type_unit')}}</label>
                    <input class="form-control" type="text" v-model="attendanceTypeForm.unit" name="unit" :placeholder="trans('employee.attendance_type_unit')">
                    <show-error :form-name="attendanceTypeForm" prop-name="unit"></show-error>
                </div>
            </div>
            <div class="col-12 col-sm-3">
                <div class="form-group">
                    <label for="">{{trans('employee.attendance_type_is_active')}}</label>
                    <br />
                    <switches class="" v-model="attendanceTypeForm.is_active" theme="bootstrap" color="success"></switches> 
                </div>
            </div>
            <div class="col-12 col-sm-12">
                <div class="form-group">
                    <label for="">{{trans('employee.attendance_type_description')}}</label>
                    <input class="form-control" type="text" v-model="attendanceTypeForm.description" name="description" :placeholder="trans('employee.attendance_type_description')">
                    <show-error :form-name="attendanceTypeForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <router-link to="/configuration/employee/attendance/type" class="btn btn-danger waves-effect waves-light " v-show="id">{{trans('general.cancel')}}</router-link>
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
                attendanceTypeForm: new Form({
                    type: null,
                    name: '',
                    alias: '',
                    unit: '',
                    is_active: 0,
                    description : ''
                }),
                types: [
                    {
                        text: i18n.employee.attendance_type_present,
                        value: 'present'
                    },
                    {
                        text: i18n.employee.attendance_type_holiday,
                        value: 'holiday'
                    },
                    {
                        text: i18n.employee.attendance_type_absent,
                        value: 'absent'
                    },
                    {
                        text: i18n.employee.attendance_type_half_day,
                        value: 'half_day'
                    },
                    {
                        text: i18n.employee.attendance_type_production_based_earning,
                        value: 'production_based_earning'
                    },
                    {
                        text: i18n.employee.attendance_type_production_based_deduction,
                        value: 'production_based_deduction'
                    }
                ]
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
                this.attendanceTypeForm.post('/api/employee/attendance/type')
                    .then(response => {
                        toastr.success(response.message);
                        this.attendanceTypeForm.type = null;
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
                axios.get('/api/employee/attendance/type/'+this.id)
                    .then(response => {
                        this.attendanceTypeForm.type = response.type;
                        this.attendanceTypeForm.name = response.name;
                        this.attendanceTypeForm.alias = response.alias;
                        this.attendanceTypeForm.unit = response.unit;
                        this.attendanceTypeForm.is_active = response.is_active;
                        this.attendanceTypeForm.description = response.description;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                        this.$router.push('/configuration/employee/attendance/type');
                    });
            },
            update(){
                let loader = this.$loading.show();
                this.attendanceTypeForm.patch('/api/employee/attendance/type/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/configuration/employee/attendance/type');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
        }
    }
</script>
