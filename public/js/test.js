 $(document).ready(function(){
  $(".whatsapp-share").prop("href","whatsapp://send?text="+encodeURIComponent(document.location.href));
      $.get("/blogsAll/12", function(data, status){
        $.each(data, function(index, element) {
           var img_src=element.mainImage;
                  var alt_img_src="https://placehold.it/350x150";
              var on_error_string="onerror='this.onerror=null;this.src=\"https://placehold.it/90x130\";'"
               $("#suggestedPosts").append("<a href='/post/"+element._id+"'>"+
                "   <div class='col-sm-3 col-md-2 below'>"+
                          "<div class='thumbnail posttile below'>"+
                        "<img  class='img-responsive thumbnail-img' src='"+img_src+"'"+on_error_string+"  alt=''>"+
                          "<div class='caption' style='word-wrap:break-word;'>"+
                          "<p class='date-style'>"+moment(element.date).format('MMMM Do YYYY')+"</p>"+
                          "<h4>"+element.title+
                          "</h4>"+
                          /*"<p>"+getSubstring(element.body,50)+"</p>"+*/
                          "</div>"+
                          "</div>"+
                          "</div></a>");
        });
      });
      $('#searchBtn').click(function(){
      var searchText=$('#searchBar').val();
      window.location.replace('blogs.html?search='+"b");
    });
   $(window).bind('scroll', function () {
    if ($(window).scrollTop() > 50) {
        $('#main-nav').addClass('navbar-fixed-top');
        $('#main-nav').removeClass('tranparent-background');
    } else {
        $('#main-nav').removeClass('navbar-fixed-top');
         $('#main-nav').addClass('tranparent-background');
    }
  });
   
  });