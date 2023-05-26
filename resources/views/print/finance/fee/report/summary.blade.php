@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_summary_report').' '.trans('general.total_result_count',['count' => count($list)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('student.admission_number_short')}}</th>
                <th>{{trans('student.name')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('student.first_guardian_name')}}</th>
                <th>{{trans('student.contact_number')}}</th>
                <th>{{trans('finance.total_fee')}}</th>
                <th>{{trans('finance.total_concession')}}</th>
                <th>{{trans('finance.paid_fee')}}</th>
                <th>{{trans('finance.balance_fee')}}</th>
                <th>{{trans('finance.late_fee_charged')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($list as $item)
        		<tr>
                    <td>{{ $item['admission_number'] }}</td>
                    <td>{{ $item['name'] }}</td>
                    <td>{{ $item['batch'] }}</td>
                    <td>{{ $item['first_guardian_name'] }}</td>
                    <td>{{ $item['contact_number'] }}</td>
                    <td>{{ $item['total'] }}</td>
                    <td>{{ $item['concession'] }}</td>
                    <td>{{ $item['paid'] }}</td>
                    <td>{{ $item['balance'] }}</td>
                    <td>{{ $item['late'] }}</td>
        		</tr>
        	@endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="5"></th>
                <th>{{ $footer['grand_total'] }}</th>
                <th>{{ $footer['grand_concession'] }}</th>
                <th>{{ $footer['grand_paid'] }}</th>
                <th>{{ $footer['grand_balance'] }}</th>
                <th>{{ $footer['grand_late'] }}</th>
            </tr>
        </tfoot>
    </table>
@include('print.print-layout.footer')