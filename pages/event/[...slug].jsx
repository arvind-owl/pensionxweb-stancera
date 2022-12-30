import { NextSeo } from 'next-seo';
import { setEdgeHeader } from '@pantheon-systems/wordpress-kit';
import { ContentWithImage } from '@pantheon-systems/nextjs-kit';
import { IMAGE_URL } from '../../lib/constants';
import axios from "axios";
import Head from "next/head";
import Layout from '../../components/layout';
import Link from 'next/link';
import { getFooterMenu, getHeaderMenu } from '../../lib/Menus';
import { getEventBySlug } from '../../lib/Posts';
import React, { useState, useEffect } from "react";

export default function PostTemplate({ menuItems, post, headerMenuItems }) {

	let [pageContent,setPageContent]= useState([]);
	const [isAlreadyImages, setIsAlreadyImages]=useState([]);
	const [allImages, setAllImage]=useState([]);
	const [headerNewItem, setHeaderNewItem] = useState([]);
	const [reloadItem, setReloadItem] = useState(0);
	useEffect(()=>{
		getMainMenus();

	},[])
	const getMainMenus = ()=>{
		axios
		.get(
		  "https://dev-stancera.pantheonsite.io/wp-json/menus/v1/menus/4/?nested=1"
		)
		.then((res) => setHeaderNewItem(res?.data));
	}
	useEffect(()=>{
		
		if(post)
		{
		 let uri = post;
		 axios.get("https://dev-stancera.pantheonsite.io/wp-json/wp/v2/event?slug="+uri+"").then((res)=>{
			
			res?.data && res?.data.length > 0 && res?.data.map((pdata,index)=>{
				let cont = pdata?.content?.rendered;
				res.data[index].content = cont;
		
				let excerpt = pdata?.excerpt?.rendered;
				res.data[index].excerpt = excerpt;
		
				let guid = pdata?.guid?.rendered;
				res.data[index].guid = guid;
		
				let title = pdata?.title?.rendered;
				res.data[index].title = title;

				res.data[index].type = null;
				if(index == res?.data.length - 1)
				{
					pageContent= (res?.data);
					
					setPageContent(pageContent);
				}
			});
			
		})

		}
	},[post]);
	function getUrlSlug(url)
	{
	  let slug='';
	  let urlArray = url.split('/');
	  let urlLength = urlArray.length;
	  slug = urlArray[urlLength - 2];
	  return slug;
	}
	function createMarkup(html) {
		    return { __html: html };
		  }
		  function getImageUrl(imageId)
      {
        let isAlready = false;
        isAlreadyImages && isAlreadyImages.length > 0 && isAlreadyImages.map((item)=>{
          
            if(item==imageId)
            {
                isAlready = true;
            }
            
        });
        if(!isAlready)
            {
              getMediaUrlById(imageId);
            }
        let srcurl = allImages && allImages.filter((item)=>item.id==imageId);
     
        let url = srcurl && srcurl.length > 0  && srcurl[0] && srcurl[0].Url;
        return url;

      }
function getMediaUrlById(id)
{
  let isAlready = false;
        isAlreadyImages && isAlreadyImages.length > 0 && isAlreadyImages.map((item)=>{
          
            if(item==id)
            {
                isAlready = true;
            }
            
        });
        if(!isAlready)
            {
				if(id!=null && id!=undefined && id!='')
          {
axios.get("https://dev-stancera.pantheonsite.io/wp-json/wp/v2/media/"+id).then((res)=>{
  
  if(res)
  {
   let pdata = res.data;
  let cont = pdata?.content?.rendered;
  pdata.content = cont;

  let excerpt = pdata?.excerpt?.rendered;
  pdata.excerpt = excerpt;

  let guid = pdata?.guid?.rendered;
  pdata.guid = guid;

  let title = pdata?.title?.rendered;
  pdata.title = title;

  let newImageArray = {'id':id,"Url":pdata.guid};
   setIsAlreadyImages((arr) => [...arr,id]);
   setAllImage((arr) => [...arr,newImageArray]);
    setReloadItem(!reloadItem);
  }
})
		    }  }
  
}

const getConvertDateFormat = (dat)=>{
           
	let mon = dat.substring(4, 6);
	
		let month = mon;
	
		let date = dat.substring(6);
		let year = dat.substring(0,4);
		let returnFormat = year+"-"+month+"-"+date;


		return returnFormat;

}
	return (
		<Layout footerMenu={menuItems} headerMenu={headerNewItem}>
			 <head dangerouslySetInnerHTML={{
                __html: pageContent[0]?.yoast_head,
              }} />		
			  <main className="mb-auto postContent">  
			<h1>{pageContent && pageContent[0]?.title}</h1>
			<div dangerouslySetInnerHTML={createMarkup(pageContent && pageContent[0]?.content)} />
			<div className='eventDateTimeDetails'>
			<div className="main-title">
				<h4>Date : {pageContent && pageContent[0]  && getConvertDateFormat(pageContent && pageContent[0]?.acf?.event_date)}</h4>
				<h4>Time : {pageContent && pageContent[0]?.acf?.event_time}</h4>
				</div>

				</div>
			{(pageContent && pageContent.length > 0 && pageContent[0]?.acf?.page_template == 'right' || pageContent && pageContent.length > 0 && pageContent[0]?.acf?.page_template == 'leftright') ? 
			<div className="col-xl-3 col-lg-4">
					{pageContent[0]?.acf?.right_sidebar_boxes && pageContent[0]?.acf?.right_sidebar_boxes.length > 0 ? 
						pageContent[0]?.acf?.right_sidebar_boxes.map((item,index)=>{
							if(item.image || item.title || item.description)
							{
							return(
								<>
								<Link passHref href={item.url?item.url:'/'} className="AsideCardsMain" >
								<a><div className="col ">
									{ item.image ? <img src={getImageUrl(item.image).toString()} alt="" />:'' }
								<div className="AsideCards" style={{'background':item.background_color?item.background_color:''}}>
									<h5>{item.title}</h5>
									<p dangerouslySetInnerHTML={createMarkup(item.description)} />
								</div>
							</div></a>
							</Link>
							</>
							);
							}
						}):'There are no Items available.' }
						
   
    </div>

:''}   </main>	 
		</Layout>
	);
}

export async function getServerSideProps({ params, res }) {
	const menuItems = await getFooterMenu();
	
	const headerMenuItems = await getHeaderMenu();
	const { slug } = params;
	const post = await getEventBySlug(slug);
	
	setEdgeHeader({ res });

	if (!post) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			menuItems,
			headerMenuItems,
			post,
		},
	};
}
