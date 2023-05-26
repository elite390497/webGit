<!DOCTYPE html>
<html>
<head>
	<title>{{env('APP_NAME')}}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
    	*{font-family:'Helvetica';}
	    body{width:auto; max-width:800px;margin:0 auto;font-size:12px;}
    </style>
</head>
<body>
    <div style="margin-top: 10px;">
        <div style="padding:10px;background: #ffffff;">
        	@foreach($items as $item)
	        	<div style="height: {{request('height')}}mm; float: left; margin: 0px 10px 20px; border: 0px solid black; padding: 10px 5px;">
					<center>{!! DNS1D::getBarcodeHTML($item, "C39"); !!}</center>
					<center>{{$item}}</center>
	        	</div>

	        	@if($loop->iteration % request('per_page_limit') === 0)
					<div style="page-break-after: always;"></div>
				@endif
	        @endforeach
        </div>
    </div>
</body>
</html>
