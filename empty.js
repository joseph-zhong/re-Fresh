$(document).ready(function() {
	var pic3 = new Image();
	pic3.src="images/loading.gif";
});

function previewFile(){
	document.getElementById("emptyicon").src = "images/loading.gif";
	document.getElementById("emptyicon").style.marginBottom = "100px";
	document.getElementById("emptytext").style.display = "none";
	var file = document.querySelector('input[type=file]').files[0]; //sames as here
	var reader = new FileReader();

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