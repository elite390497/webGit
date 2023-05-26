@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.employee_group').' '.trans('general.total_result_count',['count' => count($employee_groups)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.employee_group_name')}}</th>
                <th>{{trans('employee.employee_group_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($employee_groups as $employee_group)
        		<tr>
        			<td>{{$employee_group->name}}</td>
                    <td>{{$employee_group->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')