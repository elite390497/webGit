@include('print.print-layout.receipt-header')
@php 
    $count = count($transactions);
    $receipt_title =trans('finance.receipt').' #' .  $transactions[0]->voucher_number;
    $feeinstallment_title = $transactions[0]->studentFeeRecord->feeInstallment->title;
    for ($i = 1; $i < $count; $i++) {
        $receipt_title .= ',' . $transactions[$i]->voucher_number;
        if ($i === $count-1){
            $feeinstallment_title .= ' to '. $transactions[$i]->studentFeeRecord->feeInstallment->title;
        }
    }
@endphp
<table class="heading" style="width: 100%; margin-bottom: 8px; font-size : 12px;"><tr><td>{{$receipt_title}}</td><td style="text-align: right;">{{trans('general.date').': '.showDate($transactions[$count-1]->date)}}</td></tr></table>
<table class="fancy-detail">
    <tr>
        <th style="text-align: center;font-size: 14px;">FEE RECEIPT</th>
    </tr>
</table>
<table class="fancy-detail">
    <tbody>
        <tr>
            <td><strong>{{trans('student.name')}}</strong></td>
            <td>{{$student_record->student->name}}</td>
            <td><strong>{{trans('student.admission_number')}}</strong></td>
            <td>{{$student_record->admission->number}}</td>
            </tr>
        <tr>
            <td><strong>{{trans('academic.course')}}</strong></td>
            <td>{{$student_record->batch->course->name.' '.$student_record->batch->name}}</td>
            <td><strong>{{trans('academic.session')}}</strong></td>
            <td>{{config('config.default_academic_session.name')}}</td>
        </tr>
        <tr>
            <td><strong>{{trans('student.contact_number')}}</strong></td>
            <td>{{$student_record->student->contact_number}}</td>
            <td><strong>{{trans('student.date_of_birth')}}</strong></td>
            <td>{{showDate($student_record->student->date_of_birth)}}</td>
        </tr>
        </tbody>
</table>

<h3 style="margin-top: 8px;">{{$feeinstallment_title}} </h3>
@php
    $i = 1;
    $transaction_additional_fee_charge_amount = 0;
    $transaction_additional_fee_discount_amount = 0;
    $transport_fee = 0;
    $late_fee = 0;
    $total_amount_received = 0;
    $paid_amount = [];
    for ($j = 0; $j < $count; $j++) {
        $transaction_additional_fee_charge = $transactions[$j]->getOption('additional_fee_charge');
        $transaction_additional_fee_charge_amount += gv($transaction_additional_fee_charge, 'amount', 0);
        $transaction_additional_fee_charge_label = gv($transaction_additional_fee_charge, 'label');
        $transaction_additional_fee_discount = $transactions[$j]->getOption('additional_fee_discount');
        $transaction_additional_fee_discount_amount += gv($transaction_additional_fee_discount, 'amount', 0);
        $transaction_additional_fee_discount_label = gv($transaction_additional_fee_discount, 'label');

        $transport_fee += $transactions[$j]->getOption('transport_fee');
        $late_fee += $transactions[$j]->getOption('late_fee');
        $total_amount_received += $transactions[$j]->amount;
    }
