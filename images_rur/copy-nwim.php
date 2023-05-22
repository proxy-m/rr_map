<?php
if(copy('Logo.jpg','./Logo/Logo.png'))
{
	echo "<h3>Logo.png is copied</h3>";
}
else 
{
	 echo "<h3>Logo.png not copied !!!</h3>";
}
if(copy('970-1.jpg','./Pic1/Pic1_Belarusian_State_University_of_Informatics_&_Radioelectronics.jpg'))
{
	echo "<h3>970-1.jpg is copied</h3>";
}
else 
{
	 echo "<h3>Picture_1.jpg not copied !!!</h3>";
}
if(copy('970-2.jpg','./Pic2/Pic2_Belarusian_State_University_of_Informatics_&_Radioelectronics.jpg'))
{
	echo "<h3>970-2.jpg is copied</h3>";
}
else 
{
	 echo "<h3>Picture_2.jpg not copied !!!</h3>";
}
?>