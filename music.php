<?php
//打开 images 目录

function getfile(){
	$dir = opendir("music");
	$arr = array();
	$i = 0;
	//列出 images 目录中的文件
	while (($file = readdir($dir)) !== false)
	{
		$arr[$i++] = $file;
	   //echo "filename: " . $file . "<br />";
	}
	
	closedir($dir);
	echo json_encode($arr);
}
getfile();

?> 