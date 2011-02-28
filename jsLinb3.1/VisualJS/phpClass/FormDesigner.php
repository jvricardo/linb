<?php
class FormDesigner extends Unit
{
    const PATH_FORMS="FormDB";
    const FILE_FORMCODE="form.code.js";
    const FILETAG_JS=".js";

    public function stimulate(&$hash){
        LINB::checkArgs($hash, array(
            'string' => array(
                'action' => NULL,
            )
        ));
        $r = NULL;

        //only input relative path, and not ./ or ../ allowed
        switch($hash->action){
        case 'fetchForms':
            $path=self::PATH_FORMS;
            $r=$this->getFiles($path);
        break;
        case 'fetchRecords':
            LINB::checkArgs($hash, array(
                'string' => array(
                    'formId' => NULL,
                )
            ));
            $path=self::PATH_FORMS.DIRECTORY_SEPARATOR.$hash->formId;
            $r=$this->getFiles($path, 1);
        break;
        case 'openForm':
            LINB::checkArgs($hash, array(
                'string' => array(
                    'formId' => NULL
                ),
                'object' => array(
                    'recordId' => ''
                )
            ));
            $r = new stdClass;
            $path1=self::PATH_FORMS.DIRECTORY_SEPARATOR.$hash->formId.DIRECTORY_SEPARATOR.self::FILE_FORMCODE;
            $io = LINB::SC('IO');
            if(file_exists($path1)){
                $r->formCode = $io->getString($path1);
            } else {
               throw new LINB_E("File $path1 could not be found."); 
            }
            
            if($hash->recordId != ""){
                $path2=self::PATH_FORMS.DIRECTORY_SEPARATOR.$hash->formId.DIRECTORY_SEPARATOR.$hash->recordId.self::FILETAG_JS;
               if(file_exists($path2)){
                    $r->formFields = $io->getString($path2);
               }
            }
            break;
        case 'saveForm':
            LINB::checkArgs($hash, array(
                'string' => array(
                    'formId' => NULL,
                    'formCode' => '',
                    'recordId' => '',
                    'formFields' => ''
                )
            ));

            $io = LINB::SC('IO');
            $r = new stdClass;
            $path=self::PATH_FORMS.DIRECTORY_SEPARATOR.$hash->formId;
            if(!file_exists($path)){
                $io->dirMake($path);
            }
            // save form code?
            if($hash->formCode != ""){
                $path1=$path.DIRECTORY_SEPARATOR.self::FILE_FORMCODE;
                if(file_exists($path1)){
                    $io->delete($path1);
                }
                $io->setString($path1, $hash->formCode);
            }
            
            // save form fields?
            if($hash->recordId != "" && $hash->formFields != ""){
                $path2=$path.DIRECTORY_SEPARATOR.$hash->recordId.self::FILETAG_JS;
               if(file_exists($path2)){
                    $io->delete($path2);
               }
               $io->setString($path2, $hash->formFields);
            }
            $r='ok';
            break;
        case 'delForm':
            LINB::checkArgs($hash, array(
                'string' => array(
                    'formId' => NULL,
                    'recordId' => ''
                )
            ));

            $io = LINB::SC('IO');
            $path=self::PATH_FORMS.DIRECTORY_SEPARATOR.$hash->formId;
            if($hash->recordId === ""){
                if(file_exists($path)){
                    $io->delete($path);
                }
            }else{
                $path2=$path.DIRECTORY_SEPARATOR.$hash->recordId.self::FILETAG_JS;
                if(file_exists($path2)){
                    $io->delete($path2);
                }
            }
            $r='ok';
            break;
        }
        return $r;
    }
    
    private function getFiles($path, $type=0, $deep=0){
        $io = LINB::SC('IO');
        
        $path = str_replace("/", "\\", $path);
        //$r = $io->dirList($path);
        $r = $io->search("[a-zA-Z0-9].*", $path, $type, $deep);
        $root=str_replace("\\", "/", realpath('.')).'/';
        //ensure to return relative url format: '/'
        foreach($r as &$v){
            $v['location'] = str_replace("\\", "/", $v['location']);
            $v['location'] = str_replace($root, "", $v['location']);
        }
        
        unset($io);
        return $r;
    }
}

?>
