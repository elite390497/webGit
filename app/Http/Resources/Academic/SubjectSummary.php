<?php

namespace App\Http\Resources\Academic;

use App\Helper\Cal;
use App\Http\Resources\Academic\Batch as BatchResource;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectSummary extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'name'        => $this->name,
            'code'        => $this->code,
            'shortcode'   => $this->shortcode,
            'position'    => $this->position,
            'has_no_exam' => $this->getOption('has_no_exam') ? true : false,
            'batch'       => new BatchSummaryResource($this->whenLoaded('batch'))
        ];
    }
}