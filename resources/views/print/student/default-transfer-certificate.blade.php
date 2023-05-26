@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2 style="text-align: center;">{{trans('student.transfer_certificate')}}</h2>

    <table class="tc no-border">
        <tbody>
            <tr>
            	@if ($student_record->transferCertificate->getOption('book_number'))
	                <td><strong>{{trans('student.transfer_certificate_book_number')}}</strong> : {{$student_record->transferCertificate->getOption('book_number')}}</td>
	            @endif
                <td><strong>{{trans('student.transfer_certificate_number')}}</strong> : {{$student_record->transferCertificate->transfer_certificate_number}}</td>
                <td><strong>{{trans('student.admission_number')}}</strong> : {{$student_record->admission->admission_number}}</td>
                <td><strong>{{trans('student.roll_number')}}</strong> : {{getRollNumber($student_record)}}</td>
            </tr>
        </tbody>
    </table>
    <table class="tc no-border table-striped table-padded-lg" style="margin-top: 20px;">
        <tbody>
			<tr>
				<td>{{trans('student.name')}}</td>
				<td>{{$student_record->student->name}}</td>
			</tr>
			<tr>
				<td>{{trans('student.mother_name')}}</td>
				<td>{{$student_record->student->parent->mother_name}}</td>
			</tr>
			<tr>
				<td>{{trans('student.father_name')}}</td>
				<td>{{$student_record->student->parent->father_name}}</td>
			</tr>
			<tr>
				<td>{{trans('student.date_of_birth')}}</td>
				<td>{{showDate($student_record->student->date_of_birth)}}</td>
			</tr>
			<tr>
				<td>{{trans('academic.batch')}}</td>
				<td>{{$student_record->batch->course->name.' '.$student_record->batch->name}}</td>
			</tr>
			@foreach($student_record->transferCertificate->getOption('transfer_certificate') as $variable)
				<tr>
					<td>{{trans('student.tc_props.'.gv($variable, 'name'))}}</td>
					<td>{{gv($variable, 'value')}}</td>
				</tr>
			@endforeach
        </tbody>
    </table>
    <p class="tc">{{trans('student.transfer_certificate_certification')}}</p>

    <table class="tc no-border" style="margin-top: 50px;">
        <tbody>
            <tr>
                <td>{{trans('academic.class_teacher')}}</td>
                <td style="text-align: center;">{{trans('student.checked_by')}}</td>
                <td style="text-align: right">{{trans('student.principal')}}</td>
            </tr>
        </tbody>
    </table>