


// a set with all document ID's that are linked to
var docIdSet = {}; // would use Set object, but cross-browser issues
    
    $.ajax({
        url: json_file, // @@@@
        async: false,
        dataType: "json",
        success: function(result){
            // display name for the course
            $("#index").append("<h4>"+result.name+"</h4>");
            var index = "<ul>";

            // read the lectures and display the name for each
            $.each(result.children, function(i_lecture, lecture){
                var lecture_content = "<h5>" + lecture.title + "</h5>";
                var chapter_content = "<ul>";

                if(lecture.children.length > 0){
                    $.each(lecture.children, function(i_chapter, chapter){
                        var chapter_bookid = chapter.bookid;
                        var chapter_docno = chapter.docno;
                        var chapter_id = chapter.id;
                        docIdSet[chapter_id] = 0;
                        var bookName = getBookName(chapter_bookid);
                        var reading_content = "<ul>";
                        if(chapter.children.length > 0){
                            $.each(chapter.children, function(i_reading, reading){
                                var reading_bookid = reading.bookid;
                                var reading_docno = reading.docno;
                                var reading_id = reading.id;
                                docIdSet[reading_id] = 0;

                                var leaf_content = "<ul>";
                                if(reading.children.length>0){
                                    $.each(reading.children, function(i_leaf, leaf){
                                        var leaf_bookid = leaf.bookid;
                                        var leaf_docno = leaf.docno;
                                        var leaf_id = leaf.id;
                                        docIdSet[leaf_id] = 0;
                                        leaf_content = leaf_content +
                                            '<li><a class="doclink ' + 'docid-' + leaf_id + '" href="#" onclick="javascript:parent.parent.frames[\'iframe-content\'].location = \''+reader_url+'?bookid='
                                            + leaf_bookid + '&docno=' + leaf_docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1' +'\';">' +
                                            leaf.name + '</a></li>';
                                    });
                                }
                                leaf_content = leaf_content + "</ul>";
                                reading_content = reading_content +
                                    '<li><a class="doclink ' + 'docid-' + reading_id + '" href="#" onclick="javascript:parent.parent.frames[\'iframe-content\'].location = \''+reader_url+'?bookid='
                                    + reading_bookid + '&docno=' + reading_docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1' +'\';">' +
                                    reading.name + '</a>'+ leaf_content + '</li>'
                            });
                        }
                        reading_content = reading_content + "</ul>";
                        // @@@@ this shows the book, under the assumption that each rading of a lecture can belong to a
                        // @@@@ different book. If the model represents only one book, it is not good to repeat the book name 
                        // @@@@ Another global variable from DB must tell the visulization if multiple books or not
                        chapter_content = chapter_content +
                            '<li><h6>BOOK:' + bookName + '<br/><a class="doclink ' + 'docid-' + chapter_id + '" href="#" onclick="javascript:parent.parent.frames[\'iframe-content\'].location = \''+reader_url+'?bookid='
                            + chapter_bookid + '&docno=' + chapter_docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1' +'\';">' +
                            chapter.name + '</a></h6>' + reading_content + '</li>';
                    });
                }

                chapter_content = chapter_content + "</ul>";
                lecture_content = lecture_content + chapter_content;
                index = index + "<li>" + lecture_content + "</li>";
            });

            index = index + "<ul>";
            $("#index").append(index);
        }
    });

var data = {
            'docids': Object.keys(docIdSet),
            'usr': usr,
            'grp': grp
        };

var diagram = [];

