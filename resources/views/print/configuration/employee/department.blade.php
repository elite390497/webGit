@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.department').' '.trans('general.total_result_count',['count' => count($departments)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.department_name')}}</th>
                <th>{{trans('employee.department_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($departments as $department)
        		<tr>
        			<td>{{$department->name}}</td>
                    <td>{{$department->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')