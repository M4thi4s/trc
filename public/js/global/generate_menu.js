window.onload=function(){
  checkAuthentification(
    function(res){
      var li=document.createElement("li");
      li.className="menu_item_img";
      li.id="menu-6-item";
      li.innerHTML=  "<a class='right_item_menu' href='/account/' title='personal page'>"
                    +"<img src='/img/home.svg' height='24' width='24'/>"
                    +"</a>"

      document.getElementById("top_menu").appendChild(li);
    },
    function(err){
      var li=document.createElement("li");
      li.className="menu_item_img";
      li.id="menu-6-item";
      li.innerHTML=  "<a class='right_item_menu' href='/login/' title='personal page'>"
                    +"<img src='/img/login.svg' height='24' width='24'/>"
                    +"</a>"

      document.getElementById("top_menu").appendChild(li);

    }
  )

}
