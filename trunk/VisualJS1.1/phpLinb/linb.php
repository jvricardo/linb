<?php
    if(function_exists('date_default_timezone_set')){
        date_default_timezone_set('UTC');
    }

    /*
    * phpLinb
    */
    /**
    * __autoload class
    * @author rambolee <linb.net@gmail.com>
    **/
    function __autoload($class){
       try{
       	   $path = LINB::$DIR_LINB.LINB::$DIR_CLASS.str_replace('_', DIRECTORY_SEPARATOR, str_replace('.', DIRECTORY_SEPARATOR, $class)).'.php';
           if(!file_exists($path)){
           	   $path = LINB::$DIR_APP.LINB::$DIR_CLASS.str_replace('_', DIRECTORY_SEPARATOR, str_replace('.', DIRECTORY_SEPARATOR, $class)).'.php';
           }
           if(file_exists($path)){
               include_once($path);
           } else {
           	   throw new LINB_E("Error: class '$class' not exists!");
           }
       }catch (LINB_E $e){
           LINB::echoException($e);
       }
    }

    /**
    * Exception class for LINB
    * @author rambolee <linb.net@gmail.com>
    **/
    class LINB_E extends Exception
    {
        /**
         * constructor
         *
         * @param string $message
         * @param int $code
         *
         * @return LINB_E
         */
        function __construct ($message = '', $code = 0, $file = '', $line = -1) {
            parent::__construct($message, $code);
        }
		function _handle_exception(Exception $e) {
	        LINB::echoException($e);
	    }
		function _handle_error($errno, $errstr, $errfile, $errline) {
	        LINB::echoException($errstr, $errfile, $errline);
	    }
    };
	$err = new LINB_E();
	set_error_handler (array ($err, '_handle_error'));
    set_exception_handler(array($err, "_handle_exception"));
    unset($err);

    /**
    * LINB base class
    *
    * @author rambolee <linb.net@gmail.com>
   **/
   class LINB
   {
      /**
       *  logic unit abstrct class name
       */
      const UNIT = "Unit";

      /**
       * request data symbol: id
       */
      const SYM_ID = "id";
      /**
       * request data symbol: hash
       */
      const SYM_HASH = "hash";
      /**
       * request data symbol: data
       * for exception in __autoload
       */
      const SYM_DATA = "data";
      /**
       * request data symbol: error
       */
      const SYM_ERR = "error";
        /**
         * request data sub symbol: key
         *
         */
      const SYM_KEY = "key";
        /**
         * request data sub symbol: parameter
         *
         */
      const SYM_PARA = "para";

      /**
       * Request data backup
       *
       */
      public static $data;

      /**
       * for switch debug
       *
       */
      public static $debug;

      /**
       * The path of LINB.PHP
       */
      public static $DIR_LINB;

      /**
       * path for main app
       */
      public static $DIR_APP;

      /**
       * The root path of class files
       */
      public static $DIR_CLASS;

      /**
       * JSON object
       */
      public static $json;

      /**
       * object hash table for straight call
       */
      private static $H = array();

      /**
       * type strict
       *
       * @param string $type
       * @param mix $v
       * @param mix $default
       * @return mix
       */
      public static function toStrict($type, $v, $default){
		$map = array(
		    'string' => array('is_string',''),
		    'integer' => array('is_integer',0),
		    'double' => array('is_float',0.0),
		    'boolean' => array('is_bool',false),
		    'array' => array('is_array',array()),
		    'object' => array('is_object', new stdClass())
		);
		if(!in_array($type, array_keys($map))){
			throw new Exception('$type is not a valid type.');
		}
		$r=$map[$type][1];
		if(isset($v) || $map[$type][0]($v)){
			$r=$v;
		}else{
			if(isset($default) || $map[$type][0]($default)){
				$r = $default;
			}
		}
		return $r;
     }
     public static function toType($v, $type){
     	switch ($type){
     		case 'string' :
     			return (string)$v;
		    case 'integer' :
     			return (integer)$v;
		    case 'double' :
     			return (double)$v;
		    case 'boolean' :
     			return (boolean)$v;
		    case 'array' :
     			return (array)$v;
		    case 'object' :
     			return (object)$v;
		    default:
		    	throw new LINB_E('No such type: $type!');
     	}
     }
     /**
      * check arguemnts
      *
      * @param  arary $h
      * @param  array $a
      *  array(
      *    'string' => array(
      *     'id' => NULL,
      *     'action' => ''
      *     )
      * )
      */
     public static function checkArgs(&$h, $a){
     	if(is_object($h)){
     		$o = (array)$h;
     	}else{
     		$o = & $h;
     	}

		foreach ($a as $k=>$v){
			foreach ($v as $k2=>$v2){
				if(is_null($v2)){
					if(isset($o[$k2]) && gettype($o[$k2]) != $k){
						$o[$k2] = self::toType($o[$k2], $k);
					}
				}else{
					$o[$k2] = self::toStrict($k, isset($o[$k2])?$o[$k2]:NULL, $v2 );
				}
			}
		}
		if(is_object($h)){
			foreach ($o as $k=>$v){
				$h->$k = $v;
			}
		}
    }

    /**
     * Parse a template to string
     *
     * @param   string $template
     *   tag: {tag}
     *   or
     *   tag pairs:  {tag} string... {/tag}
     * @param   array  $data
     * array(
     *   'a' => 'a',
     *    array(
     *        array('i'=>'i','j1'=>'j1'),
     *        array('i'=>'i','j2'=>'j2'),
     *        array('i'=>'i','j3'=>'j3')
     *    )
     * )
     * @return  string
     */
    public static function parseTemplate($template, $data, $tag_l = '{', $tag_r = '}'){
        $str = $template;
        foreach ($data as $key => $val){
            if ( ! is_array($val)){
                $str = str_replace($tag_l.$key.$tag_r, $val, $str);
            }else{
                if (preg_match("|".$tag_l.$key.$tag_r."(.+)".$tag_l.'/'.$key.$tag_r."|s", $template, $match)) {
                    $str2 = '';
                    foreach ($val as $item){
                        $str2 .= LINB::parseTemplate($match['1'], $item);
                    }
                    $str = str_replace($match['0'], $str2, $str);
                }
            }
        }
        return $str;
    }

      /**
       * Staight cll
       *
       * @param string $key
       * @return object
       */
      public static function SC($key){
          if (!isset(self::$H[$key])) {
            try{
                self::$H[$key] = new $key();
            }catch(LINB_E $e){
                throw $e;
            }
         }
         return self::$H[$key];
      }
      /**
       * stimulate
       *
       * @param object $hash
       * @return object
       */
      public static function stimulate(&$hash){
         $key = self::SYM_KEY;
         $para = self::SYM_PARA;
         if(!is_object($hash)){ throw new LINB_E('Input data format error!');}
         if(!isset($hash->$key)){ throw new LINB_E('Input data must include key!');}

         $key = $hash->$key;
         $o = self::SC($key);

         if(is_subclass_of($o,self::UNIT)){
            return $o->stimulate($hash->$para);
         }else{ throw new LINB_E('$key is not a substantial class of Unit!'); }
      }

      /**
       * handle http post or get request
       * html get/post : key=xxx&para={...}
       * cgi get/pos :{key:xxx,para:{...}}
       * there must be a 'key' included.
       *
       */
      public static function handler(){
         try{
             $httpdata=NULL;
             $data = self::SYM_DATA;
             $hash = self::SYM_HASH ;
             $id = self::SYM_ID;
             $err = self::SYM_ERR;
             $key = self::SYM_KEY;
             $para = self::SYM_PARA;
             $method='POST';

             //get html 'post' first
             if(count($_POST)>0){
                $httpdata = new stdClass;
                foreach ($_POST as $k=>$v)$httpdata->$k = get_magic_quotes_gpc()?stripslashes($v):$v;
                if(isset($httpdata->$para))$httpdata->$para = LINB::$json->decode($httpdata->$para);
            //get html 'get' second
             }else if(strstr($_SERVER['QUERY_STRING'],'=')!==false){
                $method='GET';
    			header ("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    			header ("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    			header ("Cache-Control: no-cache, must-revalidate");
    			header ("Pragma: no-cache");
                $httpdata = new stdClass;
                foreach ($_GET as $k=>$v)$httpdata->$k = get_magic_quotes_gpc()?stripslashes($v):$v;
                if(isset($httpdata->$para))$httpdata->$para = LINB::$json->decode($httpdata->$para);
             }else{
                 //get ajax/cgi 'post' next
                 $request = file_get_contents('php://input');
                 //get ajax/cgi 'get' last
                 if($request === ""){
        			$method='GET';
                    $request = $_SERVER['QUERY_STRING'];

                     //for html encodeURIComponent
                     $request = urldecode($request);
                 }

                 if($request){
                     $httpdata = LINB::$json->decode($request);
                     if(is_null($httpdata)){
                        throw new LINB_E("Request format error! data:'$request'");
                     }
                 }
             }
             //if request data
             if($httpdata){
                 // for __autoload
                 LINB::$data = $httpdata;
                 $d = self::stimulate($httpdata);
                 if(isset($d))
                    echo LINB::$json->encode($d);
             }

         }catch(LINB_E $e){
             LINB::echoException($e);
         }
      }
      public static function echoException($e, $file='', $line=-1){
      	    if($e instanceof Exception){
      	    	$file = $e->getFile();
      	    	$line = $e->getLine();
      	    	$e = $e->getMessage();
      	    }
            if(LINB::$debug){
                $e = $e." at ".$file."(".$line.")";
            }

           $httpdata = array();
      	   if(isset(LINB::$data)){
       	       $httpdata = LINB::$data;
      	   }
           $id = LINB::SYM_ID ;
           $err = LINB::SYM_ERR;
           $httpdata = array( $id => isset($httpdata->$id)?$httpdata->$id:'-1', $err => $e);
           echo LINB::$json->encode($httpdata);
      }
   }

   /**
    * logic unit abstrct class
    *
    */
   abstract class Unit
   {
        /**
         * for logic unit interface
         *
         * @param class $hash
         */
        abstract public function stimulate(&$hash);
   }
   /**
    * shortcut for LINB::SC
    *
   * @param string $key
   * @return object
    */
   function SC($key){
     return LINB::SC($key);
   }

   ///////////////
   /////running functions
   ///////////////

   // ini the object of LINB
   LINB::$debug = true;
   LINB::$DIR_LINB = dirname(__FILE__).DIRECTORY_SEPARATOR;
   LINB::$DIR_APP = realpath('.').DIRECTORY_SEPARATOR;
   LINB::$DIR_CLASS  = 'phpClass'.DIRECTORY_SEPARATOR;
   LINB::$json = new JSON;

   // handle http request
   LINB::handler();

?>