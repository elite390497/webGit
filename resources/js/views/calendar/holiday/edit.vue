<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('calendar.edit_holiday')}}</h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/calendar/holiday')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('calendar.holiday')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body p-t-20">
                    <form @submit.prevent="update" @keydown="holidayForm.errors.clear($event.target.name)">
                        <div class="row">
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('calendar.holiday_date')}}</label>
                                    <datepicker v-model="holidayForm.date" :bootstrapStyling="true" @selected="holidayForm.errors.clear('date')" :placeholder="trans('calendar.holiday_date')" :disabledDates="disabled"></datepicker>
                                    <show-error :form-name="holidayForm" prop-name="date"></show-error>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="form-group">
                                    <label for="">{{trans('calendar.holiday_description')}}</label>
                                    <autosize-textarea v-model="holidayForm.description" rows="1" name="description" :placeholder="trans('calendar.holiday_description')"></autosize-textarea>
                                    <show-error :form-name="holidayForm" prop-name="description"></show-error>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer text-right">
                            <router-link to="/calendar/holiday" class="btn btn-danger waves-effect waves-light ">{{trans('general.cancel')}}</router-link>
                            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.update')}}</span></button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components : {  },
        data() {
            return {
                id:this.$route.params.id,
                holidayForm: new Form({
                    date: '',
                    description: ''
                }),
                existing_holidays: [],
                disabled: {
                    dates: []
                }
            }
        },
        mounted(){
            if(!helper.hasPermission('edit-holiday')){
                helper.notAccessibleMsg();
                this.$router.push('/dashboard');
            }

            this.getHoliday();
        },
        methods: {
            getHoliday(){
                let loader = this.$loading.show();
                axios.get('/api/holiday/'+this.id)
                    .then(response => {
                        this.holidayForm.date = response.holiday.date;
                        this.holidayForm.description = response.holiday.description;
                        this.existing_holidays = response.existing_holidays;
                        this.existing_holidays.forEach(date => {
                            if (date != this.holidayForm.date)
                                this.disabled.dates.push(new Date(date));
                        });
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.holidayForm.patch('/api/holiday/'+this.id)
                    .then(response => {
                        toastr.success(response.message);
                        this.$router.push('/calendar/holiday');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        }
    }
</script>
