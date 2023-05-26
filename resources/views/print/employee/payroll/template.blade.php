@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.payroll_template').' '.trans('general.total_result_count',['count' => count($payroll_templates)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('employee.payroll_template_name')}}</th>
                <th>{{trans('employee.payroll_template_status')}}</th>
                <th>{{trans('employee.payroll_template_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($payroll_templates as $payroll_template)
        		<tr>
                    <td>{{$payroll_template->name}}</td>
                    <td>{{$payroll_template->is_active ? trans('employee.payroll_template_status_active') : trans('employee.payroll_template_status_inactive')}}</td>
                    <td>{{$payroll_template->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')