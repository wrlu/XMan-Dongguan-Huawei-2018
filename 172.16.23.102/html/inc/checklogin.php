<?php
// !! Fixed by wrlu
$user=$_COOKIE['user'];
if ($user==""){
header("Location: ?r=login");
exit;	
}
//===========origin file stop here===========
# [+] Add password hash check here for this file will be included by every administrator pages
ob_start();
$con = mysql_connect("localhost","root","root");
if (!$con) {
	die('Could not connect: ' . mysql_error());
}
mysql_select_db("xh", $con);
$query = "SELECT * FROM manage WHERE user='$user'";
$result = mysql_query($query) or die('SQL语句有误：'.mysql_error());
$users = mysql_fetch_array($result);
if (!mysql_num_rows($result)) {
header("Location: ?r=login");
exit;
}else{
$passwords=$users['password'];
$password=$_COOKIE['password'];
if($password<>$passwords){
header("Location: ?r=login");
exit;	
	}
}
ob_end_flush();
?>