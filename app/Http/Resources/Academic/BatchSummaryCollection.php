<?php

namespace App\Http\Resources\Academic;

use Illuminate\Http\Resources\Json\ResourceCollection;

class BatchSummaryCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return $this->collection;
    }
}