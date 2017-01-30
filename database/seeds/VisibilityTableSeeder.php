<?php

use Illuminate\Database\Seeder;

class VisibilityTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('visibilities')->insert([
        	[
        	'name' => 'suomen118',
        	'url' => 'www.suomen118.fi'
        	],
        	[
        	'name' => 'suomenyritysrekisteri',
        	'url' => 'http://www.suomenyritysrekisteri.fi'
        	],
        	[
        	'name' => 'kuntahakemisto',
        	'url' => 'http://www.kuntahakemisto.fi'
        	],
        	[
        	'name' => 'yritystele',
        	'url' => 'http://www.yritystele.fi'
        	],
        	[
        	'name' => 'yritystietohaku',
        	'url' => 'http://www.yritystietohaku.fi'
        	],
        	[
        	'name' => 'numerotele',
        	'url' => 'http://www.numerotele.fi'
        	],
        	[
        	'name' => '02100',
        	'url' => 'www.02100.fi'
        	],
        	[
        	'name' => '118finder',
        	'url' => 'www.118finder.fi'
        	],
        	[
        	'name' => 'suomenyrityshaku',
        	'url' => 'http://www.suomenyrityshaku.fi'
        	],
        	[
        	'name' => 'hakemistokeskus',
        	'url' => 'www.hakemistokeskus.fi'
        	],
        	[
        	'name' => 'ylj',
        	'url' => 'www.ylj.fi'
        	]
        	]);
    }
}
