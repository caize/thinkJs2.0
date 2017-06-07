'use strict';
import Base from './base.js';
import fs from 'fs';
import path from 'path';
export default class extends Base {
	
	async indexAction(){
	  let model =  this.model("image");//加载model
	  let currentPage =  this.http.param('page');
	  let map = [];//查询条件的封装
	  map['name'] =   new Array('like','%'+ this.http.param('searchText')+'%');
	  let data  =  await model.where(map).limit(12*(currentPage-1),12).order('code').select();
	  let dataCount =  await model.where(map).page(currentPage,12).countSelect();//获取总页数
	  this.assign('data',data);//得到data
	  this.assign('searchText',this.http.param('searchText'));//返回查询条件
	  this.assign('dataCount',dataCount);//得到总页数
	  this.assign('url',"/image");
	  //获取菜单信息
	  this.assign('menu',this.model("menu").order('code').select());
	  return  this.display();
	}
	
	async addAction(){
	  let model = this.model('image');
	  let id  = this.http.param('id');
	  let code  = this.http.param('code');
	  
	  let file = this.file("file");
	  let name = file.originalFilename;
	  let filePath = file.path;
	  if(id!=''){
		  await model.where({id: id}).update({
			   code:code
		  });
		  this.redirect('/image/edit?id='+id+"&flag=1", 302);
	  }else{
		  // 创建读取流
		 
	      let readable = fs.createReadStream( filePath );
	      // 创建写入流
	      let writable = fs.createWriteStream(path.join(think.RESOURCE_PATH + think.UPLOAD_IMG_PATH, path.basename(filePath)));    
	      // 通过管道来传输流
	      readable.pipe( writable );
	      //修改filePath
	      filePath = think.UPLOAD_IMG_PATH+ path.basename(filePath);
		  await model.add({
			   name:name,
			   path:filePath,
			   code:code
		  });
		  this.redirect('/image/index', 302);
	  }
	}
	
	async editAction(){
	  let model = this.model("image");//加载model
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
	  this.assign('url',"/image");//得到data
	  //获取菜单信息
	  this.assign('menu',this.model("menu").order('code').select());
	  return  this.display()
	}
	
	async delAction(){
	  let model = this.model("image");//加载model
	  let id = this.http.param('id');
	  let data =  await model.where({id: id}).delete();
	  this.redirect('/image/index', 302);
	}
	
	async loadAction(){
	  let fileName = this.http.param('path').substring(this.http.param('path').lastIndexOf('/'));
	  let filePath =  think.RESOURCE_PATH + think.UPLOAD_IMG_PATH + fileName;
	  this.download(filePath);//不支持中文名称
	}
	
	async isbackAction(){
		let model = this.model("image");//加载model
		let id = this.http.param('id');
		await model.where({isBack: 1}).update({
			 isBack:0
		});
		await model.where({id: id}).update({
			 isBack:1
		});
		this.redirect('/image/index', 302);
	}
}