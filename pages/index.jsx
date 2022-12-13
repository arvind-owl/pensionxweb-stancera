import { NextSeo } from 'next-seo';
import { setEdgeHeader } from '@pantheon-systems/wordpress-kit';
import axios from "axios";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Layout from '../components/layout';
import Link from 'next/link';
import { getFooterMenu,getHeaderMenu } from '../lib/Menus';
import { getLatestPosts } from '../lib/Posts';
import { REACT_LOADABLE_MANIFEST } from 'next/dist/shared/lib/constants';

export default function Home({ menuItems, posts, headerMenuItems }) {
  const [banner, setBanner] = useState();
  const [postsData, setPostsData]= useState();
  const [categoriesData, setCategoriesData]= useState([]);
  const [eventCategories, setEventCategories] = useState([]);
  const [homePageBannerImage, setHomePageBannerImage] = useState();
  const [eventPosts, setEventPosts] = useState([]);
  const [reloadItem, setReloadItem] = useState(0);
  const [allImages, setAllImage]=useState([]);
  const [isAlreadyImages, setIsAlreadyImages]=useState([]);
    let [currentSlide, setCurrentSlide] = useState(0);
    let [translateVal, setTranslateVal]= useState(0);

    const [headerNewItem, setHeaderNewItem] = useState([]);

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


  useEffect(() => {
   
  },[reloadItem]);
  const activeOwlSide=(index)=>{
    let calTranslate = 0;
    let calNewTranslate = 0;
    if(index==1 || index==0)
    {
      calNewTranslate = 0;
    }
    else if(index == postsData.legnth - 1)
    {
      calNewTranslate = (postsData.legnth - 1) * -25;
    }
    else
    {
      calNewTranslate = -25 * (index - 1);
    }
    
    setCurrentSlide(index);
    setTranslateVal(calNewTranslate);
    setReloadItem(!reloadItem);
  }

  const prevOwlSide=(index)=>{
    
   
    let calTranslate = 0;
    let calNewTranslate = 0;
    if(currentSlide==0)
    {
      calNewTranslate = 0;
      setCurrentSlide(index);
    }
    else if(index == postsData.length - 1)
    {
      calNewTranslate = ((currentSlide - 2) * -25);
      setCurrentSlide(index - 1);
    }
    else
    {
      calNewTranslate = translateVal - (-25);
      setCurrentSlide(index - 1);
    }

    setTranslateVal(calNewTranslate);
    setReloadItem(!reloadItem);
  }

  const nextOwlSide=(index)=>{
    
    let calTranslate = 0;
    let calNewTranslate = 0;
    if((currentSlide)==0)
    {
      calNewTranslate = 0;
      setCurrentSlide(index + 1);
    }
    else if(index == postsData.length - 1)
    {
      calNewTranslate = (postsData.length - 1) * -25;
      setCurrentSlide(0);
    }
    else
    {
      calNewTranslate = -25 * (currentSlide);
      setCurrentSlide(index + 1);
    }
    
    setTranslateVal(calNewTranslate);
    setReloadItem(!reloadItem);
  }
  useEffect(() => {
    axios.get("https://dev-stancera.pantheonsite.io/wp-json/wp/v2/pages?slug=home").then((res) => setBanner(res?.data[0]));
  
    }, []);

    useEffect(() => {
      console.log(banner);
      getPostsByCategories();
      getCategoryNames();
      getEventCategories();
      getEventPosts();
    },[banner]);

	const getEventCategories=()=>{
    axios
    .get(
      "https://dev-stancera.pantheonsite.io/wp-json/wp/v2/eventcategory"
    )
    .then((res) =>setEventCategories(res?.data));
  }
  const  getEventPosts=()=>{
    let categories = banner?.acf?.upcoming_event_event_categories;
  if(categories && categories.length > 0 )
  {
    let categoriesIds = '';
    categories.map((cat,ind)=>{
      if(ind==0)
      {
        categoriesIds = cat;
      }
      else
      {
        categoriesIds = categoriesIds +", "+ cat;
      }
      
    });
    if(categoriesIds)
    {
    axios
    .get(
      "https://dev-stancera.pantheonsite.io/wp-json/wp/v2/event?per_page="+banner?.acf?.upcoming_event_no_of_events+"&categories="+categoriesIds
    )
    .then((res) =>{
      let allupdate = false;
        res?.data && res?.data.length > 0 && res?.data.map((pdata,index)=>{
        let cont = pdata?.content?.rendered;
        res.data[index].content = cont;

        let excerpt = pdata?.excerpt?.rendered;
        res.data[index].excerpt = excerpt;

        let guid = pdata?.guid?.rendered;
        res.data[index].guid = guid;

        let title = pdata?.title?.rendered;
        res.data[index].title = title;
        
        if(index == res?.data.length - 1)
        {
          allupdate = true;
        }
      }) 
      if(allupdate)
      {
        setEventPosts(res?.data);
      }
     
    });
  }
  else
  {
    return 'No Category selected ! Please choose any one category from admin.';
  }

}
else
  {
    return 'No Category selected ! Please choose any one category from admin.';
  }
  }
 
  const getPostsByCategories=()=>{
    let categories = banner?.acf?.stay_informed_post_category;
  if(categories && categories.length > 0 )
  {
    let categoriesIds = '';
    categories.map((cat,ind)=>{
      if(ind==0)
      {
        categoriesIds = cat;
      }
      else
      {
        categoriesIds = categoriesIds +", "+ cat;
      }
      
    });
    if(categoriesIds)
    {
      axios
      .get(
        "https://dev-stancera.pantheonsite.io/wp-json/wp/v2/posts?per_page="+banner?.acf?.stay_informed_no_of_posts+"&categories="+categoriesIds
      )
      .then((res) => { 
        let allupdate = false;
        res?.data && res?.data.length > 0 && res?.data.map((pdata,index)=>{
        let cont = pdata?.content?.rendered;
        res.data[index].content = cont;

        let excerpt = pdata?.excerpt?.rendered;
        res.data[index].excerpt = excerpt;

        let guid = pdata?.guid?.rendered;
        res.data[index].guid = guid;

        let title = pdata?.title?.rendered;
        res.data[index].title = title;
        if(index == res?.data.length - 1)
        {
          allupdate = true;
        }
      }) 
      if(allupdate)
      {
        setPostsData(res?.data);
      }
        
       
     
     
    })
  

  }
  else
  {
    return 'No Category selected ! Please choose any one category from admin.';
  }

}
else
  {
    return 'No Category selected ! Please choose any one category from admin.';
  }
  }
  const  getCategoryNames=()=>{
  axios
  .get(
    "https://dev-stancera.pantheonsite.io/wp-json/wp/v2/categories"
  )
  .then((res) => setCategoriesData(res?.data));
}

const getCatnameById=(id)=>{
  
  let result = categoriesData.filter((ele)=>ele.id==id);
  if(result && result.length > 0 )
  {
    return result[0].name;
  }
  else
  {
    return '';
  }
  
}


const  getEventCatnameById=(id)=>{
  
  let result = eventCategories.filter((ele)=>ele.id==id);
  if(result && result.length > 0 )
  {
    return result[0].name;
  }
  else
  {
    return '';
  }
  
}

const  getEventCatslugById=(id)=>{
  
  let result = eventCategories.filter((ele)=>ele.id==id);
  if(result && result.length > 0 )
  {
    return 'cbp-item '+result[0].slug;
  }
  else
  {
    return 'cbp-item';
  }
  
}
const  getCovertMonthFormat=(dat)=>{
  const months = [
    "JAN", "FEB", 
    "MAR", "APR", "MAY", 
    "JUN", "JUL", "AUG",
    "SEP", "OCT", 
    "NOV", "DEC"
];
let mon = dat.substring(4, 6);

  let dateFormat = months[mon-1];

  return dateFormat;
}

const  getCovertTimeFormat=(tim)=>{
  let time = tim.substring(0, 2);
  let onlytime = tim.substring(0, 5);
  if(time > 12)
  {
      return onlytime+' pm';
  }
  else
  {
    return onlytime+' am';
  }
}

const  getImageUrl=(imageId)=> {
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
      const getMediaUrlById=(id)=>{
       
  let isAlready = false;
        isAlreadyImages && isAlreadyImages.length > 0 && isAlreadyImages.map((item)=>{
          
            if(item==id)
            {
                isAlready = true;
            }
            
        });
      
        if(!isAlready)
            {
              setIsAlreadyImages((arr) => [...arr,id]);
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
  
   setAllImage((arr) => [...arr,newImageArray]);
    setReloadItem(!reloadItem);
  }
})
            }
  
}

