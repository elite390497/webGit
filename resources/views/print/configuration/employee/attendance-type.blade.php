@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.attendance_type').' '.trans('general.total_result_count',['count' => count($employee_attendance_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('employee.attendance_type')}}</th>
            	<th>{{trans('employee.attendance_type_name')}}</th>
                <th>{{trans('employee.attendance_type_alias')}}</th>
                <th>{{trans('employee.attendance_type_status')}}</th>
                <th>{{trans('employee.attendance_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($employee_attendance_types as $employee_attendance_type)
        		<tr>
                    <td>{{trans('employee.attendance_type_'.$employee_attendance_type->type)}}</td>
                    <td>{{$employee_attendance_type->name}}</td>
        			<td>{{$employee_attendance_type->alias}}</td>
                    <td>
                        {{trans('employee.attendance_type_status_'.($employee_attendance_type->is_active ? 'active' : 'inactive'))}}
                    </td>
                    <td>{{$employee_attendance_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')