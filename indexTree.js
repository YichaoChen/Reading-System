/**
 * Created with JetBrains WebStorm.
 * User: VigossZ
 * Date: 13-1-29
 * Time: 上午7:09
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function(){
	
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
    
    var questionStatusButton = document.getElementById("toggle-question-status");
    var indexElement = document.getElementById("index");
    
    var data = {
	        'docids': Object.keys(docIdSet),
	        'usr': usr,
	        'grp': grp
	    };
    
	jQuery.ajax({
        url: 'questions/api.php?task=status',
        type: 'POST',
        data: parent.JSON.stringify(data),
	    contentType: 'application/json',
        dataType: "json",
        success: function(result) {
        	for (var key in result) {
        		if (result.hasOwnProperty(key)) {
        			var value = result[key];
        			var elements = document.getElementsByClassName('docid-' + key);
        			for (var i = 0; i < elements.length; i++) {
        				var element = elements[i];
        				element.classList.add('status-' + value);
        			}
        		}
        	}
        }
    });
    
    var questionStatus = false; // true when status is shown in index
    var toggleQuestionStatus = function() {
    	
    	questionStatus = !questionStatus;
    	if (questionStatus) {
    		questionStatusButton.style.backgroundColor = 'lightblue';
    		indexElement.classList.add('qShow');
    	} else {
    		questionStatusButton.style.backgroundColor = '';
    		indexElement.classList.remove('qShow');
    	}
    };
    
    questionStatusButton.addEventListener('click', toggleQuestionStatus);
});
