window.onload=function(){
  checkAuthentification(
    function(res){
      var img=document.createElement("img");
      img.src="/img/home.svg";
      img.height="40";
      img.width="40";
      img.className="menu_item_img";

      var container=document.createElement("a");
      container.href="/account/";

      container.appendChild(img);
      document.getElementById("topMenuTableRight").appendChild(container);

      
      var img2=document.createElement("img");
      img2.src="/img/disconnect.svg";
      img2.height="40";
      img2.width="40";
      img2.className="menu_item_img";
      img2.onclick = function(){
        localStorage.clear(); document.location.reload();
      };

      document.getElementById("topMenuTableRight").appendChild(img2);

    },
    function(err){
      var img=document.createElement("img");
      img.src="/img/login.svg";
      img.height="40";
      img.width="40";
      img.className="menu_item_img";

      var container=document.createElement("a");
      container.href="/login/";

      container.appendChild(img);
      document.getElementById("topMenuTableRight").appendChild(container);

    }
  );
}
