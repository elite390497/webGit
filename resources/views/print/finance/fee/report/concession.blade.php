@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_concession_report').' '.trans('general.total_result_count',['count' => count($list)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>{{trans('student.admission_number_short')}}</th>
                <th>{{trans('student.name')}}</th>
                <th>{{trans('academic.batch')}}</th>
                <th>{{trans('student.first_guardian_name')}}</th>
                <th>{{trans('student.contact_number')}}</th>
                <th>{{trans('finance.fee_installment')}}</th>
                <th>{{trans('finance.fee_concession')}}</th>
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
                    <td>{{ $item['fee_installment'] }}</td>
                    <td>
                        <ul style="list-style-type: none; padding-left: 0px;">
                            @foreach($item['concession'] as $concession)
                                <li>
                                    {{$concession['name']}} {{$concession['value']}}
                                </li>
                            @endforeach
                        </ul>
                    </td>
        		</tr>
        	@endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="6"></th>
                <th>{{ $footer['total_concession'] }}</th>
            </tr>
        </tfoot>
    </table>
@include('print.print-layout.footer')