@include('print.print-layout.header')
    <table class="heading" style="width: 100%; margin-bottom: 20px;"><tr><td>Payment #{{$account_transfer->transaction->voucher_number}}</td><td style="text-align: right;">Date: {{showDate($account_transfer->date_of_account_transfer)}}</td></tr></table>

    <p style="font-size:15px;">From <u><strong>{{$account_transfer->fromAccount->name}}</strong></u> to <u><strong>{{$account_transfer->toAccount->name}}</strong></u></p>
    <p style="font-size:15px;">Description <u><strong>{{$account_transfer->description}}</strong></u></p>
    <p style="font-size:15px;">Amount <strong><u>{{currency($account_transfer->amount,1)}}</u> <u>({{numberToWord($account_transfer->amount)}})</strong></u></p>

    @if($account_transfer->transaction->paymentMethod)
	    <p style="font-size: 15px;">
	        {{trans('finance.payment_method').': '.$account_transfer->transaction->paymentMethod->name}}
	        <small> <br />
		        @if($account_transfer->transaction->instrument_number){{trans('finance.instrument_number')}} <u>{{$account_transfer->transaction->instrument_number}} </u> @endif
		        @if($account_transfer->transaction->instrument_date){{trans('finance.instrument_date')}} <u>{{showDate($account_transfer->transaction->instrument_date)}} </u> @endif
		        @if($account_transfer->transaction->instrument_bank_detail){{trans('finance.instrument_bank_detail')}} <u>{{$account_transfer->transaction->instrument_bank_detail}} </u> @endif
		        @if($account_transfer->transaction->instrument_clearing_date){{trans('finance.instrument_clearing_date')}} <u>{{showDate($account_transfer->transaction->instrument_clearing_date)}} </u> @endif
		        @if($account_transfer->transaction->reference_number){{trans('finance.reference_number')}} <u>{{$account_transfer->transaction->reference_number}}</u> @endif
		    </small>
	    </p>

    @endif
@include('print.print-layout.footer')