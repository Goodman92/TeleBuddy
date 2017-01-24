<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

	protected $table = 'companies';
	public $incrementing = false;
	protected $primaryKey = 'businessId';
	public $timestamps = false;
    protected $fillable = ['name', 'businessId', 'companyForm', 'registrationDate', 'endDate', 'street', 'postCode', 'city', 'businessLine', 'contactDetails', 'liquidations'];

	public function contactDetails()
    {
        return $this->hasOne('App\Models\ContactDetails', 'id', 'contactDetails');
    }

    public function BusinessLines()
    {
        return $this->hasOne('App\Models\BusinessLines', 'id', 'businessLine');
    }

}
