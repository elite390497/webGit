@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.document_type').' '.trans('general.total_result_count',['count' => count($employee_document_types)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('employee.document_type_name')}}</th>
                <th>{{trans('employee.document_type_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($employee_document_types as $employee_document_type)
        		<tr>
        			<td>{{$employee_document_type->name}}</td>
                    <td>{{$employee_document_type->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')