const getCovertDateFormat=(dat)=>{
  
let date = dat.substring(6);

  let dateFormat = date;

  return dateFormat;
}
function createMarkup(html) {
  return { __html: html };
}
	return (
  	<Layout footerMenu={menuItems} headerMenu={headerNewItem}>
    <section id="slider-section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-lg-6 desktop-only">
            <div className="row top30">
              {banner?.acf?.homepage_slider_boxes && banner?.acf?.homepage_slider_boxes.length > 0 && banner?.acf?.homepage_slider_boxes.map((item,index)=>{
                  return(
                  <div key={index} className="col-md-4 col-sm-4 col-xs-6 text-center">
                  <div className="catagory-box">
                    <img className="img-fluid" src={getImageUrl(item.homepage_slider_box_image).toString()} alt="image" />
                    <h4>{item.homepage_slider_box_title}</h4>
                  </div>
                </div>);
              })
            }
             
            </div>
          </div>
          <div className="col-md-12 col-lg-6 about-slider">
            <div id="about_single" className="owl-carousel top30">
            {banner?.acf?.homepage_slider_slides && banner?.acf?.homepage_slider_slides.length > 0 && banner?.acf?.homepage_slider_slides.map((slide,index)=>{
                  return(
              <div key={index} className="item">
                <div className="content-right-md">
                  <figure className="effect-layla">
                    <img className="img-fluid" src={getImageUrl(slide.homepage_slider_slide_image).toString()} alt="img" />
                    <figcaption>
                      <h2 className="mb-2" dangerouslySetInnerHTML={createMarkup(slide.homepage_slider_slide_heading)} ></h2>
                      <p className="mb-4" dangerouslySetInnerHTML={createMarkup(slide.homepage_slider_slide_content)}></p>
                      <Link href={slide.homepage_slider_slide_button_link} className="VedioLibrary"><a className="VedioLibrary">{slide.homepage_slider_slide_button_text}</a></Link>
                    </figcaption>
                  </figure>
                </div>
              </div>
                  );})
}
            </div>
          </div>
          <div className="col-md-6 mobile-only">
            <div className="row top30">
            {banner?.acf?.homepage_slider_boxes && banner?.acf?.homepage_slider_boxes.length > 0 && banner?.acf?.homepage_slider_boxes.map((item,index)=>{
                  return(
                  <div key={index} className="col-md-4 col-sm-4 col-xs-6 text-center">
                  <div className="catagory-box">
                    <img className="img-fluid" src={getImageUrl(item.homepage_slider_box_image).toString()} alt="image" />
                    <h4>{item.homepage_slider_box_title}</h4>
                  </div>
                </div>);
              })
            }
              
            </div>
          </div>
        </div>
        </div>
    </section>
    <section id="latest-news" className="bg_light padding">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 text-center mb-5">
            <h2>{banner?.acf?.stay_informed_title}</h2>
            <p className="heading_space" dangerouslySetInnerHTML={createMarkup(banner?.acf?.stay_informed_content)} />
          </div>
        </div>
        <div className="row mobile-only">
        {
        postsData && postsData.length > 0 && postsData.map((post,index)=>{
                    return(
                      <div key={index} className="col-xs-12">
                      <div className="news_item bottom40">
                        <div className="news_content">
                          <div className="news_text">
                            <h5>{post?.categories.length > 0 && post?.categories.map((cat,ind)=>{
                                             if(ind==0)
                                             {
                                              return(<span key={ind}>{getCatnameById(cat)}</span>)
                                             }else
                                             {
                                              return(<span key={ind}>, {getCatnameById(cat)}</span>)
                                              
                                             } 
                                        }) }<span className="bullet-circle">•</span>{post?.date}</h5>
                            <h3>
                            <Link passHref href={post.slug?post.slug:"#"}><a>{post.title?post.title:'#'}</a></Link>
                            </h3>
                            <p dangerouslySetInnerHTML={createMarkup(post.content?post.content:'#')} />
                            <div className="float-left">
                              <p className="prop-user">
                              <Link passHref href={post.slug?post.slug:"#"}><a>
                                  <i className="fa fa-angle-left"></i> Find out more </a></Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          )

        })
      }
         
         
        </div>
        <div className="row desktop-only">

        {postsData &&
          			<div id="news-slider" className="owl-carousel">
                  <div className='owl-wrapper-outer'>
                    <div className='owl-wrapper' style={{width: (postsData.length*33.33)+'%',left: '0px', display:'flex', transition: 'all 800ms ease 0s', transform: 'translate3d('+translateVal+'%, 0px, 0px)'}}>
                   {postsData.length > 0 && postsData.map((post,index)=>{
                    return(
                          <div key={index} className="owl-item">
                            <div className='item'>
                            <div className="news_item bottom40">
                                    <div className="news_content">
                                      <div className="news_text">
                                      
                                        <h5>{post?.categories.length > 0 && post?.categories.map((cat,index)=>{
                                             if(index==0)
                                             {
                                              return(<span key={index}>{getCatnameById(cat)}</span>)
                                             }else
                                             {
                                              return(<span key={index}>, {getCatnameById(cat)}</span>)
                                              
                                             } 
                                        }) } <span className="bullet-circle">•</span> {post?.date} </h5>
                                        
                                        <h3>
                                          <Link passHref href={post.slug?post.slug:"#"}><a>{post.title?post.title:'#'}</a></Link>
                                        </h3>

                                        <p dangerouslySetInnerHTML={createMarkup(post.content?post.content:'#')} />
                                        <div className="float-left">
                                          <p className="prop-user">
                                          <Link passHref href={post.slug?post.slug:"#"}><a><i className="fa fa-angle-left"></i> Find out more</a></Link>
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                </div>
                    )

                  })}
            			</div>
                  </div>
                  <div className="owl-controls clickable">
                    <div className="owl-pagination">
                    {postsData.length > 0 && postsData.map((post,index)=>{
                     return( <div key={index} className={currentSlide == index ?"active owl-page": "owl-page"} onClick={()=>{activeOwlSide(index)}}>
                        <span ></span>
                        </div>);
                    })}
                      
                    </div>
                  <div className="owl-buttons">
                    <div className ={currentSlide == 0?"owl-prev disabled":"owl-prev"} onClick={()=>{ prevOwlSide(currentSlide)}}>
                      <i className="fa fa-angle-left"></i>
                    </div>
                    <div className={currentSlide == postsData.length - 1 ?"owl-next disabled" : "owl-next"}  onClick={()=>{nextOwlSide(currentSlide)}}>
                      <i className="fa fa-angle-right"></i>
                    </div>
                </div>
              </div>
                </div>
            }

        </div>
      </div>
    </section>
    <section id="timeline" className="padding">
  <div className="container">
    <div className="row">
      <div className="col-xs-12 text-center">
        <h2>{banner?.acf?.life_event_title}</h2>
        <p className="sub-heading" dangerouslySetInnerHTML={createMarkup(banner?.acf?.life_event_content)} />
        <Link href={banner?.acf?.life_event_button_link? (banner?.acf?.life_event_button_link).toString():"#"} className="mobile-only view-more-btn"><a className="mobile-only view-more-btn">{banner?.acf?.life_event_button_text}</a></Link>
                    
      </div>
    </div>
    <div className="row">
      <div className="col-md-6 col-lg-4 mobile-only" dangerouslySetInnerHTML={createMarkup(banner?.acf?.life_event_content)} />
       
      <div className="steps-timeline text-center display-none" dangerouslySetInnerHTML={createMarkup(banner?.acf?.life_event_content)} />
    </div>
  </div>
</section>
<section id="upcoming" className="padding">
  <div className="container">
    <div className="row">
      <div className="col-sm-1 col-md-2"></div>
      <div className="col-xs-12 col-sm-10 col-md-8 text-center">
        <h2>{banner?.acf?.upcoming_event_title}</h2>
      </div>
      <div className="col-sm-1 col-md-2"></div>
    </div>
    <div className="row mb-4">
      <div className="col-lg-12 text-center" dangerouslySetInnerHTML={createMarkup(banner?.acf?.upcoming_event_extra_content)} />

    </div>
    <div className="row">
    {eventPosts && eventPosts.length > 0 && eventPosts.map((event,ind)=>{

return( 
<div key={ind} className="col-md-4">
        <div className="event-item">
          <div className="event-image">
            <div className="post-date">
              <small className="month">{getCovertMonthFormat(event?.acf.event_date)}</small>
              <br/>
              <span className="date">{getCovertDateFormat(event?.acf.event_date)}</span>
            </div>
          </div>
          <div className="event-content">
            <div className="event-title mb-15">
              <h3 className="title"> {event?.title} </h3>
              <span className="ticket-price yellow-color">{getCovertTimeFormat(event?.acf.event_time)} PST</span>
              <span className="ticket-price">
                <Link href="#"><a>
                  <i className="fa fa-wifi">
                    </i> View Live Stream </a>
                    </Link>
                
              </span>
            </div>
          </div>
        </div>
      </div>
)

})}
      
    </div>
  </div>
</section>

<section className="life-events">
  <div className="container">
    <div className="row">
      <div className="col-md-5 col-lg-3 col-lg-offset-3">
        <h3>{banner?.acf?.thinking_about_title}</h3>
      </div>
      <div className="col-md-1 col-lg-1 text-center">
        <img alt="" src="/img/lines-1.jpg"  />
      </div>
      <div className="col-md-6 col-lg-4" dangerouslySetInnerHTML={createMarkup(banner?.acf?.thinking_about_extra_content)} />
    </div>
  </div>
</section>
<section className="life-events-img">
  <div className="container-fluid">
    <div className="row">
      <img className="img-fluid" alt="" src={getImageUrl(banner?.acf?.thinking_about_image)} />
    </div>
  </div>
</section>

	</Layout>
	);
}

export async function getServerSideProps({ res }) {
	const menuItems = await getFooterMenu();
	const headerMenuItems = await getHeaderMenu();
	const posts = await getLatestPosts(12);
	setEdgeHeader({ res });

	return {
		props: {
			menuItems,
			headerMenuItems,
			posts,
		},
	};
}
