@include('print.print-layout.header')
    <table class="heading" style="width: 100%; margin-bottom: 20px;"><tr><td>Receipt #{{$income->transaction->voucher_number}}</td><td style="text-align: right;">Date: {{showDate($income->date_of_income)}}</td></tr></table>

    <p style="font-size:15px;">Amount received for <u><strong>{{$income->transactionCategory->name}}</strong></u></p>
    <p style="font-size:15px;">Description <u><strong>{{$income->description}}</strong></u></p>
    <p style="font-size:15px;">Amount <strong><u>{{currency($income->amount,1)}}</u> <u>({{numberToWord($income->amount)}})</strong></u></p>

    @if($income->transaction->paymentMethod)
	    <p style="font-size: 15px;">
	        {{trans('finance.payment_method').': '.$income->transaction->paymentMethod->name}}
	        <small> <br />
		        @if($income->transaction->instrument_number){{trans('finance.instrument_number')}} <u>{{$income->transaction->instrument_number}} </u> @endif
		        @if($income->transaction->instrument_date){{trans('finance.instrument_date')}} <u>{{showDate($income->transaction->instrument_date)}} </u> @endif
		        @if($income->transaction->instrument_bank_detail){{trans('finance.instrument_bank_detail')}} <u>{{$income->transaction->instrument_bank_detail}} </u> @endif
		        @if($income->transaction->instrument_clearing_date){{trans('finance.instrument_clearing_date')}} <u>{{showDate($income->transaction->instrument_clearing_date)}} </u> @endif
		        @if($income->transaction->reference_number){{trans('finance.reference_number')}} <u>{{$income->transaction->reference_number}}</u> @endif
		    </small>
	    </p>

    @endif
@include('print.print-layout.footer')