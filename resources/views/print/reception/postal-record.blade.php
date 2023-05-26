@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('reception.postal_record').' '.trans('general.total_result_count',['count' => count($postal_records)])}}</h2>
    <table class="fancy-detail">
        <thead>
            <tr>
                <th>#</th>
                <th>{{trans('reception.postal_record_type')}}</th>
                <th>{{trans('reception.postal_record_reference_number')}}</th>
                <th>{{trans('reception.postal_record_confidential')}}</th>
                <th>{{trans('reception.postal_record_sender')}}</th>
                <th>{{trans('reception.postal_record_receiver')}}</th>
                <th>{{trans('reception.postal_record_date')}}</th>
            </tr>
        </thead>
        <tbody>
        	@foreach($postal_records as $postal_record)
        		<tr>
                    <td>{{$postal_record->id}}</td>
                    <td>{{$postal_record->type}}</td>
                    <td>{{$postal_record->reference_number}}</td>
                    <td>{{$postal_record->is_confidential ? trans('list.yes') : trans('list.no')}}</td>
                    <td>
                        {{$postal_record->sender_title}} <br />
                        {{$postal_record->sender_address}} <br />
                    </td>
                    <td>
                        {{$postal_record->receiver_title}} <br />
                        {{$postal_record->receiver_address}} <br />
                    </td>
                    <td>{{showDate($postal_record->date)}}</td>
        		</tr>
        	@endforeach
        </tbody>
    </table>
@include('print.print-layout.footer')