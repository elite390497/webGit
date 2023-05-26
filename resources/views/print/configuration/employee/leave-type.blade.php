@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.leave_type').' '.trans('general.total_result_count',['count' => count($employee_leave_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.leave_type_name')}}</th>
                <th>{{trans('employee.leave_type_alias')}}</th>
                <th>{{trans('employee.leave_type_status')}}</th>
                <th>{{trans('employee.leave_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($employee_leave_types as $employee_leave_type)
        		<tr>
                    <td>{{$employee_leave_type->name}}</td>
        			<td>{{$employee_leave_type->alias}}</td>
                    <td>
                        {{trans('employee.leave_type_status_'.($employee_leave_type->is_active ? 'active' : 'inactive'))}}
                    </td>
                    <td>{{$employee_leave_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')