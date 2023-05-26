<template>
	<div>
	    <form @submit.prevent="proceed" @keydown="timetableForm.errors.clear($event.target.name)">
	        <div class="row">
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('academic.batch')}}</label>
	                    <v-select label="name" v-model="selected_batch" group-values="batches" group-label="course_group" :group-select="false"  name="batch_id" id="batch_id" :options="batches" :placeholder="trans('academic.select_batch')" @select="onBatchSelect" @close="timetableForm.errors.clear('batch_id')" @remove="timetableForm.batch_id = ''">
	                        <div class="multiselect__option" slot="afterList" v-if="!batches.length">
	                            {{trans('general.no_option_found')}}
	                        </div>
	                    </v-select>
	                    <show-error :form-name="timetableForm" prop-name="batch_id"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-3">
	                <div class="form-group">
	                    <label for="">{{trans('academic.date_effective')}}</label>
	                    <datepicker v-model="timetableForm.date_effective" :bootstrapStyling="true" @selected="timetableForm.errors.clear('date_effective')" :placeholder="trans('academic.date_effective')"></datepicker>
	                    <show-error :form-name="timetableForm" prop-name="date_effective"></show-error>
	                </div>
	            </div>
	            <div class="col-12 col-sm-6">
	                <div class="form-group">
	                    <label for="">{{trans('academic.timetable_description')}}</label>
	                    <input class="form-control" type="text" v-model="timetableForm.description" name="description" :placeholder="trans('academic.timetable_description')">
	                    <show-error :form-name="timetableForm" prop-name="description"></show-error>
	                </div>
	            </div>
	        </div>
	        <div class="row">
	            <template v-for="(day, index) in timetableForm.days">
	                <div class="col-12 col-sm-2">
	                    <div class="form-group">
	                        <div><strong>{{day.day_name}}</strong></div>
	                        <switches class="m-t-20" v-model="day.is_weekoff" theme="bootstrap" color="success"></switches> {{trans('academic.is_weekoff')}}
	                    </div>
	                </div>
	                <div class="col-12 col-sm-4">
	                    <div class="form-group" v-if="!day.is_weekoff">
	                        <label for="">{{trans('academic.class_timing')}}</label>
	                        <v-select label="name" v-model="day.selected_class_timing" :name="getClassTimingName(index)" :id="getClassTimingName(index)" :options="class_timings" :placeholder="trans('academic.select_class_timing')" @select="onClassTimingSelect" @close="timetableForm.errors.clear(getClassTimingName(index))" @remove="day.class_timing_id = ''">
	                            <div class="multiselect__option" slot="afterList" v-if="!class_timings.length">
	                                {{trans('general.no_option_found')}}
	                            </div>
	                        </v-select>
	                        <show-error :form-name="timetableForm" :prop-name="getClassTimingName(index)"></show-error>
	                    </div>
	                </div>
	            </template>
	        </div>

            <div class="card-footer text-right">
                <button type="button" class="btn btn-danger " @click="$router.push('/academic/timetable')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
            </div>
	    </form>
	</div>
</template>

<script>

	export default {
		props: ['uuid'],
        components: {},
        data(){
            return {
                timetableForm: new Form({
                    batch_id: '',
                    date_effective: '',
                    days: []
                }),
                class_timings: [],
                batches: [],
                days: [],
                selected_batch: null
            }
        },
        mounted(){
            this.getPreRequisite();
        },
        methods: {
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            getPreRequisite(){
                let loader = this.$loading.show();
                axios.get('/api/timetable/pre-requisite')
                    .then(response => {
                        this.class_timings = response.class_timings;
                        this.batches = response.batches;
                        this.days = response.days;
                        this.populateDays();

			            if (this.uuid)
			            	this.getTimetable();

                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },
            getTimetable(){
                let loader = this.$loading.show();
            	axios.get('/api/timetable/'+this.uuid)
            		.then(response => {
            			this.timetableForm.batch_id = response.timetable.batch_id;
            			this.timetableForm.date_effective = response.timetable.date_effective;
            			this.selected_batch = {id: batch_id, name: response.timetable.batch.course.name+' '+response.timetable.batch.name};

                        let allocated = 0;
                        response.timetable.timetable_allocations.forEach(allocation => {
                            if (allocation.timetable_allocation_details.length)
                                allocated++;
                        })

                        if (allocated) {
                            toastr.error(i18n.academic.timetable_cannot_be_changed_after_allocation);
                            this.$router.push('/academic/timetable');
                        }

            			this.timetableForm.days.forEach(day => {
            				let class_timing = response.timetable.timetable_allocations.find(o => o.day == day.day);
            				if (class_timing) {
            					day.is_weekoff = class_timing.class_timing_id ? false : true;
            					day.class_timing_id = class_timing.class_timing_id;
            					day.selected_class_timing = class_timing.class_timing_id ? {id: class_timing.class_timing_id, name: class_timing.class_timing.name} : null;
            				}
            			});
                        loader.hide();
            		})
            		.catch(error => {
                        loader.hide();
            			helper.showErrorMsg(error);
            		})
            },
            populateDays(){
                this.days.forEach(day => {
                    this.timetableForm.days.push({
                        day: day.id,
                        day_name: day.name,
                        class_timing_id: '',
                        selected_class_timing: null,
                        is_weekoff: false
                    })
                })
            },
            getClassTimingName(index){
                return index+'_class_timing';
            },
            onClassTimingSelect(selectedOption, id){
                let index = id.split('_')[0];
                this.timetableForm.days[index].class_timing_id = selectedOption.id;
            },
            onBatchSelect(selectedOption){
                this.timetableForm.batch_id = selectedOption.id;
            },
            store(){
                let loader = this.$loading.show();
                this.timetableForm.post('/api/timetable')
                    .then(response => {
                        this.timetableForm.days = [];
                        this.selected_batch = null;
                        this.populateDays();
                        toastr.success(response.message);
                        this.$router.push('/academic/timetable');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.timetableForm.patch('/api/timetable/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/academic/timetable');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            }
        }
	}
</script>