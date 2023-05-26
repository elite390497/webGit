@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.expense').' '.trans('general.total_result_count',['count' => count($expenses)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('finance.voucher_number')}}</th>
                <th>{{trans('finance.expense_category')}}</th>
                <th>{{trans('finance.account')}}</th>
                <th>{{trans('finance.payment_method')}}</th>
                <th>{{trans('finance.amount')}}</th>
                <th>{{trans('finance.date_of_expense')}}</th>
                <th>{{trans('general.created_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($expenses as $expense)
        		<tr>
        			<td>{{$expense->transaction->voucher_number}}</td>
                    <td>{{$expense->transactionCategory->name}}</td>
                    <td>{{$expense->transaction->account->name}}</td>
                    <td>{{$expense->transaction->paymentMethod->name}}</td>
                    <td>{{currency($expense->amount,1)}}</td>
                    <td>{{showDate($expense->date_of_expense)}}</td>
                    <td>{{$expense->user->employee->name.' '.getEmployeeDesignationName($expense->user->employee, $expense->date_of_expense)}}</td>
                    <td>{{showDatetime($expense->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')