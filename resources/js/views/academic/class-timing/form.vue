<template>
	<div class="p-t-20">
        <form @submit.prevent="proceed" @keydown="classTimingForm.errors.clear($event.target.name)">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.class_timing_name')}}</label>
                        <input class="form-control" type="text" v-model="classTimingForm.name" name="name" :placeholder="trans('academic.class_timing_name')">
                        <show-error :form-name="classTimingForm" prop-name="name"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-9">
                    <div class="form-group">
                        <label for="">{{trans('academic.class_timing_description')}}</label>
                        <input class="form-control" type="text" v-model="classTimingForm.description" name="description" :placeholder="trans('academic.class_timing_description')">
                        <show-error :form-name="classTimingForm" prop-name="description"></show-error>
                    </div>
                </div>
            </div>
            <div class="row" v-for="(session, index) in classTimingForm.sessions">
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">
                            {{trans('academic.class_timing_session_name')}}
                            <button type="button" class="btn btn-xs btn-danger" :key="`${index}_delete_session`" v-confirm="{ok: confirmDelete(index)}" v-tooltip="trans('academic.delete_class_timing_session')"><i class="fas fa-times"></i></button>
                        </label>
                        <input class="form-control" type="text" v-model="session.name" :name="getSessionName(index)" :placeholder="trans('academic.class_timing_session_name')">
                        <show-error :form-name="classTimingForm" :prop-name="getSessionName"></show-error>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.start_time')}}</label>
                        <div class="row">
                            <div class="col-6">
                                <select v-model="session.start_hour" class="custom-select col-12" :name="getSessionStartHourName(index)" @change="classTimingForm.errors.clear(getSessionStartHourName(index))">
                                  <option value=null selected>{{trans('academic.select_hour')}}</option>
                                  <option v-for="hour in hours" v-bind:value="hour">
                                    {{ timePadding(hour) }}
                                  </option>
                                </select>
                                <show-error :form-name="classTimingForm" :prop-name="getSessionStartHourName(index)"></show-error>
                            </div>
                            <div class="col-6">
                                <select v-model="session.start_min" class="custom-select col-12" :name="getSessionStartHourName(index)" @change="classTimingForm.errors.clear(getSessionStartHourName(index))">
                                  <option value=null selected>{{trans('academic.select_min')}}</option>
                                  <option v-for="min in mins" v-bind:value="min">
                                    {{ timePadding(min) }}
                                  </option>
                                </select>
                                <show-error :form-name="classTimingForm" :prop-name="getSessionStartMinName(index)"></show-error>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-3">
                    <div class="form-group">
                        <label for="">{{trans('academic.end_time')}}</label>
                        <div class="row">
                            <div class="col-6">
                                <select v-model="session.end_hour" class="custom-select col-12" :name="getSessionEndHourName(index)" @change="setNextStartHour(session, index)">
                                  <option value=null selected>{{trans('academic.select_hour')}}</option>
                                  <option v-for="hour in hours" v-bind:value="hour">
                                    {{ timePadding(hour) }}
                                  </option>
                                </select>
                                <show-error :form-name="classTimingForm" :prop-name="getSessionEndHourName(index)"></show-error>
                            </div>
                            <div class="col-6">
                                <select v-model="session.end_min" class="custom-select col-12" :name="getSessionEndMinName(index)" @change="setNextStartMin(session, index)">
                                  <option value=null selected>{{trans('academic.select_min')}}</option>
                                  <option v-for="min in mins" v-bind:value="min">
                                    {{ timePadding(min) }}
                                  </option>
                                </select>
                                <show-error :form-name="classTimingForm" :prop-name="getSessionEndMinName(index)"></show-error>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-2">
                    <div class="form-group">
                        <div>{{trans('academic.is_a_break')}}</div>
                        <switches class="m-t-20" v-model="session.is_a_break" theme="bootstrap" color="success"></switches> 
                    </div>
                </div>
                <div class="col-12 col-sm-1">
                    <div class="form-group">
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="form-group">
                        <button type="button" @click="addRow" class="btn btn-info btn-sm waves-effect waves-light">{{trans('academic.add_class_timing_session')}}</button>
                    </div>
                </div>
            </div>
            <div class="card-footer text-right">
                <button type="button" class="btn btn-danger " @click="$router.push('/academic/class/timing')">{{trans('general.cancel')}}</button>
                <button type="submit" class="btn btn-info waves-effect waves-light" :disabled="is_disabled_editing"><i class="fas fa-lock" v-if="is_disabled_editing"></i> {{trans('general.save')}}</button>
            </div>
        </form>
    </div>
