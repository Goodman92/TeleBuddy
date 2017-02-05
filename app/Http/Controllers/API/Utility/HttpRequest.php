<?php
	namespace App\Http\Controllers\API\Utility;

	//fully functional, single or multi curl implementation
	class Httpreq {
			
			private $handler;
			private $handles;
			public $info;
			
			public function __construct($url) {
				$this->handles = [];
				if(is_array($url)) {
					$this->initializeMultiHandle($url);
				} else {
					$this->initializeSingleHandle($url);
				}
			}
			
			private function initializeSingleHandle($url) {
				$this->handler = curl_init();
				$this->optionsInitialize($url);
			}
			
			private function initializeMultiHandle($urls) {
				$this->handler = curl_multi_init();
				foreach($urls as $url) {
					$handle = $this->optionsInitialize($url);
					curl_multi_add_handle($this->handler, $handle);
					array_push($this->handles, $handle);
				}
			}
			
			// konffit vois tulla parametrina
			private function optionsInitialize($url) {
				$handle = (get_resource_type($this->handler) === "curl_multi") ? curl_init() : $this->handler; 
				curl_setopt_array($handle, array(
					CURLOPT_URL => $url,
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_IPRESOLVE => CURL_IPRESOLVE_V4,
				));
				return $handle;
			}
			
			private function singleExecute() {
				$response = curl_exec($this->handler);
				return $response;
			}
			
			private function multiExecute() {
				$active = null;

				do {
				    curl_multi_exec($this->handler, $active);
				    curl_multi_select($this->handler);
				} while ($active > 0);

				$this->info = $this->getInfo();
				$response = [];
				
				foreach($this->handles as $key => $value) {
					array_push($response, curl_multi_getcontent($this->handles[$key]));
				}
				$this->releaseHandles();
				curl_multi_close($this->handler);

				return $response;
			}
			
			private function releaseHandles() {
				foreach($this->handles as $handle) {
					curl_multi_remove_handle($this->handler, $handle);
					curl_close($handle);
				}
			}
			
			public function getInfo() {
				$resourceName = get_resource_type($this->handler);
					switch($resourceName) {
					case "curl_multi":
						$res = array();
						foreach($this->handles as $handle) {
							array_push($res, curl_getinfo($handle));
						}
						return $res;
					break;
					case "curl":
						return curl_getinfo($this->handler);
					break;
				}
			}

			public function closeSession() {
				curl_close($this->handler);
			}
			
			public function getError() {
				return curl_error($this->handler);
			}
			
			public function execute() {
				$resourceName = get_resource_type($this->handler);
				switch($resourceName) {
					case "curl_multi":
						return $this->multiExecute();
					break;
					case "curl":
						return $this->singleExecute();
					break;
				}
			}
	}