import React from 'react';
import {connect} from 'dva';
import G6 from '@antv/g6';
import {Card} from 'antd';
import _ from 'lodash';


// 处理省略
const calcStrLen = function calcStrLen(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};
const fittingString = function fittingString(str, maxWidth, fontSize) {
  const fontWidth = fontSize * 1.3; // 字号+边距
  maxWidth *= 2; // 需要根据自己项目调整
  const width = calcStrLen(str) * fontWidth;
  const ellipsis = '…';
  if (width > maxWidth) {
    const actualLen = Math.floor((maxWidth - 10) / fontWidth);
    const result = str.substring(0, actualLen) + ellipsis;
    return result;
  }
  return str;
};

let tooltipEl = null;

// 在指定的位置显示tooltip
function showTooltip(message, position) {
  if (!tooltipEl) {
    const container = document.getElementById('mountNode');
    tooltipEl = document.createElement('div');
    tooltipEl.setAttribute('class', 'graph-tooltip');
    container.appendChild(tooltipEl);
  }
  tooltipEl.textContent = message;
  // tooltip是相对于画布canvas element绝对定位，所以position的x，y必须是相对于画布的坐标
  tooltipEl.style.left = `${position.x}px`;
  tooltipEl.style.top = `${position.y}px`;
  tooltipEl.style.display = 'block';
}

// 隐藏tooltip
function hideTooltip() {
  if (!tooltipEl) {
    return;
  }
  tooltipEl.style.display = 'none';
}


const data = {
  name: '服务器',
  key: '1',
  tip: '127.0.0.1',
  type: 1,
  state: '在线',
  keyInfo: '路径：/home/ /mount/ /abc/',
  keyInfoLabel: '路径：/home/ /mount/ /abc/',
  count: 222,
  children: [
    {
      name: '客户端1',
      key: '1-1',
      tip: '127.0.0.1',
      type: 2,
      state: '离线',
      keyInfo: '磁盘数量：5 带宽数：64Kbps',
      keyInfoLabel: '磁盘数量：5 带宽数：64Kbps',
      count: 222,
      children: [
        {
          name: '任务1',
          key: '1-1-1',
          type: 3,
          tip: '80.00G',
          state: '全量备份已完成',
          live: 1,
          keyInfo: '磁盘：vda vdb vdc',
          keyInfoLabel: '磁盘：vda vdb vdc',
          keyInfo2: '间隔：1天   备份路径：/home/',
          keyInfo2Label: '间隔：1天   备份路径：/home/',
          FinishedRate: '65.00%',
          BackupRate: '0.58',
          count: 222,

          children: [
            {
              name: '快照1',
              key: '1-1-1-1',
              tip: '2018-09-12 12.12.12',
              type: 4,
              state: '应急接管',
              keyInfo: '这是我的全量副本',
              keyInfoLabel: '这是我的全量副本',
              keyInfo2: '挂载到 192.168.1.1 客户端',
              keyInfo2Label: '挂载到 192.168.1.1 客户端',

            },
            {
              name: '快照2',
              key: '1-1-1-2',
              tip: '2018-09-12 12.12.12',
              type: 4,
              state: '文件恢复',
              keyInfo: '这是我的全量副本',
              keyInfoLabel: '这是我的全量副本',
              keyInfo2: '挂载到 192.168.1.1 客户端',
              keyInfo2Label: '挂载到 192.168.1.1 客户端',

            },
          ],
        },
      ],
    },
    {
      name: '客户端1',
      key: '1-2',
      tip: '127.0.0.1',
      type: 2,
      state: '离线',
      keyInfo: '磁盘数量：5 带宽数：64Kbps',
      keyInfoLabel: '磁盘数量：5 带宽数：64Kbps',
      count: 222,
      children: [
        {
          name: '任务1',
          key: '1-2-1',
          type: 3,
          tip: '80.00G',
          state: '全量备份已完成',
          live: 1,
          keyInfo: '磁盘：vda vdb vdc',
          keyInfoLabel: '磁盘：vda vdb vdc',
          keyInfo2: '间隔：1天   备份路径：/home/',
          keyInfo2Label: '间隔：1天   备份路径：/home/',
          FinishedRate: '65.00%',
          BackupRate: '0.58',
          count: 222,

          children: [
            {
              name: '快照1',
              key: '1-2-1-1',
              tip: '2018-09-12 12.12.12',
              type: 4,
              state: '应急接管',
              keyInfo: '这是我的全量副本',
              keyInfoLabel: '这是我的全量副本',
              keyInfo2: '挂载到 192.168.1.1 客户端',
              keyInfo2Label: '挂载到 192.168.1.1 客户端',

            },
            {
              name: '快照2',
              key: '1-2-1-2',
              tip: '2018-09-12 12.12.12',
              type: 4,
              state: '文件恢复',
              keyInfo: '这是我的全量副本',
              keyInfoLabel: '这是我的全量副本',
              keyInfo2: '挂载到 192.168.1.1 客户端',
              keyInfo2Label: '挂载到 192.168.1.1 客户端',

            },
          ],
        },
      ],
    },
  ],
}


