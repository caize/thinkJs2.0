'use strict';
import Base from './base.js';

export default class extends Base {
	
	async indexAction(){
	  let model =  this.model("menu");//加载model
	  let currentPage =  this.http.param('page');
	  let map = [];//查询条件的封装
	  map['name'] =   new Array('like','%'+ this.http.param('searchText')+'%');
	  let data  =  await model.where(map).limit(10*(currentPage-1),10).order('code').select();
	  let dataCount =  await model.where(map).page(currentPage,10).countSelect();//获取总页数
	  this.assign('data',data);//得到data
	  this.assign('searchText',this.http.param('searchText'));//返回查询条件
	  this.assign('dataCount',dataCount);//得到总页数
	  
	  //获取菜单信息
	  this.assign('menu',this.model("menu").order('code').select());
	  return  this.display();
	}
	
	async addAction(){
	  let model = this.model('menu');
	  let id  = this.http.param('id');
	  let name  = this.http.param('name');
	  let url   = this.http.param('url');
	  let code  = this.http.param('code');
	  if(id!=''){
		  await model.where({id: id}).update({
			   name:name,
			   url:url,
			   code:code
		  });
		  this.redirect('/menu/edit?id='+id+"&flag=1", 302);
	  }else{
		  await model.add({
			   name:name,
			   url:url,
			   code:code
		  });
		  this.redirect('/menu/index', 302);
	  }
	}
	
	async editAction(){
	  let model = this.model("menu");//加载model
	  let id = this.http.param('id');
	  let data =  await model.where({id: id}).find();
	  this.assign('data',data);//得到data
	  if(id == ''){//新增页面
		  this.assign('title',"新增");
	  }else{//修改页面
		  this.assign('title',"修改");
		  if(this.http.param('flag') == 1){//修改之后提示成功
			  this.assign('flag',"1");
		  }
	  }
	  this.assign('url',"/menu");//得到data
	  //获取菜单信息
	  this.assign('menu',this.model("menu").order('code').select());
	  return  this.display()
	}
	
	async delAction(){
	  let model = this.model("menu");//加载model
	  let id = this.http.param('id');
	  let data =  await model.where({id: id}).delete();
	  this.redirect('/menu/index', 302);
	}
}