<template>
	<div class="row" v-if="student_record.student">
		<div class="col-12 col-sm-3">
			<div class="form-group text-center">
	            <img :src="getImage" class="img-fluid" style="max-width:200px;">
	        </div>
		</div>
		<div class="col-12 col-sm-4">
            <div class="table-responsive">
                <table class="table table-borderless custom-show-table">
                    <tbody>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.name')}}</td>
                            <td>{{getStudentName(student_record.student)}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.admission_number')}}</td>
                            <td>{{getAdmissionNumber(student_record.admission)}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.date_of_admission')}}</td>
                            <td>{{student_record.admission.date_of_admission | moment}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('academic.course')}}</td>
                            <td>{{student_record.batch.course.name+' ('+student_record.batch.course.course_group.name+')'}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('academic.batch')}}</td>
                            <td>{{student_record.batch.name}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.date_of_birth')}}</td>
                            <td>{{student_record.student.date_of_birth | moment}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</div>
		<div class="col-12 col-sm-4">
            <div class="table-responsive">
                <table class="table table-borderless custom-show-table">
                    <tbody>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.father_name')}}</td>
                            <td>{{student_record.student.parent ? student_record.student.parent.father_name : ''}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.mother_name')}}</td>
                            <td>{{student_record.student.parent ? student_record.student.parent.mother_name : ''}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.contact_number')}}</td>
                            <td>{{student_record.student.contact_number}}</td>
                        </tr>
                        <tr>
                            <td class="font-weight-bold">{{trans('student.present_address')}}</td>
                            <td>
	                            {{student_record.student.present_address_line_1}}
	                            <span v-if="student_record.student.present_address_line_2">, {{student_record.student.present_address_line_2}}</span>
	                            <span v-if="student_record.student.present_city"><br /> {{student_record.student.present_city}}</span>
	                            <span v-if="student_record.student.present_state">, {{student_record.student.present_state}}</span>
	                            <span v-if="student_record.student.present_zipcode">, {{student_record.student.present_zipcode}}</span>
	                            <span v-if="student_record.student.present_country"><br /> {{student_record.student.present_country}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['studentRecord'],
		data() {
			return {
				student_record: {}
			}
		},
		mounted() {

		},
		methods: {
        	getStudentName(student){
                return helper.getStudentName(student);
        	},
            getAdmissionNumber(admission){
                return helper.getAdmissionNumber(admission);
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
		computed: {
			getImage(){
				if (!this.student_record.student.student_photo) {
					return this.student_record.student.gender == 'female' ? '/images/female.png' : '/images/male.png';
				} else {
					return '/'+this.student_record.student.student_photo;
				}
			}
		},
		watch: {
			studentRecord(val) {
				this.student_record = val;
			}
		}
	}
</script>