@endphp
<table class="fancy-detail" style="margin-top: 10px;">
    <thead>
        <tr>
            <th>SNo</th>
            <th>Description</th>
            <th>Due</th>
            <th>Concession</th>
            <th style="text-align: right;">Paid</th>
        </tr>
    </thead>
    <tbody>
            @foreach($transactions[$count-1]->studentFeeRecordDetails as $student_fee_record_detail)
                @php
                    $amount = 0;
                    $concession_amount = 0;
                @endphp
                @for($k = 0; $k <= count($transactions[$count-1]->studentFeeRecordDetails); $k++)
                    @php
                        $paid_amount[$k] = 0;
                    @endphp
                @endfor
                @for($j = 0; $j < $count; $j++)
                    @php
                        $k = 0;
                        $fee_installment_detail = $transactions[$j]->studentFeeRecord->feeInstallment->feeInstallmentDetails->firstWhere('fee_head_id', $student_fee_record_detail->fee_head_id);
                        $amount += $fee_installment_detail ? $fee_installment_detail->amount : 0;
                        $fee_concession = $transactions[$j]->studentFeeRecord->feeConcession;
                        $optional_fee_records = $transactions[$j]->studentFeeRecord->studentOptionalFeeRecords;
                        if ($fee_concession) {
                            $fee_concession_detail = $fee_concession->feeConcessionDetails->firstWhere('fee_head_id', $student_fee_record_detail->fee_head_id);
                            if ($fee_concession_detail) {
                                if ($fee_concession_detail->type == 'percent') {
                                    $concession_amount += ($amount * $fee_concession_detail->amount/100);
                                } else {
                                    $concession_amount += $fee_concession_detail->amount;
                                }
                            }
                        }
                    @endphp
                    @foreach($transactions[$j]->studentFeeRecordDetails as $student_fee_record_detail_s)
                        @php
                            $paid_amount[$k] += $student_fee_record_detail_s->amount;
                            $k++;
                        @endphp
                    @endforeach
                @endfor
                @if (! in_array($student_fee_record_detail->fee_head_id, $optional_fee_records->pluck('fee_head_id')->all()))
                    <tr>
                        <td>{{$i}}</td>
                        <td style="width: 60%;" class="font-weight-bold">{{$student_fee_record_detail->FeeHead->name}}</td>
                        <td>
                            {{currency($amount,1)}}
                        </td>
                        <td>
                            {{currency($concession_amount,1)}}
                        </td>
                        <td style="text-align: right;">
                            {{currency($paid_amount[$i-1],1)}}
                        </td>
                    </tr>
                    @php
                        $i++;
                    @endphp
                @endif
            @endforeach
        @if($transaction_additional_fee_charge && $transaction_additional_fee_charge_amount > 0)
            <tr>
                <td>{{$i}}</td>
                <td style="width: 60%;" class="font-weight-bold">{{ trans('student.additional_fee_charge') }} <small>({{$transaction_additional_fee_charge_label}})</small></td>
                <td>
                </td>
                <td>
                </td>
                <td style="text-align: right;">{{currency($transaction_additional_fee_charge_amount,1)}}</td>
            </tr>
            @php
                $i++;
            @endphp
        @endif
        @if($transaction_additional_fee_discount && $transaction_additional_fee_discount_amount > 0)
            <tr>
                <td>{{$i}}</td>
                <td style="width: 60%;" class="font-weight-bold">{{ trans('student.additional_fee_discount') }} <small>({{$transaction_additional_fee_discount_label}})</td>
                <td>
                </td>
                <td>
                </td>
                <td style="text-align: right;">(-) {{currency($transaction_additional_fee_discount_amount,1)}}</td>
            </tr>
            @php
                $i++;
            @endphp
        @endif
        @if($transport_fee)
            <tr>
                <td>{{$i}}</td>
                <td style="width: 60%;" class="font-weight-bold">{{trans('transport.fee')}}</td>
                <td></td>
                <td></td>
                <td style="text-align: right;">{{currency($transport_fee,1)}}</td>
            </tr>
            @php
                $i++;
            @endphp
        @endif
        @if($late_fee)
            <tr>
                <td>{{$i}}</td>
                <td style="width: 60%;" class="font-weight-bold">{{trans('finance.late_fee')}}</td>
                <td></td>
                <td></td>
                <td style="text-align: right;">{{currency($late_fee,1)}}</td>
            </tr>
        @endif
        <tr style="font-size: 13px;">
            <td></td>
            <td class="font-weight-bold">{{trans('finance.total_amount_received')}}</td>
            <td></td>
            <td></td>
            <td style="text-align: right;">{{currency($total_amount_received,1)}}</td>
        </tr>
    </tbody>
</table>
@if($transactions[$count-1]->payment_method_id)
    <table class="fancy-detail">
        <tr>
            <th style="text-align: center;">Pay Mode Information</th>
        </tr>
    </table>
    <p style="font-size: 12px; margin-left: 10px;">
        {{trans('finance.payment_method').': '.$transactions[$count-1]->paymentMethod->name}}
        @if($transactions[$count-1]->instrument_number){{trans('finance.instrument_number')}} <u>{{$transactions[$count-1]->instrument_number}} </u> @endif
        @if($transactions[$count-1]->instrument_date){{trans('finance.instrument_date')}} <u>{{showDate($transactions[$count-1]->instrument_date)}} </u> @endif
        @if($transactions[$count-1]->instrument_bank_detail){{trans('finance.instrument_bank_detail')}} <u>{{$transactions[$count-1]->instrument_bank_detail}} </u> @endif
        @if($transactions[$count-1]->instrument_clearing_date){{trans('finance.instrument_clearing_date')}} <u>{{showDate($transactions[$count-1]->instrument_clearing_date)}} </u> @endif
        @if($transactions[$count-1]->reference_number){{trans('finance.reference_number')}} <u>{{$transactions[$count-1]->reference_number}}</u> @endif
    </p>
@else
    <p style="font-size: 12px; margin-left: 10px;">
        {{trans('finance.payment_method').': '.trans('finance.online_payment')}} ({{$transactions[1]->reference_number}})
    </p>
@endif
<table class="fancy-detail" style="margin-top: 8px;">
    <tbody>
        <tr>
            <td>Total</td>
            <td style="text-align: right; font-weight: bold;">{{currency($total_amount_received,1)}}</td>
        </tr>
        <tr>
            <td style="text-align: left; font-size: 10px;">{{trans('general.printed_on').' '.showDateTime(now())}}</td>
            <td style="text-align: right; font-weight: bold;"> {{currencyInWord($total_amount_received)}}</td>
        </tr>
    </tbody>
</table>
@include('print.print-layout.signatory')