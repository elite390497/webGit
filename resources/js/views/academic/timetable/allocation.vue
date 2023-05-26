<template>
    <div>
        <div class="page-titles">
            <div class="row">
                <div class="col-12 col-sm-6">
                    <h3 class="text-themecolor">{{trans('academic.timetable_allocation')}} <span v-if="timetable.batch"> - <small>{{timetable.batch.course.name+' '+timetable.batch.name}} {{trans('general.from')}} {{timetable.date_effective | moment}}</small></span></h3>
                </div>
                <div class="col-12 col-sm-6">
                    <div class="action-buttons pull-right">
                        <button class="btn btn-info btn-sm" @click="$router.push('/academic/timetable')"><i class="fas fa-list"></i> <span class="d-none d-sm-inline">{{trans('academic.timetable')}}</span></button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="card card-form">
                <div class="card-body">
                    <form @submit.prevent="submit" @keydown="timetableAllocationForm.errors.clear($event.target.name)" v-if="timetable">
                    	<div class="row" v-for="(day,index) in timetableAllocationForm.days">
                    		<div class="col-12 col-sm-1">
                    			{{trans('list.'+day.day)}}
                    		</div>
                			<div class="col-12 col-sm-11">
                				<div class="row" v-if="day.sessions.length">
                        			<div class="col-12 col-sm-2" v-for="(session,index1) in day.sessions">
                            			<small>{{session.name}} ({{getSessionStartTime(session)+' '+trans('general.to')+' '+getSessionEndTime(session)}})</small>
						                <div class="form-group" v-if="!session.is_a_break">
                                            <select v-model="session.subject_id" class="custom-select col-12" :name="getSubjectName(index, index1)" @change="calculateAllottedSubject">
                                              <option value="null">{{trans('academic.select_subject')}}</option>
                                              <option v-for="subject in subjects" v-bind:value="subject.id">
                                                {{ subject.name+' ('+subject.code+')' }}
                                              </option>
                                            </select>
						                    <show-error :form-name="timetableAllocationForm" prop-name="getSubjectName(index, index1)"></show-error>
						                </div>
						                <div v-else class="text-center">-</div>
                            		</div>
                            	</div>
                            	<div v-else class="text-center m-4">-</div>
                            </div>
                    	</div>

                        <div class="card-footer text-right">
                            <button type="button" class="btn btn-danger waves-effect waves-light " @click="$router.push('/academic/timetable')">{{trans('general.back')}}</button>
                            <button type="submit" class="btn btn-info waves-effect waves-light">{{trans('general.save')}}</button>
                            
                        </div>
                    </form>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                	<div class="table-responsive" v-if="subjects.length">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                	<th>{{trans('academic.subject')}}</th>
                                	<th>{{trans('academic.subject_teacher')}}</th>
                                	<th>{{trans('academic.subject_max_class_per_week')}}</th>
                                	<th>{{trans('academic.subject_alloted_class_per_week')}}</th>
                                </tr>
                            </thead>
                            <tbody>
                            	<tr v-for="subject in subjects">
                            		<td>{{subject.name+' ('+subject.code+')'}}</td>
                            		<td>{{getSubjectTeacher(subject)}}</td>
                            		<td>{{subject.max_class_per_week}}</td>
                            		<td>{{getSubjectCount(subject)}}</td>
                            	</tr>
                            </tbody>
                            <tfoot>
                            	<tr>
                            		<td v-text="trans('general.total')"></td>
                            		<td></td>
                            		<td></td>
                            		<td>{{getTotalCount()}}</td>
                            	</tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>	
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				uuid: this.$route.params.uuid,
				timetable: {},
				timetableAllocationForm: new Form({
					days: []
				},false),
				subjects: [],
				subject_alloted_count: []
			}
		},
		mounted(){
			let loader = this.$loading.show();
			axios.get('/api/timetable/'+this.uuid)
				.then(response => {
					this.timetable = response.timetable;
					this.subjects = response.subjects;

					this.subjects.forEach(subject => {
						this.subject_alloted_count.push({
							subject_id: subject.id,
							count: 0
						})
					});

					this.timetable.timetable_allocations.forEach(allocation => {
						let sessions = [];

						if (allocation.class_timing) {
							allocation.class_timing.class_timing_sessions.forEach(session => {

								let timetable_detail = allocation.timetable_allocation_details.find(o => o.timetable_allocation_id == allocation.id && o.class_timing_session_id == session.id)

								sessions.push({
									id: session.id,
									name: session.name,
									start: session.start,
									end: session.end,
									is_a_break: session.is_a_break,
									subject_id: (timetable_detail) ? timetable_detail.subject_id : null,
									selected_subject: null
								})
							})
						}

						this.timetableAllocationForm.days.push({
							day: allocation.day,
							timetable_allocation_id: allocation.id,
							sessions: sessions
						})
					})
					this.calculateAllottedSubject();
					loader.hide();
				})
				.catch(error => {
					loader.hide();
					helper.showErrorMsg(error);
				})

            helper.showDemoNotification(['academic_timetable']);
		},
		methods: {
			getSubjectName(index, index1){
				return index+'_'+index1+'_subject';
			},
			getSubjectDetail(subject){
				let name = subject.name+' ('+subject.code+')';
				let employee = this.getSubjectTeacher(subject);

				return name+(employee ? ' '+employee : '');
			},
			getEmployeeName(employee){
                return helper.getEmployeeName(employee);
			},
			getSubjectTeacher(subject){
                let employee = subject.subject_teachers.filter(o => o.date_effective <= this.timetable.date_effective);
				return (employee.length) ? this.getEmployeeName(subject.subject_teachers[employee.length - 1].employee) : '';
			},
        	calculateAllottedSubject(){
        		this.subject_alloted_count.forEach(subject => {
        			subject.count = 0;
	        		this.timetableAllocationForm.days.forEach(day => {
	        			day.sessions.forEach(session => {
	        				if (session.subject_id == subject.subject_id)
	        					subject.count++;
	        			})
	        		})
        		})
        	},
        	getSubjectCount(subject){
        		let sub = this.subject_alloted_count.find(o => o.subject_id == subject.id);
        		return  (sub) ? sub.count : 0;
        	},
            getSessionStartTime(session){
                return moment(session.start, 'HH:mm:ss').format('h:mm a');
            },
            getSessionEndTime(session){
                return moment(session.end, 'HH:mm:ss').format('h:mm a');
            },
            submit(){
            	let loader = this.$loading.show();
            	this.timetableAllocationForm.post('/api/timetable/'+this.uuid+'/allocation')
            		.then(response => {
            			toastr.success(response.message);
            			loader.hide();
            		})
            		.catch(error => {
            			loader.hide();
            			helper.showErrorMsg(error);
            		});
            },
            getTotalCount(){
            	let allocated = 0;
            	this.subjects.forEach(subject => {
            		allocated += this.getSubjectCount(subject);
            	})

            	let total = 0;
        		this.timetableAllocationForm.days.forEach(day => {
        			day.sessions.forEach(session => {
        				if(!session.is_a_break)
        					total++;
        			});
        		});

            	return allocated+'/'+total;
            }
		},
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        }
	}
</script>