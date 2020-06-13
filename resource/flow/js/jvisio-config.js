var visioConfig = {
  visioTemplate: {}
}
// 基本模板节点
visioConfig.visioTemplate.nodeStart = '<div class="jnode-panel" id="{{id}}" style="top:{{top}}px;left:{{left}}px"><div class="jnode-box jnode-radius bdc-success"><span>开始</span></div></div>'
visioConfig.visioTemplate.nodeTask = '<div class="jnode-panel" id="{{id}}" style="top:{{top}}px;left:{{left}}px"><div class="jnode-box jnode-task bdc-primary"><span>节点</span></div></div>'
visioConfig.visioTemplate.nodeJudge = '<div class="jnode-panel" id="{{id}}" style="top:{{top}}px;left:{{left}}px"><div class="jnode-box jnode-diamond jnode-judge bdc-warning"><span>判断</span></div></div>'
visioConfig.visioTemplate.nodeEnd = '<div class="jnode-panel" id="{{id}}" style="top:{{top}}px;left:{{left}}px"><div class="jnode-box jnode-radius bdc-danger"><span>结束</span></div></div>'

// 基本锚点方位
// visioConfig.baseArchors = ['TopCenter', 'RightMiddle', 'BottomCenter','LeftMiddle'];
//visioConfig.baseArchors = ['TopCenter', 'RightMiddle', 'BottomCenter','LeftMiddle','TopLeft', 'TopRight','BottomLeft','BottomRight'];
visioConfig.baseArchors = [[0.5, -0.01],[1.01, 0.5],[0.5, 1.01],[-0.01, 0.5]];
// 基本连接线样式
visioConfig.connectorPaintStyle = {
  lineWidth: 2,
  strokeStyle: '#337ab7',//#61B7CF',
  joinstyle: 'round',
  outlineColor: 'transparent',
  outlineWidth: 2
}

// 鼠标悬浮在连接线上的样式
visioConfig.connectorHoverStyle = {
  lineWidth: 2,
  strokeStyle: '#d58512',
  outlineWidth: 2,
  outlineColor: 'transparent'
}
// 鼠标悬浮连接线上两端锚点样式
visioConfig.endpointHoverStyle = {
	lineWidth: 2,
  strokeStyle: '#d58512',
  outlineWidth: 2,
  outlineColor: '#d58512'
}
//锚点样式
visioConfig.hollowCircle = {
  endpoint: ['Dot', { radius: 8 }],  // 端点的形状[Dot,Rectangle]
  connectorStyle: visioConfig.connectorPaintStyle, // 连接线的颜色，大小样式
  hoverPaintStyle: visioConfig.endpointHoverStyle,
  connectorHoverStyle: visioConfig.connectorHoverStyle,
  paintStyle: {
    strokeStyle: '#1e8151',
    fillStyle: 'transparent',
    radius: 2,
    lineWidth: 2
  },        // 端点的颜色样式
  // anchor: "AutoDefault",
  isSource: true,    // 是否可以拖动（作为连线起点）
  // connector: 'Flowchart',  // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine],[Straight]
  connector: ['Flowchart', { stub: [5, 10], gap: 5, cornerRadius: 5, alwaysRespectStubs: true }],  // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine],[Straight]
  isTarget: true,    // 是否可以放置（连线终点）
  maxConnections: -1,    // 设置连接点最多可以连接几条线
  connectorOverlays: [['Arrow', { width: 10, length: 10, location: 1 }]]
}

