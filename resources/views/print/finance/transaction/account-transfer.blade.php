@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.account_transfer').' '.trans('general.total_result_count',['count' => count($account_transfers)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('finance.voucher_number')}}</th>
                <th>{{trans('finance.from_account')}}</th>
                <th>{{trans('finance.to_account')}}</th>
                <th>{{trans('finance.payment_method')}}</th>
                <th>{{trans('finance.amount')}}</th>
                <th>{{trans('finance.date_of_account_transfer')}}</th>
                <th>{{trans('general.created_by')}}</th>
                <th>{{trans('general.created_at')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($account_transfers as $account_transfer)
        		<tr>
        			<td>{{$account_transfer->transaction->voucher_number}}</td>
                    <td>{{$account_transfer->fromAccount->name}}</td>
                    <td>{{$account_transfer->toAccount->name}}</td>
                    <td>{{$account_transfer->transaction->paymentMethod->name}}</td>
                    <td>{{currency($account_transfer->amount,1)}}</td>
                    <td>{{showDate($account_transfer->date_of_account_transfer)}}</td>
                    <td>{{$account_transfer->user->employee->name.' '.getEmployeeDesignationName($account_transfer->user->employee, $account_transfer->date_of_account_transfer)}}</td>
                    <td>{{showDatetime($account_transfer->created_at)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')