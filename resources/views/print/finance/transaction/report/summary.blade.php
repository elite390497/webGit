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
        table.fancy-detail th{  background:#696969; color:#FFFFFF; border-bottom: 1px #2e2e2e solid;  padding: 0.5em 0.5em 0.5em 0.5em; vertical-align:top;text-align: left;}
        table.fancy-detail td {padding: 0.5em;  padding-left:5px; border-bottom:1px solid #2e2e2e;text-align: left;}
        table.fancy-detail caption {  margin-left: inherit;  margin-right: inherit;}
        table.fancy-detail tr:hover{}


        table.no-border {width: 100%;}
        table.no-border td {border:0px;}
        .data {border-bottom: 1px solid black; font-weight: bold;}
        .page-break {page-break-after: always;}
        @media print {
            .mediaprintcustom {display:none}
            .datewidth {
                width: 10%;
            }
        }
        table {
            border-collapse: collapse;
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
        /**start of hide td if specific text found-->**/
        .academic {
            text-indent: -9999px
        }
        /**end of hide td if specific text found-->**/
        #myTable {
            font-family: "Arial Narrow";
            font-size: 11px;
            text-transform: capitalize;

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
    <input class="mediaprintcustom" type="button" value="Print This Page" onclick="window.print()">
    <table id="myTable" class="table feeinstallment table-striped fancy-detail bordercustom">
        <thead>
            <tr>
                <th class="mediaprintcustom">#</th>
                <th>{{trans('Receipt No')}}</th>
                <th>{{trans('Adm No')}}</th>
                <th>{{trans('Details')}}</th>
                <th>{{trans('Class')}}</th>
                
                <th class="mediaprintcustom">{{trans('Expense')}}</th>
                <th>{{trans('Income')}}</th>
                <th>{{trans('Concession')}}</th>
                <th style="width: 5%">{{trans('finance.fee_installment')}}</th>
                <th style="width: 5%">{{trans('Fee Type')}}</th>
                <th class="datewidth">{{trans('finance.date')}}</th>
                <th>{{trans('Academic Session')}}</th>
                <!--<th>{{trans('finance.account')}}</th>-->
                
                <th style="width: 5%">Payment Type</th>
                <th style="width: 12%">payment method details</th>
                <!--<th class="mediaprintcustom">{{trans('general.entry_by')}}</th>-->
            </tr>
            <tr style="text-transform: uppercase; text-align: center" class="mediaprintcustom">
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom dropdown-header" data-field-name="adm"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom dropdown-header" data-field-name="batch"></th>
                
                <th class="bordercustom dropdown-header" data-field-name="expence"></th>
                <th class="bordercustom dropdown-header" data-field-name="income"></th>
                <th class="bordercustom dropdown-header" data-field-name="concession"></th>
                <th class="bordercustom dropdown-header" data-field-name="term"></th>
                <th class="bordercustom dropdown-header" data-field-name="group"></th>
                <th class="bordercustom dropdown-header" data-field-name="date"></th>
                <th class="bordercustom dropdown-header" data-field-name="academic"></th>
                
                
                <th class="bordercustom dropdown-header" data-field-name="payment"></th>
                <th class="bordercustom"></th>
            </tr>
        </thead>
        <tbody>
        	@foreach($list as $index => $item)
        		<tr>
                    <td class="bordercustom mediaprintcustom">{{$index+1}}</td>
                    <td class="bordercustom">{{gv($item,'voucher_number')}}</td>
                    <td class="bordercustom" data-field-name="adm">{{gv($item, 'admission_number')}}</td>
                    <td class="bordercustom">{{gv($item,'head')}}</td>
                    <td class="bordercustom" data-field-name="batch">{{gv($item,'batch')}}</td>
                    
                    <td class="bordercustom mediaprintcustom" data-field-name="expence">{{gv($item, 'type') == 'payment' ? gv($item, 'amount') : '-'}}</td>
                    <td td class="bordercustom" data-field-name="income">{{gv($item, 'type') == 'receipt' ? gv($item, 'amount') : '-'}}</td>
                    <td td class="bordercustom" data-field-name="concession">{{gv($item, 'fee_concession')}}</td>
                    <td class="bordercustom" data-field-name="term">{{gv($item,'term')}}</td>
                    <td class="bordercustom" data-field-name="group">{{gv($item,'fee_group')}}</td>
                    <td class="bordercustom" data-field-name="date">{{showDate(gv($item, 'date'))}}</td>
                    <td class="bordercustom" data-field-name="academic">{{gv($item,'academic_session')}}</td>
                    
                    
                    <td class="bordercustom" data-field-name="payment">
                        {{gv($item, 'payment_method')}}
                        
                    </td>
                    <td>
                        {{gv($item, 'payment_method')}}<br>
                        @if (gv($item, 'payment_method_detail'))
                            {!! gv($item, 'payment_method_detail') !!}
                        @endif
                    </td>

                    <!--<td class="mediaprintcustom">{{gv($item,'employee')}}</td>-->
        		</tr>
        	@endforeach

        </tbody>
        <tfoot>
        </tfoot>
        <tr>
            <th colspan="3"></th>
            <th>{{gv($footer,'total_payments')}}</th>
            <th>{{gv($footer,'total_receipts')}}</th>
           <th>{{gv($footer,'total_concessions')}}</th>
            <th colspan="7"></th>
        </tr>
    </table>


    <!--javascript session created by enovic-->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.5.0.js"></script>










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
                result = result + parseInt(numOfVisibleRows[i].cells[4].innerHTML);
            }
            console.log(result);
            $(".total").html(result);
        }
    </script>


    <!--end of javascript session created by enovic-->


    <h4 style="margin-left: 20px;">{{trans('finance.fee_summary_report')}}</h4>
    <ul style="list-style: none;">
        @foreach (gv($footer, 'fee_summary') as $fee_head => $summary)
            <li>{{$fee_head}}: {{$summary}}</li>
        @endforeach
    </ul>

    </body></html>
@include('print.print-layout.footer')