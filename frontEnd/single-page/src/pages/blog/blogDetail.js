/**
 * blog detail
 *
 */

import './blogDetail.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';
import hljs from '../../js/highlight.js';
import {Init as CommentInit} from '../../comments/index.js';

const template = require('./blogDetailPage.html');

function getData (id, fn) {
  utils.fetch({
    url: '/ajax/blog',
    data: {
      act: 'get_detail',
      format: 'html',
      id: id
    },
    callback: function (err, data) {
      if (!err && data && data.code === 200) {
        let detail = data['detail'];
        detail.time_show = utils.parseTime(detail.time_show, '{y}-{mm}-{dd}');

        fn && fn(null, detail);
      } else {
        fn && fn('博客不存在！');
      }
    }
  });
};

export default function (global, id) {
  let node = global.node;
  getData(id, function (err, detail, title) {
    if (err && !detail) {
      global.push('/');
      global.refresh();
      return;
    }

    global.title(detail.title);
    node.innerHTML = juicer(template, detail);

    // 代码高亮
    utils.each(utils.queryAll('pre code', node), function (codeNode) {
      hljs(codeNode);
    });

    new CommentInit(utils.query('.comments_frame', node), 'blog-' + id, {
      list_num: 8
    });
  });
};
