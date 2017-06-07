'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
	this.assign('url',"/");//得到data
	//获取菜单信息
	this.assign('menu',this.model("menu").order('code').select());
    return this.display();
  }
}