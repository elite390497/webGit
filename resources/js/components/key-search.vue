<template>
	<div>
        <div class="search-overlay" v-show="searchOverlay">
        	<input type="text" ref="searchTermElement" v-model="search" :placeholder="trans('general.any_search_hint')" spellcheck="false" autocomplete="false" class="search-term" />
        	<div class="search-helper">{{searchHint}}</div>

        	<div class="row" v-if="student_search_results.length || employee_search_results.length" style="padding: 40px 10px 10px 40px;">
				<div class="col-12 col-sm-4" v-if="student_search_results.length">
					<h2 class="result-header">{{trans('student.student')}}</h2>
                    <vue-scroll :ops="scrollOptions">
    					<div class="result-info" v-for="student_record in student_search_results" :key="student_record.student.uuid" @click="">
                            <span class="result-thumb pull-left">
                                <template v-if="!student_record.student.student_photo">
                                    <img v-if="student_record.student.gender == 'female'" src="/images/avatar_female_kid.png" class="img-circle">
                                    <img v-else src="/images/avatar_male_kid.png" class="img-circle">
                                </template>
                                <template v-else>
                                    <img :src="`/${student_record.student.student_photo}`" style="height: inherit; width: auto;">
                                </template>
                            </span>
                            <p>
                                <span class="other small">{{student_record.admission.admission_number}} 
                                    <template v-if="student_record.student.age">({{ student_record.student.age.years+' '+trans('list.year')+' '+student_record.student.age.months+' '+trans('list.month')}})</template>
                                </span>
                                <span class="result-name">{{ student_record.student.name }}</span>
                                <span class="other small">{{ student_record.batch.course.name+' '+student_record.batch.name }} ({{ student_record.full_roll_number }})</span>
                                <span class="other small">{{ student_record.student.parent.first_guardian_name }} <i class="fas fa-mobile"></i> {{ student_record.student.contact_number }}
                                </span>
                                <span style="display: block; margin-top: 10px;">
    	                            <button class="btn btn-info btn-sm" @click="navigateToStudent(student_record.student.uuid)"><i class="fas fa-arrow-circle-right"></i> {{trans('general.view')}}</button>
    	                            <button v-if="hasPermission('list-student-fee')" class="btn btn-success btn-sm" @click="navigateToStudentFee(student_record.id, student_record.student.uuid)">
    	                                <i class="fas fa-file"></i> {{trans('finance.view_fee_allocation')}}
    	                            </button>
                                </span>
                            </p>
                        </div>
                    </vue-scroll>
				</div>
				<div class="col-12 col-sm-4" v-if="employee_search_results.length">
					<h2 class="result-header">{{trans('employee.employee')}}</h2>
                    <vue-scroll :ops="scrollOptions">
    					<div class="result-info" v-for="employee in employee_search_results" :key="employee.uuid" @click="">
                            <span class="result-thumb pull-left">
                                <template v-if="!employee.photo">
                                    <img v-if="employee.gender == 'female'" src="/images/avatar_female.png" class="img-circle">
                                    <img v-else src="/images/avatar_male.png" class="img-circle">
                                </template>
                                <template v-else>
                                    <img :src="`/${employee.photo}`" style="height: inherit; width: auto;">
                                </template>
                            </span>
                            <p>
                                <span class="other small">{{employee.employee_code}} 
                                    <template v-if="employee.age">({{ employee.age.years+' '+trans('list.year')+' '+employee.age.months+' '+trans('list.month')}})</template>
                                </span>
                                <span class="result-name">{{ employee.name }} <span style="display: inline-block;" v-html="getStatus(employee)"></span></span>
                                <span class="other small">
                                    <template v-if="employee.employee_designations.length && employee.employee_designations[0].department_id">{{employee.employee_designations[0].department.name}}</template>
                                    <template v-if="employee.employee_designations.length">
                                        {{employee.employee_designations[0].designation.name+' ('+employee.employee_designations[0].designation.employee_category.name+')'}}
                                    </template>
                                </span>
                                <span class="other small">
                                    <template v-if="employee.employee_terms[0]">{{trans('general.since')}} {{employee.employee_terms[0].date_of_joining | moment}}</template>
                                    <i class="fas fa-mobile"></i> {{ employee.contact_number }}
                                </span>
                                <span style="display: block; margin-top: 10px;">
    	                            <button class="btn btn-info btn-sm" @click="navigateToEmployee(employee.uuid)"><i class="fas fa-arrow-circle-right"></i> {{trans('general.view')}}</button>
                                </span>
                            </p>
                        </div>
                    </vue-scroll>
				</div>
        	</div>
        </div>
	</div>
</template>

