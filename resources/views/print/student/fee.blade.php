@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_detail')}}</h2>
    <table class="fancy-detail">
        <tbody>
            <tr>
                <td><strong>{{trans('student.name')}}</strong></td>
                <td>{{$record->Student->name}}</td>
                <td><strong>{{trans('student.first_guardian_name')}}</strong></td>
                <td>{{optional($record->Student->Parent)->first_guardian_name}}</td>
            </tr>
            <tr>
                <td><strong>{{trans('student.admission_number')}}</strong></td>
                <td>{{$record->Admission->admission_number}}</td>
                <td><strong>{{trans('academic.course')}}</strong></td>
                <td>{{$record->Batch->batch_with_course}}</td>
            </tr>
            <tr>
                <td><strong>{{trans('student.contact_number')}}</strong></td>
                <td>{{$record->Student->contact_number}}</td>
                <td><strong>{{trans('student.date_of_birth')}}</strong></td>
                <td>{{showDate($record->Student->date_of_birth)}}</td>
            </tr>
        </tbody>
    </table>
    @foreach($fee['groups'] as $group)
        <h2>{{$group['name']}}</h2>
        <table class="fancy-detail">
            <thead>
                <tr>
                    @foreach($group['heads'] as $head)
                	   <th>{{$head}}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
            	@foreach($group['installments'] as $installment)
            		<tr>
                        @foreach($installment['data'] as $detail)
                            <td>
                                @if(gbv($detail, 'is_concession') && $detail['text'] != $detail['actual'])
                                    <span style="text-decoration: line-through;">{{$detail['actual']}}</span> {{$detail['text']}}
                                @else
                                    {{$detail['text']}}
                                @endif
                            </td>
                        @endforeach
            		</tr>
            	@endforeach
                <tr>
                    @foreach($group['foots'] as $foot)
                        <td>{{$foot}}</td>
                    @endforeach
                </tr>
            </tbody>
        </table>
    @endforeach
@include('print.print-layout.footer')