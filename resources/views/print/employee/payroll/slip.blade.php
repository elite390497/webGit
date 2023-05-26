@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <table class="heading" style="width: 100%; margin-bottom: 20px;"><tr><td>{{trans('employee.payroll').' #'.str_pad($payroll->id, 3, '0', STR_PAD_LEFT)}}</td><td style="text-align: right;">{{trans('general.date').': '.showDate($payroll->created_at)}}</td></tr></table>
    <table class="fancy-detail">
        <tbody>
            <tr>
                <td><strong>{{trans('employee.name')}}</strong></td>
                <td>{{$payroll->employee->name}}</td>
                <td><strong>{{trans('employee.code')}}</strong></td>
                <td>{{$payroll->employee->code}}</td>
            </tr>
            <tr>
                <td><strong>{{trans('employee.designation')}}</strong></td>
                <td>{{getEmployeeDesignationName($payroll->employee, $payroll->start_date)}}</td>
                <td><strong>{{trans('employee.contact_number')}}</strong></td>
                <td>{{$payroll->employee->contact_number}}</td>
            </tr>
            <tr>
                <td><strong>{{trans('employee.payroll_period')}}</strong></td>
                <td>{{showDate($payroll->start_date).' '.trans('general.to').' '.showDate($payroll->end_date)}}</td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>
    <table class="fancy-detail" style="margin-top: 20px;">
        <tbody>
            <tr>
                <th>{{trans('employee.earning_salary')}}</th>
                <th>{{trans('employee.deduction_salary')}}</th>
            </tr>
            <tr>
                <td valign="top">
                    <table class="no-border">
                        <tbody>
                            <?php $total_earning = 0; ?>
                            @foreach ($payroll->payrollDetails as $payroll_detail)
                                @if ($payroll_detail->payHead->type == 'earning')
                                <tr>
                                    <td width="50%">{{$payroll_detail->payHead->name}}</td>
                                    <td style="text-align: right;">{{currency($payroll_detail->amount,1)}}</td>
                                </tr>
                                <?php $total_earning += $payroll_detail->amount; ?>
                                @endif
                            @endforeach
                        </tbody>
                    </table>                    
                </td>
                <td valign="top">
                    <table class="no-border">
                        <tbody>
                            <?php $total_deduction = 0; ?>
                            @foreach ($payroll->payrollDetails as $payroll_detail)
                                @if ($payroll_detail->payHead->type == 'deduction')
                                <tr>
                                    <td width="50%">{{$payroll_detail->payHead->name}}</td>
                                    <td style="text-align: right;">{{currency($payroll_detail->amount,1)}}</td>
                                </tr>
                                <?php $total_deduction += $payroll_detail->amount; ?>
                                @endif
                            @endforeach
                        </tbody>
                    </table>                
                </td>
            </tr>
            <tr>
                <td valign="top">
                    <table class="no-border">
                        <tbody>
                            <tr>
                                <td width="50%">{{trans('employee.total_earning')}}</td>
                                <td style="text-align: right;">{{currency($total_earning,1)}}</td>
                            </tr>
                        </tbody>
                    </table>                    
                </td>
                <td valign="top">
                    <table class="no-border">
                        <tbody>
                            <tr>
                                <td width="50%">{{trans('employee.total_deduction')}}</td>
                                <td style="text-align: right;">{{currency($total_deduction,1)}}</td>
                            </tr>
                        </tbody>
                    </table>                
                </td>
            </tr>
            <tr>
                <th>{{trans('employee.net_salary')}}</th>
                <th style="text-align: right;">{{currency($payroll->total,1)}}</th>
            </tr>
        </tbody>
    </table>

@include('print.print-layout.signatory')
