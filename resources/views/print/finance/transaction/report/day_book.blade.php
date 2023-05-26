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
            max-width: 100px!important;
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
    <h2>{{trans('finance.transaction_day_book_report').' '.trans('general.total_result_count',['count' => count($list)])}}</h2>
    <table id="myTable" class="table feeinstallment table-striped fancy-detail bordercustom">
        <thead>
            <tr style="text-transform: uppercase; text-align: center">
                <th class="bordercustom">{{trans('finance.voucher_number')}}</th>
                <th class="bordercustom">{{trans('finance.date')}}</th>
                <th class="bordercustom">{{trans('finance.payment')}}</th>
                <th class="bordercustom">{{trans('finance.receipt')}}</th>
                <th class="bordercustom">{{trans('general.description')}}</th>

                <th class="bordercustom">{{trans('finance.account')}}</th>
                <th class="bordercustom">{{trans('finance.payment_method')}}</th>
                <th style="width: 12%" class="bordercustom">{{trans('Payment Method Detail')}}</th>
                <th class="bordercustom">{{trans('general.entry_by')}}</th>
            </tr>
            <tr style="text-transform: uppercase; text-align: center" class="mediaprintcustom">
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom dropdown-header" data-field-name="account"></th>
                <th class="bordercustom dropdown-header" data-field-name="payment"></th>
                <th class="bordercustom"></th>
                <th class="bordercustom"></th>
            </tr>
        </thead>
        <tbody>
        	@foreach($list as $index => $item)
        		<tr>

                    <td class="bordercustom">{{gv($item, 'voucher_number')}}</td>
                    <td class="bordercustom">{{showDate(gv($item, 'date'))}}</td>
                    <td class="bordercustom">{{gv($item, 'type') == 'payment' ? gv($item, 'amount') : '-'}}</td>
                    <td class="bordercustom">{{gv($item, 'type') == 'receipt' ? gv($item, 'amount') : '-'}}</td>
                    <td class="bordercustom">{{gv($item,'head')}}</td>

                    <td class="bordercustom" data-field-name="account">{{gv($item, 'account')}}</td>
                    <td class="bordercustom" data-field-name="payment">
                        {{gv($item, 'payment_method')}}

                    </td>
                    <td class="bordercustom">
                        {{gv($item, 'payment_method')}}
                        @if (gv($item, 'payment_method_detail'))
                            {!! gv($item, 'payment_method_detail') !!}
                        @endif
                    </td>
                    <td>{{gv($item,'employee')}}</td>
        		</tr>
        	@endforeach
        </tbody>
        <tfoot>
            <tr>
                <th></th>
                <th></th>
                <th></th>
                <th class="total">{{gv($footer,'total_receipts')}}</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
            </tr>
        </tfoot>
    </table>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
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
            result = result + parseInt(numOfVisibleRows[i].cells[3].innerHTML);
        }
        console.log(result);
        $(".total").html(result);
    }
</script>
    <script>
        $('td').each(function() {
            var $this = $(this);
            $this.html($this.text().replace(/\b.00000\b/g, '<del>.00000</del>'));
        });
    </script>
@include('print.print-layout.footer')