@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans($filter['type'].'.'.$filter['type'].'_birthday').' '.trans('general.total_result_count',['count' => count($birthdays)])}}</h2>
    <h4>{{trans('calendar.birthday_between',['start_date' => showDate($filter['start_date']), 'end_date' => showDate($filter['end_date'])])}}</h4>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans($filter['type'].'.date_of_birth')}}</th>
                <th>{{trans('general.age')}}</th>
                @if($filter['type'] == 'student')
                    <th>{{trans('student.name')}}</th>
                    <th>{{trans('academic.batch')}}</th>
                    <th>{{trans('student.first_guardian_name')}}</th>
                    <th>{{trans('student.contact_number')}}</th>
                @else
                    <th>{{trans('employee.name')}}</th>
                    <th>{{trans('employee.code')}}</th>
                    <th>{{trans('employee.designation')}}</th>
                    <th>{{trans('employee.contact_number')}}</th>
                @endif
            </tr>
        </thead>
        <tbody>
        	@foreach($birthdays as $birthday)
        		<tr>
        			<td>{{showDate($birthday->date_of_birth)}}</td>
                    <td>{{Carbon\Carbon::parse($birthday->date_of_birth)->diff(Carbon\Carbon::now())->format('%y').' '.trans('general.years')}}</td>
                    @if($filter['type'] == 'student')
                        <td>{{$birthday->name}}</td>
                        <td>{{getStudentBatchOnDate($birthday,date('Y-m-d'))}}</td>
                        <td>{{$birthday->Parent->first_guardian_name}}</td>
                        <td>{{$birthday->contact_number}}</td>
                    @else
                        <td>{{$birthday->name}}</td>
                        <td>{{$birthday->employee_code}}</td>
                        <td>{{getEmployeeDesignationName($birthday,date('Y-m-d'))}}</td>
                        <td>{{$birthday->contact_number}}</td>
                    @endif
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')