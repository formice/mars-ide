/* global $, visoConfig, Mustache, uuid, jsPlumb */

// 参考：https://blog.csdn.net/Smile0L0/article/details/92667613
//    :https://www.cnblogs.com/1606-huluwa/p/10872754.html
(function () {
  var areaId = '#diagramContainer-main';

  jsPlumb.ready(jsPlumbMain);
	$.ajax({
		url:'http://localhost:8080/tool/list',
		method:'post',
		data:{"cate":1},
		dataType:'JSON',
		success:function(res){
			if(res.code='200'){
				console.log(res);
				$(res.data).each(function () {
					$("#diagramContainer-left").append("<div  class=\'col-sm-12\'><div class=\'jnode-box jnode-rectangle bdc-primary\' data-template=\'jnode-template\' data-jnode=\'task\' id=\'"+this.id+"\' data-jnode-class=\'jnode-task bdc-primary\'><span style='font-size:8pt'>"+this.name+"</span></div> </div>");
				});

				//定义可拖拽控件
				$('.jnode-box').draggable({
					helper: 'clone',
					scope: 'ss'
				});
			} else {
				alert(res.msg);
			}
		},
		error:function (res) {

		}
	}) ;

  // 放入拖动节点
  function dropNode (dataset, ui, obj) {
	var dataObj = ui.position;
	//console.log("ui.position",position);
	var left = parseInt(ui.offset.left - $(obj).offset().left);
    var top = parseInt(ui.offset.top - $(obj).offset().top);
	console.info("dd:"+ui.draggable[0].id);
	//dataObj.id = uuid.v1();
	  dataObj.id = 'node-'+ui.draggable[0].id;
	  alert(dataObj.id);
	  loadParam(ui.draggable[0].id);
	  showRightArea();
	dataObj.top = top;
    dataObj.left = left;//$('#diagramContainer-left').outerWidth();
	dataObj.jnode=dataset.jnode;
	dataObj.jnodeClass=dataset.jnodeClass;
	dataObj.jnodeHtml=ui.helper.html();
	console.log("template.dataObj",dataObj);
    var targetHtml = renderHtml(dataset.template, dataObj);
	//alert(targetHtml);
    $(areaId).append(targetHtml);//追加元素

    initSetNode(dataObj);// 初始化节点设置

	/**jsplumb实际上不支持改变节点大小，实际上只能通过jquery ui resizable 方法去改变。
	 $(areaId).find('.btn').resizable({
      resize: function (event, ui) {
        jsPlumb.repaint(ui.helper)
      }
    })
	**/	

  }

  // 初始化节点设置
  function initSetNode (dataObj) {
	  var id = dataObj.id;
    // jsPlumb.draggable(id, {containment: 'parent'})
    addDraggable(id);

	 var isvisible = false;
      if("judge"==dataObj.jnode){
          isvisible = true;//判断节点显示Label标签
      }
	//设置四周端点
      visioConfig.baseArchors.forEach(function (key) {
          jsPlumb.addEndpoint(
              id,
              {
                  anchors: key,
                  connectorOverlays: [
                      ["Arrow", {width: 10, length: 10, location: 1, id: "arrow",visible: isvisible}],
                      ["Label", {label: "条件", id: "myLabel", cssClass: "connectorLabel",visible: isvisible, events:{
                          "click":function (label, evt) {
                              console.log("clicked on label for connection",label.component);
                              alert("条件");
                          }
                      }}]
                  ]
              },
              visioConfig.hollowCircle);
      });
	

    // jsPlumb.addEndpoints(id, [{anchors: ['TopCenter', 'RightMiddle', 'BottomCenter', 'LeftMiddle']}], visioConfig.hollowCircle)

	//新增可删除的close元素
	$("#"+id).on("mouseenter", ".jnode-box", function () {
				//鼠标穿过被选元素时,添加
				var left = 10,top = 18,right = 10;
				if($(this).hasClass("jnode-judge"))top = 40;//判断的特殊控制
				$(this).after('<i class="fa fa-trash-o" style="position:absolute;color:#fff;left:'+left+'px;top:'+top+'px;z-index:12;"/>');
				$(this).after('<i class="fa fa-cog" style="position:absolute;color:#fff;right:'+right+'px;top:'+top+'px;z-index:12;"/>');
			}).on("mouseleave", ".jnode-box", function () {
				//鼠标离开被选元素时，移除
				$(".fa-trash-o").remove();
				$(".fa-cog").remove();
			}).on("click", ".fa-trash-o", function () {
				//鼠标点击close元素时，删除
				if (confirm("确定要删除节点和相关连线吗？")) {
					jsPlumb.removeAllEndpoints($(this).parent().attr("id"));
					$(this).parent().remove();
				}
			}).on("dblclick", ".jnode-box",function(){
				//鼠标双击
				var text = $(this).text();
				loadParam(id.replace('node-',''));
				showRightArea();
			});

  }

  function showRightArea(){
	  $('#my-link').trigger("click");
  }

  function loadParam(toolId){
  	var str = localStorage.getItem("tool-"+toolId);
  	var params = JSON.parse(str);
  	if(params){

		$.each(params,function(index,val){
			$("#param-content").append(
				"<div id='flow-param-" + val.id + "'>" +
				"<input type=\"hidden\" id=\"id-" + val.id + "\" value=\"" + val.id + "\" class=\"input-content\" style=\"height:32px\"/>" +
				"<input type=\"hidden\" id=\"toolId-" + val.id + "\" value=\"" + val.toolId + "\" class=\"input-content\" style=\"height:32px\"/>" +
				"<label class=\"input-label\" id=\"name-"+val.id+"\">" + val.name + ":</label><input type=\"text\" id=\"value-" + val.id + "\" value=\"" + val.value + "\" class=\"input-content\" style=\"height:32px\"/>" +
				"</div>"
			);
		});


		//定义可拖拽控件
		/*$('.jnode-box').draggable({
			helper: 'clone',
			scope: 'ss'
		});*/
  	}else {
		$.ajax({
			url: 'http://localhost:8080/tool/parameter',
			method: 'post',
			data: {"toolId": toolId},
			dataType: 'JSON',
			success: function (res) {
				if (res.code = '200') {
					console.log(res);
					$(res.data).each(function () {
						$("#param-content").append(
							"<div id='flow-param-" + this.id + "'>" +
							"<input type=\"hidden\" id=\"id-" + this.id + "\" value=\"" + this.id + "\" class=\"input-content\" style=\"height:32px\"/>" +
							"<input type=\"hidden\" id=\"toolId-" + this.id + "\" value=\"" + this.toolId + "\" class=\"input-content\" style=\"height:32px\"/>" +
							"<label class=\"input-label\" id=\"name-"+this.id+"\">" + this.name + ":</label><input type=\"text\" id=\"value-" + this.id + "\" value=\"" + this.defaultValue + "\" class=\"input-content\" style=\"height:32px\"/>" +
							"</div>"
						);
					});

					//定义可拖拽控件
					/*$('.jnode-box').draggable({
						helper: 'clone',
						scope: 'ss'
					});*/
				} else {
					alert(res.msg);
				}
			},
			error: function (res) {

			}
		});
	}
  }


  // 让元素可拖动
  function addDraggable (id) {
    jsPlumb.draggable(id, {containment: 'parent'});//containment: 'parent'只能在固定区域内移动
	//jsPlumb.draggable(id, {containment: 'parent',grid: [10, 10]});//containment: 'parent'只能在固定区域内移动
  }

  // 利用mustache模板工具，渲染html
  function renderHtml (templateId, dataObj) {
	return Mustache.render($("#"+templateId).html(), dataObj);
	//return Mustache.render(visioConfig.visioTemplate[templateId], dataObj);
  }

  //初始化连接线的文本。
  function initConnection(connection){
	var labelText = connection.sourceId.substring(15) + "-" + connection.targetId.substring(15);
	var startText = connection.source.innerText;
	var endText = connection.target.innerText;
	labelText = startText+"->"+endText;
	connection.getOverlay("myLabel").setLabel(labelText);
  }

  // 主要入口
  function jsPlumbMain () {
    jsPlumb.setContainer('diagramContainer-main');

	

	//单点击了连接线, 支持删除连线
	jsPlumb.bind('click', function (conn, originalEvent) {
		console.log("connection click",conn);
		if(conn.source){//判断是否连接线
			if (confirm('确定删除所点击的连线吗？')) {
				jsPlumb.detach(conn)
			}
		}
	});


	jsPlumb.bind("connection", function (connInfo, originalEvent) {
		console.log("connInfo" ,connInfo);
		initConnection(connInfo.connection);
	});



	jsPlumb.bind("connectionDrag", function (connection) {
		console.log("connectionDrag", connection);
	});

	jsPlumb.bind("connectionDragStop", function (connection) {
		console.log("connectionDragStop",connection);
	});


	/*//定义可拖拽控件
    $('.jnode-box').draggable({
      helper: 'clone',
      scope: 'ss'
    });*/
	
	//定义可拖拽释放
    $(areaId).droppable({
      scope: 'ss',
      drop: function (event, ui) {
		//创建新节点
        dropNode(ui.draggable[0].dataset, ui,$(this));
      }
    });

  }

	$('#save').click(function () {
		/*Objs = [];
		$('#diagramContainer-main .jnode-panel').each(function() {
			Objs.push({id:$(this).attr('id'), html:$(this).html(),left:$(this).css('left'),top:$(this).css('top'),width:$(this).css('width'),height:$(this).css('height')});
		});
		console.log(Objs);*/

		//alert($('#diagramContainer-main').html())
		console.info($('#diagramContainer-main').html());

		var lines = [];
		$.each(jsPlumb.getAllConnections(), function (idx, connection) {
			lines.push({
				lineId: connection.id,
				fromId: connection.sourceId,
				toId: connection.targetId,
				sourcePoint: connection.endpoints[0].anchor.type,
				targetPoint: connection.endpoints[1].anchor.type,
			});
		});
		console.log(lines);
		var nodes = [];
		$("#diagramContainer-main .jnode-panel").each(function (idx, elem) {
			var $elem = $(elem);
			console.log($elem);
			var nodeId = $elem.attr('id');
			var blockContent = $elem.children('.node-text').html();
			nodes.push({
				nodeId: nodeId,
				blockContent: blockContent,
				type: $elem.data("type"),
				blockX: parseInt($elem.css("left"), 10),
				blockY: parseInt($elem.css("top"), 10),
				width: parseInt($elem.width(), 10) + 24,
				height: parseInt($elem.height(), 10) + 16,
			});
		});
		console.log(nodes);
		var lineDescs = [];
		$("#diagramContainer-main ._jsPlumb_connector").each(function (idx, elem) {
			var $elem = $(elem);
			var lineContent = $elem.children('.label-text').html();
			lineDescs.push({
				lineId: $elem.attr('id'),
				lineContent: lineContent,
				lineX: parseInt($elem.css("left"), 10),
				lineY: parseInt($elem.css("top"), 10),
				width: parseInt($elem.width(), 10) + 24,
				height: parseInt($elem.height(), 10) + 16,
				pathId: $elem.data("path")
			});
		});
		console.log(lineDescs);

		var params = [];
		$.each(nodes,function(index,val){
			//alert(val.nodeId.replace("node-",""));
			var str = localStorage.getItem("tool-"+val.nodeId.replace("node-",""));
			params = params.concat(JSON.parse(str));
		});
		//alert(JSON.stringify(params));

		var serliza = {
			name:$('#flow-name').val(),
			desc:$('#flow-desc').val(),
			lines:lines,
			nodes:nodes,
			params:params
			//lineDescs:lineDescs
		}
		console.log(JSON.stringify(serliza));
		console.log(lines[0].fromId);
		console.log(nodes[0].nodeId);
		//console.log(lineDescs[0]);
		$.ajax({
			url:'http://localhost:8080/flow/add',
			method:'post',
			contentType:'application/json', //需要加contentType
			data:JSON.stringify(serliza),
			dataType:'json',
			async:false,
			success:function(res){
				if(res.code='200'){
					//console.log(res);
					var url = "flow-list.html";
					window.location.href = url;
					// 获得frame索引
					//var index = parent.layer.getFrameIndex(window.name);
					//关闭当前frame
					//parent.layer.close(index);
				} else {
					alert(res.msg);
				}
			},
			error:function (res) {

			}
		}) ;
	});


})()
