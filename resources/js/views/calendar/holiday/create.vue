<template>
    <form @submit.prevent="submit" @keydown="holidayForm.errors.clear($event.target.name)">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="">{{trans('calendar.holiday_date')}}</label>
                    <datepicker v-model="date" :bootstrapStyling="true" @selected="onSelected" :placeholder="trans('calendar.holiday_date')" :highlighted="highlighted" :disabledDates="disabled"></datepicker>
                    <show-error :form-name="holidayForm" prop-name="dates"></show-error>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <span class="label label-info m-r-10 m-b-10 p-10" v-for="date in holidayForm.dates">
                        {{date | momentWithDay}} <i class="fas fa-times-circle cursor" v-tooltip="trans('general.remove')" @click="remove(date)"></i>
                    </span>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label for="">{{trans('calendar.holiday_description')}}</label>
                    <autosize-textarea v-model="holidayForm.description" rows="1" name="description" :placeholder="trans('calendar.holiday_description')"></autosize-textarea>
                    <show-error :form-name="holidayForm" prop-name="description"></show-error>
                </div>
            </div>
        </div>
        <div class="card-footer text-right">
            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</span></button>
        </div>
    </form>
</template>

<script>
	export default {
        components: {},
        props: ['disabledDates'],
        data() {
        	return {
        		date: '',
        		holidayForm: new Form({
        			dates: [],
        			description: ''
        		}),
        		highlighted: {
        			dates: []
        		},
                disabled: {
                    dates: []
                }
        	}
        },
        mounted(){

        },
        methods: {
        	submit(){
                let loader = this.$loading.show();
                this.holidayForm.post('/api/holiday')  
                    .then(response => {
                        toastr.success(response.message);
                        this.date = '';
                        this.holidayForm.dates = [];
                        this.$emit('completed');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
        	},
        	onSelected(val){
        		this.date = '';
        		val = helper.toDate(val);
        		
        		if (this.holidayForm.dates.indexOf(val) < 0)
        			this.holidayForm.dates.push(val);

        		this.holidayForm.errors.clear('dates');
        		this.date = '';
        	},
        	remove(date){
        		let idx = this.holidayForm.dates.indexOf(date);
        		
        		if (idx < 0)
        			return;

        		this.holidayForm.dates.splice(idx, 1);
                this.date = '';
        	}
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentWithDay(date) {
            return helper.formatDateWithDay(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
        watch: {
        	'holidayForm.dates': function(val){

                if (!Array.isArray(val))
                    return;

        		this.highlighted.dates = [];
        		val.forEach(date => {
        			this.highlighted.dates.push(new Date(date));
        		});
        	},
            disabledDates(val){
                this.disabled.dates = [];
                val.forEach(date => {
                    this.disabled.dates.push(new Date(date));
                });
            }
        }	
	}
</script>