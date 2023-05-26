@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.certificate').' '.trans('general.total_result_count',['count' => count($certificates)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('academic.certificate_template')}}</th>
                <th>{{trans('student.student')}}</th>
                <th>{{trans('employee.employee')}}</th>
                <th>{{trans('academic.date_of_certificate')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($certificates as $certificate)
        		<tr>
        			<td>{{$certificate->certificateTemplate->name}}</td>
                    <td>{!!$certificate->student_record_id ? ($certificate->studentRecord->student->name.' <br />'.$certificate->studentRecord->batch->batch_with_course) : '-'!!}</td>
                    <td>{!!$certificate->employee_id ? ($certificate->employee->name.' <br />' .getEmployeeDesignationName($certificate->employee, $certificate->date_of_certificate)) : '-'!!}</td>
                    <td>{{showDate($certificate->date_of_certificate)}}</td>
                    <td>{{showDateTime($certificate->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')