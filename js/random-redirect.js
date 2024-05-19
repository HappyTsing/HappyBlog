// 点击首页的 Get Start 时，随机跳转
document.getElementById("randomLink").addEventListener("click", function(event) {
	event.preventDefault();
	var urls = [
	  'language',
	  'security',
	  'tools',
	  'web',
	  'tools'
	];
	var randomIndex = Math.floor(Math.random() * urls.length);
	var randomURL = urls[randomIndex];
	window.location.href = randomURL;
  });