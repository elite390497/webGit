@extends('errors.layout')

    @section('content')
        <div class="title m-b-md">
            {{ $message }}
            You can note down Transaction Id <strong>{{ $reference_number }}</strong> & contact us in case your account is debited.
        </div>

        @if(isset($payment))
            <a href="{{url('/app/student/' . $payment->student_uuid . '/fee/' . $payment->student_record_id)}}">Go back!</a>
        @else
            <a href="{{url('/app/dashboard')}}">Go back!</a>
        @endif
    @endsection