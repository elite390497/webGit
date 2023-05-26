@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('employee.salary_structure').' '.trans('general.total_result_count',['count' => count($salaries)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('employee.employee')}}</th>
                <th>{{trans('employee.payroll_template')}}</th>
                <th>{{trans('employee.salary_structure_date_effective')}}</th>
                <th>{{trans('employee.net_salary')}}</th>
                <th>{{trans('employee.salary_structure_description')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($salaries as $salary)
        		<tr>
                    <td>
                        {{$salary->Employee->name_with_code}} <br />
                        <small>{{getEmployeeDesignationName($salary->Employee, $salary->date_effective)}}</small>
                    </td>
                    <td>{{$salary->payrollTemplate->name}}</td>
                    <td>{{showDate($salary->date_effective)}}</td>
                    <td>{{currency($salary->net_salary,1)}}</td>
                    <td>{{$salary->description}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')