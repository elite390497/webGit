@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.account').' '.trans('general.total_result_count',['count' => count($accounts)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('finance.account_name')}}</th>
                <th>{{trans('finance.account_opening_balance')}}</th>
                <th>{{trans('finance.account_type')}}</th>
                <th>{{trans('finance.bank_detail')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($accounts as $account)
        		<tr>
        			<td>{{$account->name}}</td>
                    <td>{{currency($account->opening_balance,1)}}</td>
                    <td>{{ trans('finance.'.$account->type) }}</td>
                    <td>
                        @if($account->type == 'bank')
                            <ul style="list-style:none;padding:0;margin:0">
                                <li><strong>{{trans('finance.account_number')}}:</strong> {{$account->account_number}}</li>
                                <li><strong>{{trans('finance.bank_name')}}:</strong> {{$account->bank_name}}</li>
                                <li><strong>{{trans('finance.branch_name')}}:</strong> {{$account->branch_name}}</li>
                                <li><strong>{{trans('finance.bank_identification_code')}}:</strong> {{$account->bank_identification_code}}</li>
                            </ul>
                        @endif
                    </td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')