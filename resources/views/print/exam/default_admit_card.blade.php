@foreach ($student_records as $student_record)
	@include('print.print-layout.header',compact('print_options'))
	    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
	    <h2 style="text-align: center;">{{trans('exam.admit_card')}} {{$exam_schedule->exam->name}}</h2>
	    <table class="fancy-detail">
	        <tbody>
	            <tr>
	                <td><strong>{{trans('student.name')}}</strong></td>
	                <td>{{$student_record->student->name}}</td>
	                <td><strong>{{trans('student.first_guardian_name')}}</strong></td>
	                <td>{{optional($student_record->student->parent)->first_guardian_name}}</td>
	            </tr>
	            <tr>
	                <td><strong>{{trans('student.admission_number')}}</strong></td>
	                <td>{{$student_record->admission->number}}</td>
	                <td><strong>{{trans('academic.course')}}</strong></td>
	                <td>{{$student_record->batch->course->name.' '.$student_record->batch->name}}</td>
	            </tr>
	            <tr>
	                <td><strong>{{trans('student.contact_number')}}</strong></td>
	                <td>{{$student_record->student->contact_number}}</td>
	                <td><strong>{{trans('student.date_of_birth')}}</strong></td>
	                <td>{{showDate($student_record->student->date_of_birth)}}</td>
	            </tr>
	        </tbody>
	    </table>
	    <div style="margin-bottom: 20px;"></div>
	    <table class="fancy-detail">
	        <thead>
	            <tr>
	                <th>{{trans('general.sno')}}</th>
	                <th>{{trans('academic.subject_code')}}</th>
	                <th>{{trans('academic.subject')}}</th>
	                <th>{{trans('exam.schedule_date')}}</th>
	                <th>{{trans('exam.invigilator')}}</th>
	            </tr>
	        </thead>
	        <tbody>
	        	@php
	        		$i = 1;
	        	@endphp
				@foreach($exam_schedule->records as $record)
					@if(!$record->getOption('has_no_exam'))
						<tr>
							<td>{{$i++}}</td>
							<td>{{$record->subject->code}}</td>
							<td>{{$record->subject->name}}</td>
							<td>{{showDate($record->date)}}</td>
							<td></td>
						</tr>
					@endif
				@endforeach
	        </tbody>
	    </table>
		@include('print.print-layout.signatory')
		</div>
	</div>
</body>
</html>
<div style="page-break-after: always;"></div>
@endforeach

{{ $student_records->links() }}