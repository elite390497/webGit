@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.employee_anniversary').' '.trans('general.total_result_count',['count' => count($anniversaries)])}}</h2>
    <h4>{{trans('calendar.anniversary_between',['start_date' => showDate($filter['start_date']), 'end_date' => showDate($filter['end_date'])])}}</h4>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.date_of_anniversary')}}</th>
                <th>{{trans('employee.name')}}</th>
                <th>{{trans('employee.code')}}</th>
                <th>{{trans('employee.designation')}}</th>
                <th>{{trans('employee.contact_number')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($anniversaries as $anniversary)
        		<tr>
        			<td>{{showDate($anniversary->date_of_anniversary)}} ({{Carbon\Carbon::parse($anniversary->date_of_anniversary)->diff(Carbon\Carbon::now())->format('%y').' '.trans('general.years')}})</td>
                    <td>{{$anniversary->name}}</td>
                    <td>{{$anniversary->employee_code}}</td>
                    <td>{{getEmployeeDesignationName($anniversary,date('Y-m-d'))}}</td>
                    <td>{{$anniversary->contact_number}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')