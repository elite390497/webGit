@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.payroll').' '.trans('general.total_result_count',['count' => count($payrolls)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('employee.payroll')}}</th>
                <th>{{trans('employee.employee')}}</th>
                <th>{{trans('employee.payroll_period')}}</th>
                <th>{{trans('employee.net_salary')}}</th>
                <th>{{trans('employee.payroll_status')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($payrolls as $payroll)
        		<tr>
                    <td>#{{getPayrollNumber($payroll->id)}}</td>
                    <td>
                        {{$payroll->Employee->name_with_code}} <br />
                        <small>{{getEmployeeDesignationName($payroll->Employee, $payroll->start_date)}}</small>
                    </td>
                    <td>{{showDate($payroll->start_date).' '.trans('general.to').' '.showDate($payroll->end_date)}}</td>
                    <td>{{currency($payroll->total, 1)}}</td>
                    <td>{{trans('employee.payroll_status_'.$payroll->payment_status)}}</td>
                    <td>{{showDateTime($payroll->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')