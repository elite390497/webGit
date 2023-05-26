@include('print.print-layout.header')
    <h2 style="text-align: center;">{{config('config.default_academic_session.name')}}</h2>
    <h2>{{trans('finance.fee_allocation')}}
        @if($fee_allocation->course_id)
            {{$fee_allocation->Course->name}}
        @else
            {{$fee_allocation->Batch->Course->name.' '.$fee_allocation->Batch->name}}
        @endif
    </h2>
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

                                @if(gbv($detail, 'is_optional'))
                                    {{trans('finance.optional')}}
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