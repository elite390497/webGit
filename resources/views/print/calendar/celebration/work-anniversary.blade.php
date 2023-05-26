@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.employee_work_anniversary').' '.trans('general.total_result_count',['count' => count($work_anniversaries)])}}</h2>
    <h4>{{trans('calendar.work_anniversary_between',['start_date' => showDate($filter['start_date']), 'end_date' => showDate($filter['end_date'])])}}</h4>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.date_of_work_anniversary')}}</th>
                <th>{{trans('employee.name')}}</th>
                <th>{{trans('employee.code')}}</th>
                <th>{{trans('employee.designation')}}</th>
                <th>{{trans('employee.contact_number')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($work_anniversaries as $anniversary)
        		<tr>
        			<td>
                        {{showDate($anniversary->date_of_joining)}} ({{Carbon\Carbon::parse($anniversary->date_of_joining)->diff(Carbon\Carbon::now())->format('%y').' '.trans('general.years')}})
                    </td>
                    <td>{{$anniversary->employee->name}}</td>
                    <td>{{$anniversary->employee->employee_code}}</td>
                    <td>{{getEmployeeDesignationName($anniversary->employee,date('Y-m-d'))}}</td>
                    <td>{{$anniversary->employee->contact_number}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')