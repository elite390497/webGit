@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.designation').' '.trans('general.total_result_count',['count' => count($designations)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.designation_name')}}</th>
                <th>{{trans('employee.category_name')}}</th>
                <th>{{trans('employee.top_designation')}}</th>
                <th>{{trans('employee.designation_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($designations as $designation)
        		<tr>
        			<td>
                        {{$designation->name}}
                        @if($designation->name == config('config.system_admin_designation'))
                            <span>({{trans('employee.default_designation')}})</span>
                        @endif
                        @if($designation->is_teaching_employee)
                            <span>({{trans('employee.teaching_employee')}})</span>
                        @endif
                    </td>
                    <td>{{$designation->EmployeeCategory->name}}</td>
                    <td>{{$designation->top_designation_id ? $designation->TopDesignation->name : '-'}}</td>
                    <td>{{$designation->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')