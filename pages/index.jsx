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

	return (
  	<Layout footerMenu={menuItems} headerMenu={headerNewItem}>
    <section id="slider-section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-lg-6 desktop-only">
            <div className="row top30">
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/01.jpg" alt="image" />
                  <h4>New To StanCERA</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/02.jpg" alt="image"/>
                  <h4>Mid-Career</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/03.jpg" alt="image"/>
                  <h4>Life Events & Job Changes</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/04.jpg" alt="image"/>
                  <h4>Nearing Retirement</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/05.jpg" alt="image"/>
                  <h4>Retired</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/05.jpg" alt="image"/>
                  <h4>Life or Career Change</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 col-lg-6 about-slider">
            <div id="about_single" className="owl-carousel top30">
              <div className="item">
                <div className="content-right-md">
                  <figure className="effect-layla">
                    <img className="img-fluid" src="/img/slide-2.jpg" alt="img" />
                    <figcaption>
                      <h2 className="mb-2">Virtual seminar: planning for <br/> retirement </h2>
                      <p className="mb-4">Search for our seminars and webinars by topic or interest, or browse <br/> through our video library. </p>
                      <button type="submit" className="VedioLibrary">Vedio Library</button>
                    </figcaption>
                  </figure>
                </div>
              </div>
              <div className="item">
                <div className="content-right-md">
                  <figure className="effect-layla">
                    <img className="img-fluid" src="/img/slide-2.jpg" alt="img" />
                    <figcaption>
                      <h2 className="mb-2">Virtual seminar: planning for <br/> retirement </h2>
                      <p className="mb-4">Search for our seminars and webinars by topic or interest, or browse <br/> through our video library. </p>
                      <button type="submit" className="VedioLibrary">Vedio Library</button>
                    </figcaption>
                  </figure>
                </div>
              </div>
              <div className="item">
                <div className="content-right-md">
                  <figure className="effect-layla">
                    <img className="img-fluid" src="/img/slide-2.jpg" alt="img" />
                    <figcaption>
                      <h2 className="mb-2">Virtual seminar: planning for <br/> retirement </h2>
                      <p className="mb-4">Search for our seminars and webinars by topic or interest, or browse <br/> through our video library. </p>
                      <button type="submit" className="VedioLibrary">Vedio Library</button>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mobile-only">
            <div className="row top30">
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/01.jpg" alt="image"/>
                  <h4>New To StanCERA</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/02.jpg" alt="image"/>
                  <h4>Mid-Career</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/03.jpg" alt="image"/>
                  <h4>Life Events & Job Changes</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/04.jpg" alt="image"/>
                  <h4>Nearing Retirement</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/05.jpg" alt="image"/>
                  <h4>Retired</h4>
                </div>
              </div>
              <div className="col-md-4 col-sm-4 col-xs-6 text-center">
                <div className="catagory-box">
                  <img className="img-fluid" src="/img/05.jpg" alt="image"/>
                  <h4>Life or Career Change</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
    </section>
    <section id="latest-news" className="bg_light padding">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 text-center mb-5">
            <h2>Latest News</h2>
            <p className="heading_space">Check out the latest news, updates, & reports from StanCERA</p>
          </div>
        </div>
        <div className="row mobile-only">
          <div className="col-xs-12">
            <div className="news_item bottom40">
              <div className="news_content">
                <div className="news_text">
                  <h5>News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                  <h3>
                    <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                  </h3>
                  <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                  <div className="float-left">
                    <p className="prop-user">
                      <a href="#">
                        <i className="fa fa-angle-left"></i> Find out more </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12">
            <div className="news_item bottom40">
              <div className="news_content">
                <div className="news_text">
                  <h5>News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                  <h3>
                    <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                  </h3>
                  <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                  <div className="float-left">
                    <p className="prop-user">
                      <a href="#">
                        <i className="fa fa-angle-left"></i> Find out more </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xs-12">
            <div className="news_item bottom40">
              <div className="news_content">
                <div className="news_text">
                  <h5>News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                  <h3>
                    <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                  </h3>
                  <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                  <div className="float-left">
                    <p className="prop-user">
                      <a href="#">
                        <i className="fa fa-angle-left"></i> Find out more </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row desktop-only">
          <div id="news-slider" className="owl-carousel">
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5>News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="news_item bottom40">
                <div className="news_content">
                  <div className="news_text">
                    <h5> News <span className="bullet-circle">•</span> October 29, 2022 </h5>
                    <h3>
                      <a href="#">Alameda Decision <br/> Update : Active <br/> Members </a>
                    </h3>
                    <p>Lorem ipsum dolor sit amet, <br/> consectetur adipiscing elit, sed do <br/> eiusmod </p>
                    <div className="float-left">
                      <p className="prop-user">
                        <a href="#">
                          <i className="fa fa-angle-left"></i> Find out more </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
    <section id="timeline" className="padding">
  <div className="container">
    <div className="row">
      <div className="col-xs-12 text-center">
        <h2>Life Events</h2>
        <p className="sub-heading"> Life is full of excitement, twists, and turns. Click on any of the <br/> common milestones listed here for insights and guidance on <br/> how they might affect your plan. </p>
        <button type="submit" className="mobile-only view-more-btn">View More</button>
      </div>
    </div>
    <div className="row">
      <div className="col-md-6 col-lg-4 mobile-only">
        <ul className="fa-ul">
          <li>
            <i className="fa fa-check"></i> MARRIAGE
          </li>
          <li>
            <i className="fa fa-check"></i> BIRTH / ADOPTION
          </li>
          <li>
            <i className="fa fa-check"></i> DIVORCE
          </li>
          <li>
            <i className="fa fa-check"></i> ILLNESS / DISABILITY
          </li>
          <li>
            <i className="fa fa-check"></i> JOB CHANGE
          </li>
          <li>
            <i className="fa fa-check"></i> DEATH
          </li>
        </ul>
      </div>
      <div className="steps-timeline text-center display-none">
        <div className="steps-one">
          <div className="end-circle back-orange"></div>
          <div className="step-wrap">
            <div className="steps-stops">
              <div className="verticle-line back-orange"></div>
            </div>
          </div>
          <div className="pane-warp back-blue">
            <div className="steps-pane">
              <img src="/img/icon01.jpg" />
            </div>
          </div>
          <div className="inverted-pane-warp back-blue">
            <div className="inverted-steps-pane">
              <p>Marriage</p>
            </div>
          </div>
        </div>
        <div className="steps-two">
          <div className="step-wrap">
            <div className="steps-stops">
              <div className="verticle-line back-orange"></div>
            </div>
          </div>
          <div className="pane-warp back-orange">
            <div className="steps-pane">
              <img src="/img/icon01.jpg" />
            </div>
          </div>
          <div className="inverted-pane-warp back-orange">
            <div className="inverted-steps-pane">
              <p>Birth / Adoption</p>
            </div>
          </div>
        </div>
        <div className="steps-three">
          <div className="step-wrap">
            <div className="steps-stops">
              <div className="verticle-line back-orange"></div>
            </div>
          </div>
          <div className="pane-warp back-blue">
            <div className="steps-pane">
              <img src="/img/icon01.jpg" />
            </div>
          </div>
          <div className="inverted-pane-warp back-blue">
            <div className="inverted-steps-pane">
              <p>Divorce</p>
            </div>
          </div>
        </div>
        <div className="steps-four">
          <div className="step-wrap">
            <div className="steps-stops">
              <div className="verticle-line back-orange"></div>
            </div>
          </div>
          <div className="pane-warp back-orange">
            <div className="steps-pane">
              <img src="/img/icon01.jpg" />
            </div>
          </div>
          <div className="inverted-pane-warp back-orange">
            <div className="inverted-steps-pane">
              <p>Illness / Disability</p>
            </div>
          </div>
        </div>
        <div className="steps-five">
          <div className="inverted-end-circle back-orange"></div>
          <div className="step-wrap">
            <div className="steps-stops">
              <div className="verticle-line back-orange"></div>
            </div>
          </div>
          <div className="pane-warp back-blue">
            <div className="steps-pane">
              <img src="/img/icon01.jpg" />
            </div>
          </div>
          <div className="inverted-pane-warp back-blue">
            <div className="inverted-steps-pane">
              <p>Job Change</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<section id="upcoming" className="padding">
  <div className="container">
    <div className="row">
      <div className="col-sm-1 col-md-2"></div>
      <div className="col-xs-12 col-sm-10 col-md-8 text-center">
        <h2>Upcoming Meetings <span className="display-none">& Events</span>
        </h2>
      </div>
      <div className="col-sm-1 col-md-2"></div>
    </div>
    <div className="row mb-4">
      <div className="col-lg-12 text-center">
        <ul className="upcoming-events">
          <li>
            <i className="fa fa-file"></i> Most Recent Agenda
          </li>
          <li>
            <i className="fa fa-calendar"></i> Full Calendar
          </li>
        </ul>
      </div>
    </div>
    <div className="row">
      <div className="col-md-4">
        <div className="event-item">
          <div className="event-image">
            <div className="post-date">
              <small className="month">OCT</small>
              <br/>
              <span className="date">10</span>
            </div>
          </div>
          <div className="event-content">
            <div className="event-title mb-15">
              <h3 className="title"> Board of Directors Meeting </h3>
              <span className="ticket-price yellow-color">10:30am PST</span>
              <span className="ticket-price ViewLiveStream">
                <u>
                  <i className="fa fa-wifi"></i> View Live Stream </u>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="event-item">
          <div className="event-image">
            <div className="post-date">
              <small className="month">OCT</small>
              <br/>
              <span className="date">10</span>
            </div>
          </div>
          <div className="event-content">
            <div className="event-title mb-15">
              <h3 className="title"> Board of Directors Meeting </h3>
              <span className="ticket-price yellow-color">10:30am PST</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="event-item">
          <div className="event-image">
            <div className="post-date">
              <small className="month">OCT</small>
              <br/>
              <span className="date">10</span>
            </div>
          </div>
          <div className="event-content">
            <div className="event-title mb-15">
              <h3 className="title"> Board of Directors Meeting </h3>
              <span className="ticket-price yellow-color">10:30am PST</span>
              <span className="ticket-price calcelled">Cancelled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="life-events">
  <div className="container">
    <div className="row">
      <div className="col-md-5 col-lg-3 col-lg-offset-3">
        <h3>Thinking About <br/> Retirement? </h3>
      </div>
      <div className="col-md-1 col-lg-1 text-center">
        <img alt="" src="/img/lines-1.jpg" />
      </div>
      <div className="col-md-6 col-lg-4">
        <ul className="fa-ul">
          <li>Attend a retirement webinar <span className="right-arrow"> &gt;</span>
          </li>
          <li>Calculate your retirement benefit <span className="right-arrow"> &gt;</span>
          </li>
          <li>Apply for Retirements <span className="right-arrow"> &gt;</span>
          </li>
          <li>More FAQs <span className="right-arrow"> &gt;</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
<section className="life-events-img">
  <div className="container-fluid">
    <div className="row">
      <img className="img-fluid" alt="" src="/img/bg-footer-1.jpg" />
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
