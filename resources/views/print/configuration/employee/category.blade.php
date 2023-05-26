@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.category').' '.trans('general.total_result_count',['count' => count($employee_categories)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.category_name')}}</th>
                <th>{{trans('employee.designation')}}</th>
                <th>{{trans('employee.category_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($employee_categories as $employee_category)
        		<tr>
        			<td>{{$employee_category->name}}</td>
                    <td>
                        <ul style="list-style:none;padding:0;margin:0;">
                            @foreach($employee_category->designations as $designation)
                                <li>{{$designation->name}}</li>
                            @endforeach
                        </ul>
                    </td>
                    <td>{{$employee_category->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')