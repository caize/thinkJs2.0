'use strict';
import Base from './base.js';
import fs from 'fs';
import path from 'path';
export default class extends Base {
	
	async indexAction(){
	  let model =  this.model("file");//加载model
	  let currentPage =  this.http.param('page');
	  let map = [];//查询条件的封装
	  map['name'] =   new Array('like','%'+ this.http.param('searchText')+'%');
	  let data  =  await model.where(map).limit(10*(currentPage-1),10).select();
	  let dataCount =  await model.where(map).page(currentPage,10).countSelect();//获取总页数
	  this.assign('data',data);//得到data
	  this.assign('searchText',this.http.param('searchText'));//返回查询条件
	  this.assign('dataCount',dataCount);//得到总页数
	  this.assign('url',"/file");//得到data
	  //获取菜单信息
	  this.assign('menu',this.model("menu").order('code').select());
	  return  this.display();
	}
	
	async addAction(){
	  let model = this.model('file');
	  let id = this.http.param('id');
	  let intro = this.http.param('intro');
	  
	  let file = this.file("file");
	  let name = file.originalFilename;
	  let filePath = file.path;
	  let size  = file.size;
	  if(id!=''){
		  await model.where({id: id}).update({
			   intro: intro
		  });
		  this.redirect('/file/edit?id='+id+"&flag=1", 302);
	  }else{
		  // 创建读取流
	      let readable = fs.createReadStream( filePath );
	      // 创建写入流
	      let writable = fs.createWriteStream(path.join(think.UPLOAD_PATH, path.basename(filePath)));    
	      // 通过管道来传输流
	      readable.pipe( writable );
	      //修改filePath
	      filePath = think.UPLOAD_PATH+ path.basename(filePath);
		  await model.add({
			   name : name,
			   path : filePath,
			   size : size,
			   intro: intro
		  });
		  this.redirect('/file/index', 302);
	  }
	}
	
	async editAction(){
	  let model = this.model("file");//加载model
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
	  this.assign('url',"/file");//得到data
	  //获取菜单信息
	  this.assign('menu',this.model("menu").order('code').select());
	  return  this.display()
	}
	
	async delAction(){
	  let model = this.model("file");//加载model
	  let id = this.http.param('id');
	  let data =  await model.where({id: id}).delete();
	  this.redirect('/file/index', 302);
	}
	
	async loadAction(){
	  let fileName = this.http.param('path').substring(this.http.param('path').lastIndexOf('/'));
	  let filePath = think.UPLOAD_PATH + fileName;
	  this.download(filePath);//不支持中文名称
	}
}