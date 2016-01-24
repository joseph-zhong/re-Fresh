$(document).ready(function() {
	var pic3 = new Image();
	pic3.src="images/loading.gif";
});

function previewFile(isFirst) {
	if(isFirst) {
		document.getElementById("emptyicon").src = "images/loading.gif";
		document.getElementById("emptyicon").style.marginBottom = "100px";
		document.getElementById("emptytext").style.display = "none";
	}
	var file = document.querySelector('input[type=file]').files[0]; //sames as here
	var reader = new FileReader();
	
	reader.onloadend = function() {
        var image = document.createElement('img');
        image.src = reader.result;
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width/2, image.height/2);
        var shrinked = canvas.toDataURL('image/jpeg');
    };

	reader.onloadend = function () {
		Algorithmia.client("simYHKGhsykwVz+OFHIHf6H5zZl1")
		.algo("algo://ocr/RecognizeCharacters/0.2.2")
		.pipe(reader.result)
		.then(function(output) {
			//console.log(output.result.match(/\S+/g));
			$.post("https://re-fresh1.herokuapp.com/api/add/multiple", {
				data: output.result.match(/\S+/g)
			})
			.done(function(data) {
				window.location.href = "index.html";
			});
		});
	}

	if (file) {
		reader.readAsDataURL(file);
	} else {
		preview.src = "";
	}
}