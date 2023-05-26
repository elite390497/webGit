<?php

namespace App\Models\Student;

use Illuminate\Database\Eloquent\Model;

class BilldeskPayment extends Model
{
    protected $guarded = [];
    protected $casts = ['options' => 'array', 'date' => 'date'];
    protected $primaryKey = 'id';
    protected $table = 'billdesk_payments';

    public function getOption(string $option)
    {
        return array_get($this->options, $option);
    }
}
