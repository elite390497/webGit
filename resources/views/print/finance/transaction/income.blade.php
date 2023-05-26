@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.income').' '.trans('general.total_result_count',['count' => count($incomes)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('finance.voucher_number')}}</th>
                <th>{{trans('finance.income_category')}}</th>
                <th>{{trans('finance.account')}}</th>
                <th>{{trans('finance.payment_method')}}</th>
                <th>{{trans('finance.amount')}}</th>
                <th>{{trans('finance.date_of_income')}}</th>
                <th>{{trans('general.created_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($incomes as $income)
        		<tr>
        			<td>{{$income->transaction->voucher_number}}</td>
                    <td>{{$income->transactionCategory->name}}</td>
                    <td>{{$income->transaction->account->name}}</td>
                    <td>{{$income->transaction->paymentMethod->name}}</td>
                    <td>{{currency($income->amount,1)}}</td>
                    <td>{{showDate($income->date_of_income)}}</td>
                    <td>{{$income->user->employee->name.' '.getEmployeeDesignationName($income->user->employee, $income->date_of_income)}}</td>
                    <td>{{showDatetime($income->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')