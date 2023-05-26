@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('academic.certificate_template').' '.trans('general.total_result_count',['count' => count($certificate_templates)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
            	<th>{{trans('academic.certificate_template_name')}}</th>
                <th>{{trans('academic.certificate_template_type')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($certificate_templates as $certificate_template)
        		<tr>
                    <td>{{$certificate_template->name}}</td>
        			<td>{{($certificate_template->type == 'student') ? trans('student.student') : trans('employee.employee')}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')