const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
  return [['M', x - r, y], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0], ['M', x - r + 4, y], ['L', x - r + 2 * r - 4, y]];
};
const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
  return [['M', x - r, y], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0], ['M', x - r + 4, y], ['L', x - r + 2 * r - 4, y], ['M', x - r + r, y - r + 4], ['L', x, y + r - 4]];
};

const getNodeConfig = function getNodeConfig(node) {
  if (node.type === 1) {
    return {
      basicColor: '#F5222D',
      fontColor: '#FFF',
      borderColor: '#F5222D',
      bgColor: '#E66A6C',
    };
  }
  if (node.type === 2) {
    return {
      basicColor: '#722ED1',
      fontColor: '#722ED1',
      borderColor: '#722ED1',
      bgColor: '#F6EDFC',
    }
  }
  if (node.type === 3) {
    return {
      basicColor: '#1890FF',
      fontColor: '#1890FF',
      borderColor: '#1890FF',
      bgColor: 'rgba(24, 144, 255,0.3)',
    }
  }

  return {
    basicColor: '#E3E6E8',
    fontColor: 'rgba(0,0,0,0.85)',
    borderColor: '#E3E6E8',
    bgColor: '#F7F9FA',
  }
};

@connect(({antv, loading}) => ({
  antv,
  loading: loading.effects['dashboardAnalysis/fetch'],
}))
class AntvDemo extends React.Component {
  nodeBasicMethod = {
    createNodeBox: function createNodeBox(group, config, width, height, isRoot) {
      /* 最外面的大矩形 */
      const container = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width,
          height,
        },
      });
      if (!isRoot) {
        /* 左边的小圆点 */
        group.addShape('circle', {
          attrs: {
            x: 3,
            y: height / 2,
            r: 6,
            fill: config.basicColor,
          },
        });
      }
      /* 矩形 */
      group.addShape('rect', {
        attrs: {
          x: 3,
          y: 0,
          width: width - 19,
          height,
          fill: config.bgColor,
          stroke: config.borderColor,
          radius: 2,
          cursor: 'pointer',
        },
      });

      /* 左边的粗线 */
      group.addShape('rect', {
        attrs: {
          x: 3,
          y: 0,
          width: 3,
          height,
          fill: config.basicColor,
          radius: 1.5,
        },
      });
      return container;
    },
    /* 生成树上的 marker */
    createNodeMarker: function createNodeMarker(group, collapsed, x, y) {
      group.addShape('circle', {
        attrs: {
          x,
          y,
          r: 13,
          fill: 'rgba(47, 84, 235, 0.05)',
          opacity: 0,
          zIndex: -2,
        },
        className: 'collapse-icon-bg',
      });
      group.addShape('marker', {
        attrs: {
          x,
          y,
          radius: 7,
          symbol: collapsed ? EXPAND_ICON : COLLAPSE_ICON,
          stroke: 'rgba(0,0,0,0.25)',
          fill: 'rgba(0,0,0,0)',
          lineWidth: 1,
          cursor: 'pointer',
        },
        className: 'collapse-icon',
      });
    },
    afterDraw: (cfg, group) => {
      /* 操作 marker 的背景色显示隐藏 */
      const icon = group.findByClassName('collapse-icon');
      if (icon) {
        const bg = group.findByClassName('collapse-icon-bg');
        icon.on('mouseenter', () => {
          bg.attr('opacity', 1);
          this.graph.get('canvas').draw();
        });
        icon.on('mouseleave', () => {
          bg.attr('opacity', 0);
          this.graph.get('canvas').draw();
        });
      }
    },
    setState: function setState(name, value, item) {
      const group = item.getContainer();
      const childrens = group.get('children');
      this.graph.setAutoPaint(false);
      // this.graph.setAutoPaint(true);
    },
  };


  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    this.renderG6();
    this.renderG6AfterData('mountNode');
  }

  componentWillUnmount() {

  }

  renderG6AfterData = container => {
    this.graph = new G6.TreeGraph({
      container,
      width: '1920',
      height: '1080',
      modes: {
        default: [{
          type: 'collapse-expand',
          // shouldUpdate: function shouldUpdate(e) {
          //   /* 点击 node 禁止展开收缩 */
          //   if (e.target.get('className') !== 'collapse-icon') {
          //     return false;
          //   }
          //   return true;
          // },
          onChange: function onChange(item, collapsed) {
            console.log(item);
            const data = item.get('model');
            const icon = item.get('group').findByClassName('collapse-icon');
            if (collapsed) {
              icon.attr('symbol', EXPAND_ICON);
            } else {
              icon.attr('symbol', COLLAPSE_ICON);
            }
            data.collapsed = collapsed;
            return true;
          },
        }, 'drag-canvas', 'zoom-canvas'],
      },
      defaultNode: {
        shape: 'card-node',
        anchorPoints: [[0, 0.5], [1, 0.5]],
      },
      defaultEdge: {
        shape: 'cubic-horizontal',
      },
      edgeStyle: {
        default: {
          stroke: '#A3B1BF',
        },
      },
      layout: {
        type: 'compactBox',
        direction: 'LR',
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 80;
        },
        getWidth: function getWidth() {
          return 220;
        },
        getVGap: function getVGap() {
          return 32;
        },
        getHGap: function getHGap() {
          return 100;
        },
      },
    });
    G6.Util.traverseTree(data, item => {
      item.id = item.key;
    });
    _.forIn(data, (value, key) => {
      if (key === 'keyInfo') {
        _.set(data, 'keyInfo', fittingString(value, 215, 14))
      }
      const handleSource = children => {
        _.head(children) && children.forEach(i => {
          _.set(i, 'keyInfo', fittingString(i.keyInfo, 215, 12))
          if (i.keyInfo2) {
            _.set(i, 'keyInfo2', fittingString(i.keyInfo2, 215, 12))
          }
          if (_.head(i.children)) {
            handleSource(i.children)
          }
        })
      }
      if (key === 'children') {
        handleSource(value)
      }
    })
    this.graph.read(data);
    this.graph.fitView();

    // 节点上的点击事件
    this.graph.on('node:mousemove', event => {
      const node = event.item;
      const nodeId = node.get('model').keyInfoLabel;
      const nodeId2 = node.get('model').keyInfo2Label;
      const shape = event.target;
      if (shape.get('attrs').className === 'remarkText1') {
        // 如果点击是发生在节点里面的小圆上，显示tooltip
        showTooltip(nodeId, {
          x: event.canvasX + 10,
          y: event.canvasY + 10,
        });
      } else if (shape.get('attrs').className === 'remarkText2') {
        // 如果点击是发生在节点里面的小圆上，显示tooltip
        showTooltip(nodeId2, {
          x: event.canvasX + 10,
          y: event.canvasY + 10,
        });
      } else {
        hideTooltip();
      }
    });
  }

  renderG6 = () => {
    G6.registerNode('card-node', {
      drawShape: (cfg, group) => {
        const config = getNodeConfig(cfg);
        const isRoot = cfg.type === 1;
        const {type, name, live} = cfg;
        /* 最外面的大矩形 */
        const container = this.nodeBasicMethod.createNodeBox(group, config, 243, 70, isRoot);

        /* 定义节点左上角文字 */
        let nodeName = '';
        switch (type) {
          case 1:
            nodeName = '服务器:';
            break;
          case 2:
            nodeName = '客户端:';
            break;
          case 3:
            nodeName = '任务:';
            break;
          case 4:
            nodeName = '副本:';
            break;
          default:
            break;
        }
        group.addShape('text', {
          attrs: {
            text: `${nodeName}  ${name}`,
            x: 3,
            y: -12,
            fontSize: 14,
            textAlign: 'left',
            fontWeight: 'bold',
            textBaseline: 'middle',
            fill: 'rgba(0,0,0,0.65)',
          },
        });

        if (cfg.tip) {
          /* ip start */
          /* ipBox */
          const ipRect = group.addShape('rect', {
            attrs: {
              fill: type === 1 ? null : '#FFF',
              stroke: type === 1 ? 'rgba(255,255,255,0.65)' : null,
              radius: 2,
              cursor: 'pointer',
            },
          });

          /* ip */
          const ipText = group.addShape('text', {
            attrs: {
              text: cfg.tip,
              x: 0,
              y: 19,
              fontSize: 13,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: type === 1 ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.65)',
              cursor: 'pointer',
            },
          });

          const ipBBox = ipText.getBBox();
          /* ip 的文字总是距离右边 12px */
          ipText.attr({
            x: 16,
          });
          /* ipBox */
          ipRect.attr({
            x: 12,
            y: ipBBox.minY - 5,
            width: ipBBox.width + 8,
            height: ipBBox.height + 10,
          });
          /* ip end */
        }

        if (cfg.state) {
          /* state */
          let stateColor = 'black';
          let fillRect = '#FFF';
          let strokeRect = 'rgba(255,255,255,0.65)';

          switch (cfg.state) {
            case '在线':
              stateColor = '#52c41a';
              fillRect = '#f6ffed';
              strokeRect = '#b7eb8f';
              break;
            case '离线':
              stateColor = '#f5222d';
              fillRect = '#fff1f0';
              strokeRect = '#ffa39e';
              break;
            case '应急接管':
              stateColor = '#eb2f96';
              fillRect = '#fff0f6';
              strokeRect = '#ffadd2';
              break;
            case '文件恢复':
              stateColor = '#722ed1';
              fillRect = '#f9f0ff';
              strokeRect = '#d3adf7';
              break;
            default:
              stateColor = 'blue';
              break;
          }

          const stateRect = group.addShape('rect', {
            attrs: {
              fill: fillRect,
              stroke: strokeRect,
              radius: 2,
              cursor: 'pointer',
            },
          });


          const stateText = group.addShape('text', {
            zIndex: 4,
            attrs: {
              text: cfg.state,
              x: 19,
              y: 19,
              fontSize: 12,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: stateColor,
              cursor: 'pointer',
              tooltip: cfg.state,
            },
          });

          const stateBBox = stateText.getBBox();
          const stateRight = cfg.count ? 20 : 12;

          stateText.attr({
            x: 224 - stateRight - stateBBox.width,
          });


          /* stateBox */
          stateRect.attr({
            x: 224 - stateRight - stateBBox.width - 4,
            y: stateBBox.minY - 5,
            width: stateBBox.width + 8,
            height: stateBBox.height + 10,
          });

          if (cfg.state === '在线') {
            const stateRect1 = group.addShape('rect', {
              zIndex: 1,
              attrs: {
                fill: fillRect,
                stroke: strokeRect,
                radius: 2,
                cursor: 'pointer',
                opacity: 0.6,
              },
            });

            const stateRect2 = group.addShape('rect', {
              zIndex: 2,
              attrs: {
                fill: fillRect,
                stroke: strokeRect,
                radius: 2,
                cursor: 'pointer',
                opacity: 0.6,
              },
            });

            const stateRect3 = group.addShape('rect', {
              zIndex: 3,
              attrs: {
                fill: fillRect,
                stroke: strokeRect,
                radius: 2,
                cursor: 'pointer',
                opacity: 0.6,
              },
            });
            stateRect1.attr({
              x: 224 - stateRight - stateBBox.width - 4,
              y: stateBBox.minY - 5,
              width: stateBBox.width + 8,
              height: stateBBox.height + 10,
            });
            stateRect2.attr({
              x: 224 - stateRight - stateBBox.width - 4,
              y: stateBBox.minY - 5,
              width: stateBBox.width + 8,
              height: stateBBox.height + 10,
            });
            stateRect3.attr({
              x: 224 - stateRight - stateBBox.width - 4,
              y: stateBBox.minY - 5,
              width: stateBBox.width + 8,
              height: stateBBox.height + 10,
            });

            group.sort(); // 排序，根据zIndex 排序
            stateRect1.animate({ // 逐渐放大，并消失
              x: 224 - stateRight - stateBBox.width - 4 - 8,
              y: stateBBox.minY - 5 - 8,
              width: stateBBox.width + 8 + 16,
              height: stateBBox.height + 10 + 16,
              opacity: 0.1,
              repeat: true, // 循环
            }, 3000, 'easeCubic', null, 0); // 无延迟

            stateRect2.animate({ // 逐渐放大，并消失
              x: 224 - stateRight - stateBBox.width - 4 - 8,
              y: stateBBox.minY - 5 - 8,
              width: stateBBox.width + 8 + 16,
              height: stateBBox.height + 10 + 16,
              opacity: 0.1,
              repeat: true, // 循环
            }, 3000, 'easeCubic', null, 1000); // 1 秒延迟

            stateRect3.animate({ // 逐渐放大，并消失
              x: 224 - stateRight - stateBBox.width - 4 - 8,
              y: stateBBox.minY - 5 - 8,
              width: stateBBox.width + 8 + 16,
              height: stateBBox.height + 10 + 16,
              opacity: 0.1,
              repeat: true, // 循环
            }, 3000, 'easeCubic', null, 2000); // 2 秒延迟
          }
        }

        if (cfg.count) {
          const countRect = group.addShape('circle', {
            attrs: {
              fill: config.borderColor,
              cursor: 'pointer',
            },
          });

          const countText = group.addShape('text', {
            attrs: {
              text: cfg.count,
              x: 224,
              y: 0,
              fontSize: 12,
              textAlign: 'left',
              fontWeight: 'bold',
              textBaseline: 'middle',
              fill: '#FFF',
            },
          });

          const countBBox = countText.getBBox();

          countText.attr({
            x: 224 - countBBox.width / 2,
          });

          /* stateBox */
          countRect.attr({
            x: 224,
            y: 0,
            r: countBBox.width / 2 + 2,
          });
        }

        /* 下面的文字 */
        const remarkText = group.addShape('text', {
          attrs: {
            text: cfg.keyInfo,
            x: 19,
            y: cfg.keyInfo2 ? 45 : 52,
            fontSize: cfg.keyInfo2 ? 12 : 14,
            textAlign: 'left',
            textBaseline: 'middle',
            fill: config.fontColor,
            cursor: 'pointer',
            className: 'remarkText1',
          },
        });

        if (cfg.keyInfo2) {
          /* 下面的文字2 */
          const remarkText2 = group.addShape('text', {
            attrs: {
              text: cfg.keyInfo2,
              x: 19,
              y: 60,
              fontSize: 12,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: type === 4 ? '#C96E57' : config.fontColor,
              cursor: 'pointer',
              className: 'remarkText2',
            },
          });
        }
        const num = (cfg.FinishedRate && cfg.FinishedRate.replace('%', '') - 0) / 100 || 0;
        if (cfg.FinishedRate) {
          const rateRectLeft = group.addShape('rect', {
            attrs: {
              x: 30,
              y: 70,
              fill: '#AFD5FF',
              cursor: 'pointer',
              width: 5,
              height: 5,
            },
          });

          const rateRectRight = group.addShape('rect', {
            attrs: {
              x: 199,
              y: 70,
              fill: '#AFD5FF',
              cursor: 'pointer',
              width: 5,
              height: 5,
            },
          });
          const rateRect = group.addShape('rect', {
            attrs: {
              x: 5,
              y: 75,
              fill: '#AFD5FF',
              radius: 2,
              cursor: 'pointer',
              width: 221,
              height: 30,
            },
          });
          const progressRect = group.addShape('rect', {
            attrs: {
              x: 15,
              y: 80,
              fill: '#B8B7B8',
              radius: 2,
              cursor: 'pointer',
              width: 150,
              height: 20,
            },
          });
          const progress = group.addShape('rect', {
            attrs: {
              x: 15,
              y: 80,
              fill: live ? (num <= 1 ? '#40B318' : '#1890FF') : '#E1E0E1',
              radius: 2,
              cursor: 'pointer',
              width: parseInt(num * 150, 0),
              height: 20,
            },
          });
          const progressText = group.addShape('text', {
            attrs: {
              text: cfg.FinishedRate,
              x: 170,
              y: 91,
              fontSize: 12,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000',
              cursor: 'pointer',
            },
          });

          const rateText = group.addShape('text', {
            attrs: {
              text: `${cfg.BackupRate}MB/s`,
              x: 60,
              y: 91,
              fontSize: 12,
              textAlign: 'left',
              textBaseline: 'middle',
              fill: '#000000',
              cursor: 'pointer',
            },
          });
        }

        const hasChildren = cfg.children && cfg.children.length > 0;
        if (hasChildren) {
          this.nodeBasicMethod.createNodeMarker(group, cfg.collapsed, 236, 35);
        }
        return container;
      },
      afterDraw: this.nodeBasicMethod.afterDraw,
      setState: this.nodeBasicMethod.setState,
    }, 'single-shape');
  }

  render() {
    return (
      <Card title="antv">
        <div id="mountNode"></div>
      </Card>
    );
  }
}

export default AntvDemo;
