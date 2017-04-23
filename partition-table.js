// set the url for get user progress
progress_url = progress_url + "?usr="+usr+"&grp="+grp+"&sid="+sid+"&mode=all"
var question_coords=[];
var question_in = [];
var question_in2 = [];

$.ajax({
    url: progress_url,
    async:false,
    success:function (result) {
        // get user progress and paint partition table
        var docAmount = result.progress.length;
        var countDoc = 0;
        var diagram = [];
        for (countDoc = 0; countDoc < docAmount; countDoc++) {
            var uprogress = result.progress[countDoc].uprogress;
            if (uprogress >= 0 && uprogress < 0.1) {
                var theColor = colors[0];
            }
            if (uprogress >= 0.1 && uprogress < 0.2) {
                var theColor = colors[1];
            }
            if (uprogress >= 0.2 && uprogress < 0.3) {
                var theColor = colors[2];
            }
            if (uprogress >= 0.3 && uprogress < 0.4) {
                var theColor = colors[3];
            }
            if (uprogress >= 0.4 && uprogress < 0.5) {
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
            }
            diagram.push({
                docNum:result.progress[countDoc].docno,
                diagramColor:theColor
            })
        }
    
    var w = 120;
        //h = "100%";
    var h = window.innerHeight;
    //var h = 1000;

    var x = d3.scale.linear()
        .range([0, w-40]);
        //.range([0, h]);

    var x_comp = d3.scale.linear()
        .range([w-40, 0]);
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

    var svg_comp = d3.select("#partition-table").append("svg")
        .attr("width", w)
        .attr("height", h)
        .style("margin-left","20px");

    var svg2 = d3.select("#partition-table").append("svg")
        .attr("class","svg")
        .attr("width", w)
        .attr("height", h)
        .style("margin-left","-35px");
        //.attr("translate(100 0)");
        //.style("background","#898989");
        //.style("margin-top","-15px");
        //.style("margin-bottom","-15px");
    var rect_comp = svg_comp.selectAll("rect");
    var rect = svg2.selectAll("rect");

    d3.json(json_file,function(error, root) {
      //if (error) throw error;
      var separation = 1;
      var y_separation = 0;

        rect = rect
          .data(partition(root))
        .enter().append("g")
            .attr("class", function (d) { 
                    classname = "partition_depth_" + d.depth;

                    //if (d.depth > 0){
                        classname += " partition_docno_" + d.docno;
                    //}

                    return classname;
                })
            .append("rect")
          /*.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", function(d) { return x(d.dx); })
          .attr("height", function(d) { return y(d.dy); })
          */
          .attr("x", function(d) { 
                return x(d.y)+d.depth*separation;
                //return d.depth*(separation+widthLayer);
            })                          
          .attr("y", function(d) { return y(d.x)+y_separation; })
          .attr("width", function(d) { return x(d.dy); })
          .attr("height", function(d) { return y(d.dx); })
          .attr("fill", function (d) {
                    var count = 0;
                    for (count = 0; count < diagram.length; count++) {
                        if (diagram[count].docNum == d.docno) {
                            return d3.rgb(diagram[count].diagramColor)
                        }
                    }
                    return d3.rgb("#fff");
                })
          .attr("class", function (d) { 
                    classname = "partition_depth_" + d.depth;

                    //if (d.depth > 0){
                        classname += " partition_docno_" + d.docno;
                    //}

                    return classname;
                })
          .attr("display", function(d) { return d.depth && d.depth<=4 ? null : "none"; })//d.depth && d.depth<=3 ? null : "none"; })
          .attr("stroke-width","1px")
          .attr("stroke","white")
          .attr("opacity",0.4)
          .on("click", partitionTableClick)
          .on("dblclick", partitionTableDoubleClick)
          .on("mouseover",partitionTableMouseover)
          .on("mouseout",partitionTableMouseout);

        rect_comp = rect_comp
          .data(partition(root))
        .enter().append("g")
            .attr("class", function (d) { 
                    classname = "partition_depth_" + d.depth;

                    //if (d.depth > 0){
                        classname += " partition_docno_" + d.docno;
                    //}

                    return classname;
                })
            .append("rect")
          /*.attr("x", function(d) { return x(d.x); })
          .attr("y", function(d) { return y(d.y); })
          .attr("width", function(d) { return x(d.dx); })
          .attr("height", function(d) { return y(d.dy); })
          */
          .attr("x", function(d) { 
                return x_comp(d.y)-d.depth*separation;
                //return d.depth*(separation+widthLayer);
            })                          
          .attr("y", function(d) { return y(d.x)+y_separation; })
          .attr("width", function(d) { return x(d.dy); })
          .attr("height", function(d) { return y(d.dx); })
          .attr("fill", function (d) {
                    var count = 0;
                    for (count = 0; count < diagram.length; count++) {
                        if (diagram[count].docNum == d.docno) {
                            //console.log(count);
                            var ran_count=Math.round(Math.random()*9);
                            return d3.rgb(diagram[ran_count].diagramColor)
                        }
                    }
                    return d3.rgb("#fff");
                })
          .attr("class", function (d) { 
                    classname = "partition_depth_" + d.depth;

                    //if (d.depth > 0){
                        classname += " partition_docno_" + d.docno;
                    //}

                    return classname;
                })
          .attr("display", function(d) { return d.depth && d.depth<=4 ? null : "none"; })//d.depth && d.depth<=3 ? null : "none"; })
          .attr("stroke-width","1px")
          .attr("stroke","white")
          .attr("opacity",0.4)
          .on("click", partitionTableClick)
          .on("dblclick", partitionTableDoubleClick)
          .on("mouseover",partitionTableMouseover)
          .on("mouseout",partitionTableMouseout);

        var subsections = svg2.selectAll("g.partition_depth_2");

        subsections.append("circle")
            .attr("cx", function (d,i) { 
                /*if (i%2){
                    return x(d.y)+x(d.dy)+40;
                }else{
                    return x(d.y)+40;
                }*/
                //return (x(d.y)+x(d.dy)/2+(separation*2)-1.5);
                return (x(d.y)+x(d.dy)/2+(separation*2)-1.5);
            })
            .attr("cy", function (d,i) { return y(d.x)+(y(d.dx)/2); })
            .attr("r", 2)
            .style("fill", "#c5c5c5")
            //.attr("stroke-width","0.5px")
            //.style("stroke", "black")
            .style("z-index","1000");

        /*subsections.append("text")
                .attr("dx", function(d){return x(d.y)+x(d.dy)/2+(separation*2)-3.5;})
                .attr("dy", function (d) { return y(d.x)+(y(d.dx)/2)+3;})
                .style("font-size","8px")
                .text("?");*/

        var subsections3 = svg2.selectAll("g.partition_depth_3");


        subsections3.append("circle")
            .attr("cx", function (d,i) { 
                /*if (i%2){
                    return x(d.y)+x(d.dy)+40;
                }else{
                    return x(d.y)+40;
                }*/
                //return x(d.y)+x(d.dy)/2+(separation*4)-1.5;
                return (Math.random()*30)+(1.7*x(d.y))+(separation*4)-1.5;
            })
            .attr("cy", function (d,i) { return y(d.x)+(y(d.dx)/2); })
            .attr("r", 2)
            .style("fill", "#c5c5c5")
            //.attr("stroke-width","0.5px")
            //.style("stroke", "black")
            .style("z-index","1000");

        /*subsections3.append("text")
                .attr("dx", function(d){return x(d.y)+x(d.dy)/2+(separation*3)-3.5;})
                .attr("dy", function (d) { return y(d.x)+(y(d.dx)/2)+3;})
                .style("font-size","8px")
                .text("?");*/

            //.style("z-index", "3");

        //var questions_array=subsections3.selectAll("circle")
        //questions_array.forEach(function(d,i){
            // console.log("question");
            // console.log(d);
            // console.log(d[0].__data__.x);
            // console.log(d[0].__data__.y);

            //question_coords.push({"y":d[0].__data__.y,"x":d[0].__data__.x});
            //question_in.push({"y":d[0].__data__.y});
            // question_coords.push({"y":d[0].__data__.y,"x":d[0].__data__.x});
            // question_in.push({"y":d[0].__data__.y});
        //})
        //alert(question_coords);

        //var circleArray = d3.select("circle");


        $('circle').each(function(idx, el){//go through each circle

          var x_val = el.getAttribute('cx');//get cx
          var y_val = el.getAttribute('cy');//get cy

          console.log(x_val);
          console.log(y_val);

           if(x_val > 40.5){
              question_coords.push({"y": y_val, "x": x_val});
              question_in.push({"y": y_val});
              question_in2.push({"x": x_val});
           }

        });

   
        var lectures = svg2.selectAll("g.partition_depth_1");
        
        lectures.append("text")
            //.attr("dx", function(d){return x(d.y)+(separation*2);})
            //.attr("dy", function (d) { return y(d.x)+(y(d.dx)/2)+3;})
            .attr("transform",function(d){return "translate("+(12+x(d.y)+(separation*2))+","+(y(d.x)+(y(d.dx)/2)+3)+") rotate(-90)";})
            .style("font-size","10px")
            .style("text-anchor","middle")
            .text(function(d){return d.name;});
            //.attr("transform","rotate(90)");//,"+(x(d.y)+(separation*2))+","+(y(d.x)+(y(d.dx)/2)+3)+") ");
        //svg2.translate()

        setHighlight(currentDocno);

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

        $.ajax({
            url: './questions/api.php?task=status',
            type: 'POST',
            data: parent.JSON.stringify(data),
            contentType: 'application/json',
            dataType: "json",
            success:function (result) {
                // get user progress and paint question glyphs
                var diagram = [];
                console.log(result); 

                var docAmount = result.length;
                var countDoc = 0;
                
                for (countDoc in result) {
                    var uprogress = result[countDoc];
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
                    diagram[countDoc]=theColor;
                    /*diagram.push({
                        docNum:countDoc,
                        diagramColor:theColor
                    })*/
                }
                console.log(d3.selectAll("circle"));
                d3.selectAll("g.partition_depth_2").select("circle")
                    .style("display", function (d) {   
                        /*var count = 0;
                        for (count = 0; count < diagram.length; count++) {
                            if (diagram[count].docNum == d.id) {
                                if (diagram[count].diagramColor=="#fff"){
                                    return "none";
                                }
                            }
                        }*/
                        if (diagram[d.id]=="#fff"){
                            return "none";
                        }
                    })
                    .style("fill", function (d) {   
                        /*var count = 0;
                        for (count = 0; count < diagram.length; count++) {
                            if (diagram[count].docNum == d.id) {
                                return d3.rgb(diagram[count].diagramColor);
                            }
                        }*/
                        return d3.rgb(diagram[d.id]);
                    });

                d3.selectAll("g.partition_depth_2").select("text")
                    .style("display", function (d) {   
                        /*var count = 0;
                        for (count = 0; count < diagram.length; count++) {
                            if (diagram[count].docNum == d.id) {
                                if (diagram[count].diagramColor=="#fff"){
                                    return "none";
                                }
                            }
                        }*/
                        if (diagram[d.id]=="#fff"){
                            return "none";
                        }
                    })
                console.log(d3.selectAll("circle"));
                d3.selectAll("g.partition_depth_3").select("circle")
                    //.style("display", function (d) {   
                        /*var count = 0;
                        for (count = 0; count < diagram.length; count++) {
                            if (diagram[count].docNum == d.id) {
                                if (diagram[count].diagramColor=="#fff"){
                                    return "none";
                                }
                            }
                        }*/
                        /*if (diagram[d.id]=="#fff"){
                            return "none";
                        }
                    })*/
                    .style("fill", function (d) {   
                        /*var count = 0;
                        for (count = 0; count < diagram.length; count++) {
                            if (diagram[count].docNum == d.id) {
                                return d3.rgb(diagram[count].diagramColor);
                            }
                        }*/
                        return d3.rgb(diagram[d.id]);
                    });

                d3.selectAll("g.partition_depth_3").select("text")
                    .style("display", function (d) {   
                        /*var count = 0;
                        for (count = 0; count < diagram.length; count++) {
                            if (diagram[count].docNum == d.id) {
                                if (diagram[count].diagramColor=="#fff"){
                                    return "none";
                                }
                            }
                        }*/
                        if (diagram[d.id]=="#fff"){
                            return "none";
                        }
                    })
                /*var line = d3.line()
                    .x(function(d) { return x(d.y); })
                    .y(function(d) { return y(d.x); });*/

                // var test1 = [
                //   {y: 238, x: 96},
                //   {y: 258, x: 100},
                //   {y: 294, x: 88},
                //   {y: 310, x: 106},
                //   {y: 376, x: 105},
                // ];

                // var test2 = [238, 258, 294, 310, 376];


                var xScale = d3.scale.linear()
                    .domain([0, d3.max(question_coords, function(d){ return d.x; })])
                    .range([0, w]);

                // var xScale = d3.scale.linear()
                //     .domain(question_in2)
                //     .range(question_in2);

                // var yScale = d3.scale.ordinal()
                //     .domain(question_in)
                //     .rangePoints(question_in);

                var yScale = d3.scale.linear()
                    .domain([0, d3.max(question_coords, function(d){ return d.y; })])
                    .range([0, h]);

                var line = d3.svg.line()
                    .x(function(d) { return xScale(d.x - 15); })
                    .y(function(d) { return yScale(d.y - 11); });

                    // console.log("start");
                    // console.log(question_coords);
                    // console.log("end");
                    // console.log(question_in);
                    

                svg2.append("path")
                    .data([question_coords])
                    .style("fill", "none")
                    .style("stroke", "black")
                    .attr("d", line);


                // var line = d3.svg.line()
                //           .x(function(d) { return d.x; })
                //           .y(function(d) { return d.y; })
                //           .interpolate("linear");
                // console.log(question_coords);
                // d3.select(".svg").append("path")
                //   .datum(question_coords)
                //   .attr("fill", "none")
                //   .attr("stroke", "steelblue")
                //   .attr("stroke-linejoin", "round")
                //   .attr("stroke-linecap", "round")
                //   .attr("stroke-width", 1.5)
                //   .attr("d",line);



            }
        });
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
        d3.selectAll("rect").style("opacity", 0.4);

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
                d3.select(g[0][i]).select("rect").style("stroke","white");           
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
    d3.selectAll("rect").style("opacity", 0.4)
                        .style("stroke","#fff");

    // Then highlight only those that are an ancestor of the current segment.
    var sequenceArray = getAncestors(d);

    d3.selectAll("rect")
        .filter(function(node) {
            return (sequenceArray.indexOf(node) >= 0);
        })
        .style("opacity", 1)
        .style("stroke","black");
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

        