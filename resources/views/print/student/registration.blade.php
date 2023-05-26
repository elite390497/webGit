<!DOCTYPE html>
<html>
<head>
    <title>{{env('APP_NAME')}}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        *{font-family:'Arial';}
        body{width:auto; max-width:auto;margin:0 auto;font-size:12px;}
        h2{font-size: 16px;font-weight: bold;}
        .heading{font-size: 16px;font-weight: bold;}
        .font-weight-bold{font-weight: bold;}
        .font-120pc{font-size: 14px;}
        .tw-50 {width: 50%;}
        table.table-head th{font-size: 12px; font-weight: bold;text-align: right;}
        table.table-head td{font-size: 14px;text-align: center;}

        table.fancy-detail {  font-size:12px; border-collapse: collapse;  width:100%;  margin:0 auto;}
        table.fancy-detail th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em;  padding-left:10px; vertical-align:top;text-align: left;}
        table.fancy-detail td {padding: 0.5em;  padding-left:10px; border-bottom:1px solid #2e2e2e;text-align: left;}
        table.fancy-detail caption {  margin-left: inherit;  margin-right: inherit;}
        table.fancy-detail tr:hover{}

        table.report-card {  font-size:12px; border-collapse: collapse;  width:100%;  margin:0 auto;}
        table.report-card th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em;  padding-left:10px; vertical-align:top;text-align: left;}
        table.report-card td {padding: 0.5em;  padding-left:10px; border:1px solid #2e2e2e;text-align: left;}
        table.report-card caption {  margin-left: inherit;  margin-right: inherit;}
        table.report-card tr:hover{}
        table.no-border {width: 100%;}
        table.no-border td {border:0px;}
        .data {border-bottom: 1px solid black; font-weight: bold;}
        .page-break {page-break-after: always;}
        @media print {
            .mediaprintcustom {display:none}
        }
        table {
            border-collapse: collapse;
            text-transform: uppercase;
            font-size: 12;
        }
        .bordercustom {
            border: thin solid grey;
        }

        thead tr {
            background: #DDD;
        }
        tbody tr.even {
            background: #EEE;
        }
        tbody tr.odd {
            background: #FFF;
        }
        th.dropdown-header > select {
            background: inherit;
            border: none;
            font-weight: bold;
            cursor: pointer;
        }
        th.dropdown-header > select:focus {
            outline: none;
        }
        table > thead th,
        table > thead th > select {
            font-family: Arial;
            font-size: 1em;
            vertical-align: middle;
            color:white;
        }
        img {
            max-width: 170px!important;
        }
        td del {
            display: none;
        }
        img {
            width: 100px!important;
        }
    </style>
</head>
<body>
<div style="@if((isset($print_options) && ! gbv($print_options, 'no_border')) || ! isset($print_options)) border:1px dashed #696969; @endif margin-top: 10px;">
    <div style="padding:10px;background: #ffffff;">
        @if ((isset($print_options) && ! gbv($print_options, 'no_header')) || ! isset($print_options))
            <div style="position: absolute; top: 65px;">{!! getLogo() !!}</div><br>

            <div style="text-align: center">
                <span style="font-size: 20px; font-weight:bold; color: #000000">{{config('config.institute_name')}}</span>
                <br><span style="font-size: 15px; font-weight: bold">{{config('config.address_line_1')}} @if(config('config.address_line_2')) {{config('config.address_line_2')}} @endif @if(config('config.city'))</span>
                <br>{{config('config.city')}} @endif @if(config('config.state')), {{config('config.state')}} @endif @if(config('config.zipcode')), {{config('config.zipcode')}} @endif @if(config('config.country')) {{config('config.country')}} @endif
                <br>@if(config('config.phone')) {{config('config.phone')}}@endif @if(config('config.email')) {{config('config.email')}}@endif
                @if(config('config.website')) <br>{{config('config.website')}}@endif</div>
        @endif
    </div>

    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2 style="text-align: center;">{{trans('Student Registration Report')}}</h2>
    <input class="mediaprintcustom" type="button" value="Print this page" onclick="window.print()">
    <table id="myTable" class="table feeinstallment table-striped fancy-detail bordercustom">
        <thead>
            <tr style="text-transform: uppercase; text-align: center">
                <th class="bordercustom">{{trans('Voucher Number')}}</th>
                <th class="bordercustom">{{trans('student.name')}}</th>
                <th class="bordercustom">{{trans('student.first_guardian_name')}}</th>
                <th class="bordercustom">{{trans('student.date_of_birth')}}</th>
                <th class="bordercustom">{{trans('student.contact_number')}}</th>
                <th class="bordercustom">{{trans('academic.course')}}</th>
                <th class="bordercustom">{{trans('Admission Status')}}</th>
                <th class="bordercustom">{{trans('student.date_of_registration')}}</th>
                <th class="bordercustom">{{trans('student.registration_fee')}}</th>
                <th class="bordercustom">{{trans('Amount')}}</th>
                <th class="bordercustom">{{trans('Date of Payment')}}</th>
                <th class="bordercustom">{{trans('Payment Method')}}</th>
                <th class="bordercustom">{{trans('Payment Method Details')}}</th>
            </tr>
            <tr style="text-transform: uppercase; text-align: center" class="mediaprintcustom">
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom dropdown-header" data-field-name="class"></th>
                <th class="bordercustom dropdown-header" data-field-name="status"></th>
                <th class="bordercustom dropdown-header" data-field-name="date"></th>
                <th class="bordercustom dropdown-header" data-field-name="fee"></th>
                <th class="bordercustom dropdown-header" data-field-name="amount"></th>
                <th class="bordercustom dropdown-header" data-field-name="dp"></th>
                <th class="bordercustom dropdown-header" data-field-name="method"></th>
                <th class="bordercustom dropdown-header" data-field-name="methods"></th>
            </tr>
        </thead>
        <tbody>
        	@foreach($registrations as $registration)
        		<tr>
                    <td class="bordercustom">
                        @if($registration->registration_fee_status == 'paid')
                            {{$transaction = $registration->Transactions->first()->prefix}}{{$transaction = $registration->Transactions->first()->number}}
                        @endif
                    </td>
                    <td class="bordercustom">{{$registration->Student->name}}</td>
                    <td class="bordercustom">{{optional($registration->Student->Parent)->first_guardian_name}}</td>
                    <td class="bordercustom">{{showDate($registration->Student->date_of_birth)}}</td>
                    <td class="bordercustom">{{$registration->Student->contact_number}}</td>
                    <td class="bordercustom" data-field-name="class">{{$registration->Course->name}}</td>
                    <td class="bordercustom" data-field-name="status">{{trans('student.registration_status_'.$registration->status)}}</td>
                    <td class="bordercustom" data-field-name="date">{{showDate($registration->date_of_registration)}}</td>
                    <td class="bordercustom" data-field-name="fee">
                        @if($registration->registration_fee)
                            {{$registration->registration_fee_status == 'paid' ? trans('student.registration_fee_status_paid') : trans('student.registration_fee_status_unpaid')}}
                        @endif
                    </td>
                    <td class="bordercustom" data-field-name="amount">
                        @if($registration->registration_fee)
                            {{$registration->registration_fee,1}}
                        @endif
                    </td>
                    <td class="bordercustom" data-field-name="dp">
                        @if($registration->registration_fee_status == 'paid')
                            {{$transaction = $registration->Transactions->first()->date}}
                        @endif
                    </td>
                    <td class="bordercustom" data-field-name="method">
                        @if($registration->registration_fee_status == 'paid')
                            {{$transaction = $registration->Transactions->first()->PaymentMethod->name}}
                        @endif
                    </td>
                    <td class="bordercustom" data-field-name="methods">
                        @if($registration->registration_fee_status == 'paid')
                            {{$transaction = $registration->Transactions->first()->PaymentMethod->name}} {{$transaction = $registration->Transactions->first()->instrument_bank_detail}} {{$transaction = $registration->Transactions->first()->instrument_number}} {{$transaction = $registration->Transactions->first()->instrument_clearing_date}}
                        @endif
                    </td>
        		</tr>
        	@endforeach


        </tbody>
        <tfoot>
        <tr>
            <th colspan="9"></th>
            <th class="total"></th>
            <th></th>
            <th></th>
            <th></th>
        </tr>
        </tfoot>
    </table>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script>
        $('td').each(function() {
            var $this = $(this);
            $this.html($this.text().replace(/\b00:00:00\b/g, '<del>00:00:00</del>'));
        });
    </script>

    <script>
        (function($) {
            $.fn.tableFilterHeaders = function(filterFn) {
                this.each((index, header) => {
                    let $header = $(header),
                    $table = $header.closest('table'),
                    text = $header.text(),
                    colIndex = $header.closest('th').index(),
                    fieldName = $header.attr('data-field-name') || text.toLowerCase(),
                    $select = $('<select multiple>')
                        .data('fieldName', fieldName)
                        //.append($('<option>').text(text).val('').prop('disabled', true))//
                        .append($('<option>').text('ALL').val('all'))
                        .append($table.find('tbody tr')
                            .toArray()
                            .map(tr => {
                            return $(tr).find(`td:eq(${colIndex})`).text();
            })
            .filter(text => text.trim().length > 0)
            .sort()
                    .filter((v, i, a) => a.indexOf(v) === i)
            .map(text => {
                    return $('<option>').text(text).val(text);
            }));
                $header.empty().append($select.val('').on('change', filterFn));
            });
            };
            $.fn.initRowClasses = function(oddCls, evenCls) {
                this.find('tbody tr').each(function(i) {
                    $(this).toggleClass(oddCls, i % 2 == 0).toggleClass(evenCls, i % 2 == 1);
                });
            };
            $.fn.updateRowClasses = function(oddCls, evenCls) {
                this.find('tbody tr:visible:even').addClass(oddCls).removeClass(evenCls);
                this.find('tbody tr:visible:odd').addClass(evenCls).removeClass(oddCls);
            };
        })(jQuery);

        $('#myTable').initRowClasses('odd', 'even');
        $('.dropdown-header').tableFilterHeaders(filterText);

        function filterText(e) {
            let $filter = $(e.target),
                $table = $filter.closest('table'),
                $filters = $table.find('.dropdown-header select'),
                filterObj = $filters.toArray().reduce((obj, filter) => {
                    let $filter = $(filter);
            return Object.assign(obj, { [$filter.data('fieldName')] : $filter.val() });
        }, {});
            if ($filter.val() === 'all') {
                $filter.val('')
            }
            $table.find('tbody tr').each(function () {
                $(this).toggle($(this).find('td').toArray().every(td => {
                    let $td = $(td), fieldName = $td.attr('data-field-name');
                if (fieldName != null) {
                    if (Array.isArray(filterObj[fieldName])) {
                        return filterObj[fieldName].length === 0 ||
                            filterObj[fieldName].indexOf('all') >= 0 ||
                            filterObj[fieldName].indexOf($td.text()) >= 0;
                    }
                    return filterObj[fieldName] === null ||
                        filterObj[fieldName] === '' ||
                        filterObj[fieldName] === 'all' ||
                        filterObj[fieldName] === $td.text();
                }
                return true;
            }));
            });

            $table.updateRowClasses('odd', 'even');
            var numOfVisibleRows = $('tr').filter(function() {
                return $(this).css('display') !== 'none';
            });
            console.log(numOfVisibleRows.length-3);
            var result = 0;
            for(var i = 2;i<=numOfVisibleRows.length-3+1;i++) {
                console.log(numOfVisibleRows[i]);
                result = result + parseInt(numOfVisibleRows[i].cells[9].innerHTML);
            }
            console.log(result);
            $(".total").html(result);
        }
    </script>

@include('print.print-layout.footer')