jQuery.ajax({
    url: './questions/api.php?task=status',
    type: 'POST',
    data: parent.JSON.stringify(data),
    contentType: 'application/json',
    dataType: "json",
    success:function (result) {
        // get user progress and paint partition table
        console.log("RESULT!!!!!!!!!!!!!!!!!!!!!!");
        console.log(result);
        var docAmount = result.length;
        var countDoc = 0;
        
        for (countDoc in result) {
            var uprogress = result[countDoc];
            console.log(uprogress);
            if (uprogress == 0) {
                var theColor = "#1a9850";
            }
            if (uprogress == 1) {
                var theColor = "#d73027";
            }
            if (uprogress == 2) {
                var theColor = colors[2];
            }
            if (uprogress == 3) {
                var theColor = "#fff";
            }
            if (uprogress == 4) {
                var theColor = "#555";
            }
            /*if (uprogress >= 0.4 && uprogress < 0.5) {
                var theColor = colors[4];
            }
            if (uprogress >= 0.5 && uprogress < 0.6) {
                var theColor = colors[5];
            }
            if (uprogress >= 0.6 && uprogress < 0.7) {
                var theColor = colors[6];
            }
            if (uprogress >= 0.7 && uprogress < 0.8) {
                var theColor = colors[7];
            }
            if (uprogress >= 0.8 && uprogress < 0.9) {
                var theColor = colors[8];
            }
            if (uprogress >= 0.9 && uprogress <= 1) {
                var theColor = colors[9];
            }*/
            diagram.push({
                docNum:countDoc,
                diagramColor:theColor
            })
        }

  

console.log("DIAGRAM!!!!");
console.log(diagram);
    
    var w = 100;
        //h = "100%";
    var h = window.innerHeight;


    var x = d3.scale.linear()
        .range([0, w]);
        //.range([0, h]);

    var y = d3.scale.linear()
        .range([0, h]);
        //range([0, w]);

    var color = d3.scale.category20c();

    var partition = d3.layout.partition()
        .sort(null)
        //.children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
        .children(function children(d) {
          return d.children;
        })
        .value(function(d) { return 1;});//return d.epage-d.spage+1; });


    var svg2 = d3.select("#partition-table").append("svg")
        .attr("width", w)
        .attr("height", h);
        //.style("background","#898989");
        //.style("margin-top","-15px");
        //.style("margin-bottom","-15px");

    var rect = svg2.selectAll("rect");

    d3.json(json_file,function(error, root) {
      //if (error) throw error;
      console.log(partition(root));
      
    rect = rect
      .data(partition(root))
    .enter().append("rect")
      /*.attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y); })
      .attr("width", function(d) { return x(d.dx); })
      .attr("height", function(d) { return y(d.dy); })
      */
      .attr("x", function(d) { return -1*x(d.y); })
      .attr("y", function(d) { return y(d.x); })
      .attr("width", function(d) { return x(d.dy); })
      .attr("height", function(d) { return y(d.dx); })
      .attr("fill", function (d) {
                
                var count = 0;
                for (count = 0; count < diagram.length; count++) {
                    if (diagram[count].docNum == d.id) {
                        console.log("funciona?");
                        return d3.rgb(diagram[count].diagramColor)
                    }
                }
            })
      .attr("class", function (d) { 
                classname = "partition_depth_" + d.depth;

                //if (d.depth > 0){
                    classname += " partition_docno_" + d.docno;
                //}

                return classname;
            })
      //.attr("display", function(d) { return d.depth<=3 ? null : "none"; })//d.depth && d.depth<=3 ? null : "none"; })
      .attr("transform", "translate("+w+",0)")//added by jbarriapineda
      //.attr("stroke","#ffffff")
      .attr("stroke","#000")
      .attr("opacity",0.5)
      .on("click", partitionTableClick)
      .on("dblclick", partitionTableDoubleClick)
      .on("mouseover",partitionTableMouseover)
      .on("mouseout",partitionTableMouseout);
      
      

        setHighlight(currentDocno);
    });



    function partitionTableClick(d){
        //Change section by clicking
        var actionsrc = "sunburst_model"
        var actiontype = "display_content"
        var dialogText = '<h3>' + d.name + '</h3>';
        var bmc = '#basic-modal-content-2';
        var link = "";
        var link2 = "";
        var link3 = "";

        var goToLink = null;
        
        dialogText = dialogText + '<ul>';
        
        currentDocno = d.docno;
        //alert(currentDocno);
        
        // select the branch clicked
        d3.selectAll("rect").style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        var sequenceArray = getAncestors(d);

        svg2.selectAll("rect")
            .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
            })
            .style("stroke","#000")
            .style("opacity", 1);


        if(d.children != null && d.children.length > 0){
            jQuery.each(d.children, function (i, val) {
                var docsrc = val.bookid;
                var docno = val.docno;
                var bookName = getBookName(docsrc);
                
                if (val.links.length > 0) {
                    //alert(docno);
                    jQuery.each(val.links, function (i_links, val_links) {
                        link = '<a onClick="javascript:parent.parent.frames[\'iframe-content\'].location = \'' + reader_url + '?bookid='
                            + docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1' +'\'; "href=\"#\">' + val.name + '</a>&nbsp;';

                        if(goToLink == null){
                            goToLink = reader_url + '?bookid=' + docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1';
                        }
                    });
                }

                //dialogText = dialogText + '<li>' + '<h6>BOOK: '+ bookName +'</h6>'+ link + '</li>'
                dialogText = dialogText + '<li>' + link + '</li>'

                //check chapter children
                if (val.children != null && val.children.length > 0) {
              //      dialogText = dialogText + '<ul>';
                    var dialogText2 = '<ul>'
                    jQuery.each(val.children, function (i2, val2) {
                        var docsrc = val2.bookid;
                        var docno = val2.docno;
                        if (val2.links.length > 0) {
                            jQuery.each(val.links, function (i_links2, val_links2) {
                                link2 = '<a onClick="javascript:parent.parent.frames[\'iframe-content\'].location = \'' + reader_url + '?bookid='
                                    + docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1' +'\'; "href=\"#\">' + val2.name + '</a>&nbsp;';

                                if(goToLink == null){
                                    goToLink = reader_url + '?bookid=' + docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1';
                                }
                            });
                        }

                        dialogText2 = dialogText2 + '<li>' + link2 + '</li>';

                        if(val2.children != null && val2.children.length > 0){
                    //        dialogText = dialogText + '<ol>';
                         var dialogText3 = "<ul>"
                            jQuery.each(val.children, function (i3, val3){
                                var docsrc = val3.bookid;
                                var docno = val3.docno;
                                if (val3.links.length > 0) {
                                    jQuery.each(val.links, function (i_links3, val_links3) {
                                        link3 = '<a onClick="javascript:parent.parent.frames[\'iframe-content\'].location = \'' + reader_url + '?bookid='
                                            + docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1' +'\'; "href=\"#\">' + val3.name + '</a>&nbsp;';

                                        if(goToLink == null){
                                            goToLink = reader_url + '?bookid='+ docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1';
                                        }
                                    });
                                }
                                dialogText3 = dialogText3 + '<li>' + link3 + '</li>';
                            })
                         dialogText2 = dialogText2 + dialogText3 + "</ul>";
                        }
                    });

                    dialogText = dialogText + dialogText2 + '</ul>';
                }
                dialogText = dialogText + '</li>';
            });
        }else{
            var docsrc = d.bookid;
            var docno = d.docno;

            if(d.links != null && d.links.length>0){
                jQuery.each(d.links, function(i_links, val_links){
                    link = '<a onClick="javascript:parent.parent.frames[\'iframe-content\'].location = \'' + reader_url + '?bookid='
                        + docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1' +'\'; "href=\"#\">' + d.name + '</a>&nbsp;';

                     if(goToLink == null){
                        goToLink = reader_url + '?bookid=' + docsrc + '&docno=' + docno + '&usr='+ usr + '&grp=' + grp + '&sid='+ sid + '&page=1';
                    }
                });
            }

            var bookName = getBookName(docsrc);
            
            //dialogText = dialogText + '<li>' + '<h6>BOOK: '+ bookName +'</h6>'+ link + '</li>'
        }

        dialogText = dialogText + '</ul>';

        // Experimental: Do not display the modal window but scroll to instead.
        // $(bmc).html(dialogText);
        // $(bmc).modal();

        parent.$("#readings").attr('src', goToLink);

        return false;
    }

    function partitionTableDoubleClick(d) {

      y.domain([d.x, d.x + d.dx]);
      x.domain([d.y, 1]).range([d.y ? 15 : 0, w]);

      rect.transition()
          .duration(750)
          .attr("x", function(d) { return x(d.y); })
          .attr("y", function(d) { return y(d.x); })
          .attr("width", function(d) { return x(d.y + d.dy) - x(d.y); })
          .attr("height", function(d) { return y(d.x + d.dx) - y(d.x); });
      currentDocno=d.docno;
      setHighlight(currentDocno);

    }


    function partitionTableMouseover(d, i) {
        d3.select(this).style("opacity", 1.0);
                
        d3.select(this).style("stroke","#000");
        //d3.select(this).style("stroke-width", "1");

        /*
        // Fade all the segments.
        d3.selectAll("path").style("opacity", 0.3);

        // Then highlight only those that are an ancestor of the current segment.
        var sequenceArray = getAncestors(d);

        vis.selectAll("path")
            .filter(function(node) {
                return (sequenceArray.indexOf(node) >= 0);
            })
            .style("opacity", 1);

        */
        //d.bookid = "tdo"; // @@@@
        
        if(d.type == "lecture"){
            //$("#tip").html(d.name + ":<br/>" + d.title); // @@@@
            $("#tip").html(d.title);
        }else{
            var bookName = getBookName(d.bookid);
            $("#tip").html("[Book] <b>" + bookName + "</b>: " + d.name);
        }
        $("#tip").css("color","#777777"); 

        /* BEGIN iframe selection */
        // @@@@ this was intended to show selection in the small multiples frame, but it is broken, and commented 
        // @@@@ in order to prevent a javascript error
        if (d.type == "lecture") {
            //parent.frames['iframe-sm'].selectFunction('arc' + (d.name.replace(/ /g, "-")), 0.1);
        } else {
            //parent.frames['iframe-sm'].selectFunction('arc' + (searchParent(d).replace(/ /g, "-")), 0.1);
        }
        /* END iframe selection */
        $("#tip").html("[Book] <b>" + bookName + "</b>: " + d.name);
        return false;
    }

     function partitionTableMouseout(d, i) {
                //d3.select(g[0][i]).select("rect").style("stroke","#fff");   
                d3.select(g[0][i]).select("rect").style("stroke","#000");         
                d3.select(g[0][i]).style("stroke-width", "1");              
                d3.select(g[0][i]).style("opacity", 1);
                setHighlight(currentDocno);
                /* BEGIN iframe selection */
                if (d.type == "lecture") {
                    //parent.frames['iframe-sm'].selectFunction('arc' + (d.name.replace(/ /g, "-")), 1);
                } else {
                    //parent.frames['iframe-sm'].selectFunction('arc' + (searchParent(d).replace(/ /g, "-")), 1);
                }
                /* END iframe selection */
                return false;
    }

    function setHighlight(docno){
    //alert('setting high light');
    console.log("Set highlight called with docno:" + docno);
    
    g = d3.select(".partition_docno_"+docno);

    if (!g)
        return;

    d = g.data()[0]
    console.log(d);

    if(!d)
        return;

    // Fade all the segments.
    d3.selectAll("rect").style("opacity", 0.3)
                        //.style("stroke","#fff");
                        .style("stroke","#000");

    // Then highlight only those that are an ancestor of the current segment.
    var sequenceArray = getAncestors(d);

    d3.selectAll("rect")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1);
     if(d.type == "lecture"){
         $("#tip").html(d.title);
     }else{
         var bookName = getBookName(d.bookid);
         $("#tip").html("[Book] <b>" + bookName + "</b>:<br />" + d.name);
     }
     $("#tip").css("color","#000000");
}
}
});


        