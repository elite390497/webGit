<?php

namespace App\Traits;

use App\Helper\MathExpression;

trait Evaluator
{
    public function evaluate($expression)
    {
	    $evaluator = new MathExpression;
	    try {
	        return $evaluator->execute($expression);
	    } 
	    catch (\Exception $e) {
	        return 'invalid';
	    }
	}
}