<script>
    import modules from '../../var/modules.json'

	export default {
		data() {
			return {
                searchOverlay: false,
                search: '',
                student_search_results: [],
                employee_search_results: [],
                resultLoading: false,
                timeout: null,
                scrollOptions: {
                    vuescroll: {
                        mode: 'native'
                    },
                    bar: {
                        background: '#e3e3e3'
                    },
                    scrollPanel: {
                        maxHeight: 600
                    }
                }
			}
		},
		mounted() {
			let self = this
            window.onkeydown = function (e) {
                if (!e) e = window.event;
                if (!e.metaKey && !self.searchOverlay) {
                    if((e.target.localName === 'body' || e.target.localName === 'document') && (e.keyCode >= 65 && event.keyCode <= 90 || e.keyCode >= 48 && event.keyCode <= 57)) {
                        let char = event.which || event.keyCode
                        let character = event.key || String.fromCharCode(char)

                        self.searchOverlay = true
                    }
                }
            }
		},
		created() {
			const handlerEscape = (e) => {
				if (e.key === 'Esc' || e.key === 'Escape') {
					this.search = ''
					this.searchOverlay = false
				}
			}

			document.addEventListener('keydown', handlerEscape)

			this.$once('hook:beforeDestroy', () => {
				document.removeEventListener('keydown', handlerEscape)
			})
		},
		methods: {
			hasPermission(permission) {
				return helper.hasPermission(permission)
			},
            searchResult(){
            	this.resultLoading = true;

                clearTimeout(this.timeout);
                
                var self = this;
                this.timeout = setTimeout(function () {
                    if (self.search.length < 3) {
                        return
                    }

                    axios.get('/api/search?q='+self.search)
                        .then(response => {
                            self.student_search_results = response.student_records;
                            self.employee_search_results = response.employees;
                            self.resultLoading = false;
                        })
                        .catch(error => {
                            self.resultLoading = false;
                            helper.showErrorMsg(error);
                        })
                }, 1000);

            },
            getStatus(employee){
                let term = employee.employee_terms;
                if (term.length && term[0].date_of_joining <= helper.today() && (!term[0].date_of_leaving || term[0].date_of_leaving >= helper.today()))
                    return '<span class="label label-success">'+i18n.employee.status_active+'</span>';
                else
                    return '<span class="label label-danger">'+i18n.employee.status_inactive+'</span>';
            },
            navigateToEmployee(uuid) {
            	this.search = ''
            	this.searchOverlay = false
            	this.$router.push('/employee/'+uuid)
            },
            navigateToStudent(uuid) {
            	this.search = ''
            	this.searchOverlay = false
            	this.$router.push('/student/'+uuid)
            },
            navigateToStudentFee(id, uuid) {
            	this.search = ''
            	this.searchOverlay = false
            	this.$router.push('/student/'+uuid+'/fee/'+id)
            }
		},
		watch: {
            search(val){
                if(val.length >= 3) {
                    this.searchResult();
                } else {
                	this.resultLoading = false
                    this.student_search_results = [];
                    this.employee_search_results = [];
                }
            }
		},
        computed: {
            searchHint() {
                if (this.search.length < 3) {
                    return i18n.general.any_search_type_atleast_3_characters
                } else if (this.resultLoading) {
                    return i18n.general.any_search_loading
                } else {
                    let result = this.student_search_results.length + this.employee_search_results.length
                    return result+' '+i18n.general.any_search_loaded
                }
            }
        },
        updated() {
            if (this.$refs.searchTermElement) {
                this.$refs.searchTermElement.focus()
            }
        },
        filters: {
          moment(date) {
            return helper.formatDate(date);
          },
          momentDateTime(date) {
            return helper.formatDateTime(date);
          }
        },
	}
</script>

<style scoped lang="scss">
	.search-overlay {
		position: fixed; 
		top: 0; 
		bottom: 0; 
		left: 0; 
		right: 0; 
		background: white; 
		opacity: 0.9; 
		z-index: 999999; 
		width: 100%; 
		height: 100%;
        overflow: hidden
	}

	.search-term {
		font-size: 72px;
		font-weight: bold;
		padding: 40px 10px 10px 40px;
		border: 0;
	}

	.search-helper {
		padding: 0 10px 10px 40px;
		font-size: 20px;
	}

	.result-header {
		font-size: 24px;
		font-weight: bold;
	}

	.result-info {
		display: block;
		border-bottom: 2px solid black;
		margin-bottom: 10px;
		padding-bottom: 10px;

        .result-thumb {
            float: left;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            background: #e1e2e3;
            margin-right: 20px;
            text-align: center;
            overflow: hidden;
            i {
                padding-top: 25px;
                font-size: 50px;
            }
            img {
                width: 100%;
            }
        }

        p{
            padding-top: 10px;
            margin-bottom: 0;
            min-height: 100px;
            color: lighten(black, 10%);

            span {
                display: block;

                &.result-name{
                    font-size: 120%;
                    font-weight: 500;
                }
                &.title{
                    font-size: 100%;
                }
                &.other{
                    font-size: 90%;
                }
            }
        }
	}

	.result-info {
		border:2px solid #000000;
        border-radius: 10px;
        margin-top: 10px;
        padding: 10px;
	}
</style>