</template>

<script>

	export default {
        components: {},
        props: ['uuid'],
		data(){
			return {
                classTimingForm: new Form({
                    name: '',
                    description: '',
                    sessions: []
                }),
                hours: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
                mins: [0,5,10,15,20,25,30,35,40,45,50,55],
                is_disabled_editing: false
			}
		},
		mounted(){
            if(!this.uuid)
                this.addRow();

            if(this.uuid)
                this.get();
		},
		methods: {
            proceed(){
                if(this.uuid)
                    this.update();
                else
                    this.store();
            },
            get(){
                let loader = this.$loading.show();
                axios.get('/api/class/timing/'+this.uuid)
                    .then(response => {
                        this.classTimingForm.name = response.name;
                        this.classTimingForm.description = response.description;
                        response.class_timing_sessions.forEach(session => {
                            this.classTimingForm.sessions.push({
                                uuid: session.uuid,
                                name: session.name,
                                start_hour: Number(session.start.split(":")[0]),
                                start_min: Number(session.start.split(":")[1]),
                                end_hour: Number(session.end.split(":")[0]),
                                end_min: Number(session.end.split(":")[1]),
                                is_a_break: session.is_a_break
                            })
                        });
                        this.is_disabled_editing = (response.timetable_allocations.length) ? true : false;
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            },  
            addRow(){
                let new_index = this.classTimingForm.sessions.push({
                    uuid: this.$uuid.v4(),
                    name: '',
                    start_hour: '',
                    start_min: '',
                    end_hour: '',
                    end_min: '',
                    is_a_break: false
                })
            },
            timePadding(time){
                return helper.formatWithPadding(time,2);
            },
            getSessionName(index){
                return index+'_name';
            },
            getSessionStartHourName(index){
                return index+'_start_hour';
            },
            getSessionStartMinName(index){
                return index+'_start_min';
            },
            getSessionEndHourName(index){
                return index+'_end_hour';
            },
            getSessionEndMinName(index){
                return index+'_end_min';
            },
            setNextStartHour(session, index){
                this.classTimingForm.errors.clear(this.getSessionEndHourName(index));
                if (typeof this.classTimingForm.sessions[index + 1] !== 'undefined') {
                    let next_session = this.classTimingForm.sessions[index + 1];
                    next_session.start_hour = session.end_hour;
                }
            },
            setNextStartMin(session, index) {
                this.classTimingForm.errors.clear(this.getSessionEndMinName(index));
                if (typeof this.classTimingForm.sessions[index + 1] !== 'undefined') {
                    let next_session = this.classTimingForm.sessions[index + 1];
                    next_session.start_min = session.end_min;
                }
            },
            confirmDelete(index){
                return dialog => this.deleteSession(index);
            },
            deleteSession(index){
                this.classTimingForm.sessions.splice(index, 1);
            },
            store(){
                let loader = this.$loading.show();
                this.classTimingForm.post('/api/class/timing')
                    .then(response => {
                        toastr.success(response.message);
                        this.classTimingForm.sessions = [];
                        this.addRow();
                        this.$router.push('/academic/class/timing');
                        loader.hide();
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    })
            },
            update(){
                let loader = this.$loading.show();
                this.classTimingForm.patch('/api/class/timing/'+this.uuid)
                    .then(response => {
                        toastr.success(response.message);
                        loader.hide();
                        this.$router.push('/academic/class/timing');
                    })
                    .catch(error => {
                        loader.hide();
                        helper.showErrorMsg(error);
                    });
            }
		}
	}
</script>