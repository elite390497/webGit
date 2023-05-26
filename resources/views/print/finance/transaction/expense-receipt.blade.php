@include('print.print-layout.header')
    <table class="heading" style="width: 100%; margin-bottom: 20px;"><tr><td>Payment #{{$expense->transaction->voucher_number}}</td><td style="text-align: right;">Date: {{showDate($expense->date_of_expense)}}</td></tr></table>

    <p style="font-size:15px;">Amount paid for <u><strong>{{$expense->transactionCategory->name}}</strong></u></p>
    <p style="font-size:15px;">Description <u><strong>{{$expense->description}}</strong></u></p>
    <p style="font-size:15px;">Amount <strong><u>{{currency($expense->amount,1)}}</u> <u>({{numberToWord($expense->amount)}})</strong></u></p>

    @if($expense->transaction->paymentMethod)
	    <p style="font-size: 15px;">
	        {{trans('finance.payment_method').': '.$expense->transaction->paymentMethod->name}}
	        <small> <br />
		        @if($expense->transaction->instrument_number){{trans('finance.instrument_number')}} <u>{{$expense->transaction->instrument_number}} </u> @endif
		        @if($expense->transaction->instrument_date){{trans('finance.instrument_date')}} <u>{{showDate($expense->transaction->instrument_date)}} </u> @endif
		        @if($expense->transaction->instrument_bank_detail){{trans('finance.instrument_bank_detail')}} <u>{{$expense->transaction->instrument_bank_detail}} </u> @endif
		        @if($expense->transaction->instrument_clearing_date){{trans('finance.instrument_clearing_date')}} <u>{{showDate($expense->transaction->instrument_clearing_date)}} </u> @endif
		        @if($expense->transaction->reference_number){{trans('finance.reference_number')}} <u>{{$expense->transaction->reference_number}}</u> @endif
		    </small>
	    </p>

    @endif
@include('print.print-layout.footer')