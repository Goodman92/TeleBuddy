<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactDetails extends Model
{
    protected $table = 'contact-details';
    public $timestamps = false;

    public function company() {
		return $this->belongsTo('App\Models\Company', 'contactDetails', 'id');
	}
}
