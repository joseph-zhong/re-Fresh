var groceries=["beef","milk","eggs","chicken","bacon","salmon","apples","oranges","potatoes","broccoli","bread"];

function match(text){
	var len=text.length;
	var minLength=100;
	var result="";
	for(x=0;x<groceries.length;x++){
    	var grocery=groceries[x];
		var pointer=0;
		for(i=0;i<grocery.length;i++){
			if(text.charAt(pointer)==grocery.charAt(i)){
				pointer+=1
			}
		}
		if(pointer==len&&grocery.length-len<minLength){
			minLength=grocery.length-len;
			result=grocery;
		}
	}
	return result;
}