"""
This file is used to generate the html of the comparison of the miniature sizes.
It was way too repetitive for me, so I kindly asked my friend the snek to do it for me.
"""

OUTPUT_FILE = "size_comparison_auto.html"
content = {
    "sections": [{
        "name": "Img 1: ", 
        "description": '<small class="col-xs-12">source of the image: <a href="http://www.technocrazed.com/wp-content/uploads/2015/12/beautiful-wallpaper-download-14.jpg" target="blank">http://www.technocrazed.com/wp-content/uploads/2015/12/beautiful-wallpaper-download-14.jpg</a></small>',
        "images": [
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_10x6.jpg", "title": "10x6"},
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_15x9.jpg", "title": "15x9"},
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_20x12.jpg", "title": "20x12"},
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_25x15.jpg", "title": "25x15"},
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_30x17.jpg", "title": "30x17"},
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_35x20.jpg", "title": "35x20"},
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_40x23.jpg", "title": "40x23"},
            {"full": "img/im3/im3.jpg", "mini": "img/im3/im3_45x26.jpg", "title": "45x26"},
        ]}, 
        {
        "name": "Img 2: jpg", 
        "description": '<small class="col-xs-12">source of the image: <a href="https://i.redd.it/1ufjma0bet101.png" target="blank">https://i.redd.it/1ufjma0bet101.png</a></small>',
        "images": [
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_10x11.png", "title": "10x11"},
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_15x16.png", "title": "15x16"},
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_20x21.png", "title": "20x21"},
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_25x26.png", "title": "25x26"},
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_30x31.png", "title": "30x31"},
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_35x37.png", "title": "35x37"},
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_40x42.png", "title": "40x42"},
            {"full": "img/im4/im4.png", "mini": "img/im4/im4_45x47.png", "title": "45x47"},
        ]},
        {
        "name": "Img 3", 
        "description": '<small class="col-xs-12">source of the image: <a href="https://static.pexels.com/photos/326055/pexels-photo-326055.jpeg" target="blank">https://static.pexels.com/photos/326055/pexels-photo-326055.jpeg</a></small>',
        "images": [
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_10x6.jpg", "title": "10x6"},
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_15x9.jpg", "title": "15x9"},
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_20x12.jpg", "title": "20x12"},
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_25x15.jpg", "title": "25x15"},
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_30x17.jpg", "title": "30x17"},
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_35x20.jpg", "title": "35x20"},
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_40x23.jpg", "title": "40x23"},
            {"full": "img/im5/im5.jpg", "mini": "img/im5/im5_45x26.jpg", "title": "45x26"},
        ]},
        {
        "name": "Img 4", 
        "description": '<small class="col-xs-12">source of the image: <a href="https://static.pexels.com/photos/639086/pexels-photo-639086.jpeg" target="blank">https://static.pexels.com/photos/639086/pexels-photo-639086.jpeg</a></small>',
        "images": [
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_10x6.jpg", "title": "10x6"},
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_15x9.jpg", "title": "15x9"},
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_20x12.jpg", "title": "20x12"},
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_25x15.jpg", "title": "25x15"},
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_30x17.jpg", "title": "30x17"},
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_35x20.jpg", "title": "35x20"},
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_40x23.jpg", "title": "40x23"},
            {"full": "img/im1/im1.jpg", "mini": "img/im1/im1_45x26.jpg", "title": "45x26"},
        ]},
        {
        "name": "Img 5", 
        "description": '<small class="col-xs-12">source of the image: <a href="https://www.goodfreephotos.com/albums/canada/alberta/banff-national-park/very-majestic-and-beautiful-landscape-with-mountains-in-banff-national-park-alberta-canada.jpg" target="blank">https://www.goodfreephotos.com/albums/canada/alberta/banff-national-park/very-majestic-and-beautiful-landscape-with-mountains-in-banff-national-park-alberta-canada.jpg</a></small>',
        "images": [
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_10x7.jpg", "title": "10x7"},
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_15x11.jpg", "title": "15x11"},
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_20x14.jpg", "title": "20x14"},
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_25x17.jpg", "title": "25x17"},
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_30x21.jpg", "title": "30x21"},
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_35x24.jpg", "title": "35x24"},
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_40x27.jpg", "title": "40x27"},
            {"full": "img/im2/im2.jpg", "mini": "img/im2/im2_45x31.jpg", "title": "45x31"},
        ]}

    ]
}
generated_html = """
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
    
    <link rel="stylesheet" href="../dist/css/bluepil.min.css">
    <link rel="stylesheet" href="css/demo.css">
</head>
<body>
    <noscript>There is no point in watching the demo of a javascript library with disabled javascript. What are you doing?</noscript>
    <section class="container">
        <div class="row">
            <small><a href="index.html"> << Back to the demo</a></small>
            <h1>Miniature size comparison</h1>
            <p>This compares the rendering of the blured canvas for different sizes of the miniaturized image. The aim is to determine what is the minimum size that produces a neat result.</p>
        </div>
    </section>
    
"""

for section in content["sections"]:
    generated_html += """
    <section class="container">
        <div class="row">
            <h3 class="col-xs-12">""" + section["name"] + """</h3>
            """ + section["description"] + """
"""
    for image in section["images"]:
        generated_html += """
            <div class="col-lg-3 col-sm-4 col-xs-6 mini-sample-background progressive-bg-image v-center-content mouse-activated">
                <noscript><img class="full-absolute" src=\"""" + image["full"] + """\"></noscript>
                <img class="hidden thumbnail" src=\"""" + image["mini"] + """\">
                <img class="full-bg-image hidden" data-src=\"""" + image["full"] + """\">
                <canvas class="full-absolute progressive-img-load-canvas"></canvas>
                <div class="v-center relative">
                    <h3 class="white">""" + image["title"] + """</h3>
                </div>
            </div>
"""

    generated_html += """
        </div>
    </section>
"""


generated_html += """

    <script type="text/javascript" src="../dist/js/bluepil.min.js"></script>

    <script type="text/javascript">
        ;(function() {
            
            mouseActivatedEls = document.getElementsByClassName('mouse-activated');

            for (var i = 0; i < mouseActivatedEls.length; i++) {
                mouseActivatedEls[i].onmouseenter = function(evt) {
                    var canvas = evt.target.querySelector(".progressive-img-load-canvas");

                    if (canvas) {
                        canvas.style.opacity = 0;
                    }
                }
                mouseActivatedEls[i].onmouseleave = function(evt) {
                    var canvas = evt.target.querySelector(".progressive-img-load-canvas");
                    if (canvas) {
                        canvas.style.opacity = 1;
                    }
                }
            }
            
            PIL.fullImageLoaded = function(object) {
                if (object.root_el.classList.contains("mouse-activated")) {
                    object.canvas.style.opacity = 1;
                }
            }
            
            PIL.go();
        })();
    </script>
</body>
</html>

"""

f = open(OUTPUT_FILE, "w")
f.write(generated_html)
f.close()
print("DONE.")
