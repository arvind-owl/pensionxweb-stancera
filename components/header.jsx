import axios from "axios";
import Link from 'next/link';

import dayjs from 'dayjs';
import React, { useState, useEffect,useRef } from "react";
export default function Header({ children, headerMenuItems }) {
    const [headerItem, setHeaderItem] = useState([]);
    const [siteLogo, setSiteLogo] = useState([]);
    const [allImages, setAllImage]=useState([]);
    const [pensionPost, setPensionPost]=useState([]);
  const [reloadItem, setReloadItem] = useState(0);
  const [isAlreadyImages, setIsAlreadyImages]=useState([]);
    useEffect(() => {
        axios
          .get(
            "https://dev-stancera.pantheonsite.io/wp-json/menus/v1/menus/4/?nested=1"
          )
          .then((res) => setHeaderItem(res?.data));
      }, []);
      useEffect(() => {
        axios
          .get(
            "https://dev-stancera.pantheonsite.io/wp-json/"
          )
          .then((res) => setSiteLogo(res?.data));
      }, []);

      useEffect(() => {
        axios
          .get(
            "https://dev-stancera.pantheonsite.io/wp-json/wp/v2/pension_calendar?per_page=1&order=desc&status=publish"
          )
          .then((res) => setPensionPost(res?.data));
     
      }, []);
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
              if(id!='' && id!=null && id!=undefined)
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
  
}



    function getUrlSlug(url)
            {
            let slug='';
            let urlArray = url.split('//');
            
            
            let urlNewArray = urlArray[1].split('/');
            let urlLength = urlNewArray.length;
            if(urlLength > 3)
            {
                slug = urlNewArray[urlLength - 3]+'/'+urlNewArray[urlLength - 2];
            }
            else{
                slug = urlNewArray[urlLength - 2];
            }
            
            return slug;
            }

            function createMarkup(html) {
                return { __html: html };
              }


              function translateLanguage(lang) {
                googleTranslateElementInit();
                const frame = document.getElementsByClassName("goog-te-menu-frame")[0];
                if (!frame) return;
                const items = frame.contentDocument.documentElement.querySelectorAll(
                  ".goog-te-menu2-item"
                );
                items.forEach((element) => {
                  if (lang == element.getElementsByTagName("span")[1].innerText)
                    element.click();
                });
                return false;
              }
            
              const googleTranslateElementInit = () => {

                new window.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
                },
                'google_translate_element');
        
            }
              useEffect(() => {
                var addScript = document.createElement('script');
                addScript.setAttribute('src', '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit');
                document.body.appendChild(addScript);
                window.googleTranslateElementInit = googleTranslateElementInit;
              }, []);

    return (
        <>
          <div className="header-top-bar text-white d-none d-sm-block">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-end text-sm-center">
            <ul className="top-left-content">
              <li>
                <i className="fa fa-calendar"></i> Pension Payment Calendar <span className="check-mailed"> - Check Mailed <b>{(pensionPost?.length > 0 && pensionPost[0].acf?.check_mail_date!='') ? dayjs(pensionPost[0].acf?.check_mail_date).format('MMMM DD') :""}</b>
                </span>
              </li>
              <li className="direct-deposit"> Direct Deposit <b>{(pensionPost?.length > 0 && pensionPost[0].acf?.direct_deposit_date!='') ? dayjs(pensionPost[0].acf?.direct_deposit_date).format('MMMM DD') :""}</b>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
            
      <header id="header">
      <div className="container">
        <div className="row">
          <div className="header_set">
            <div className="col-md-12 text-right">
              <div className="get-tuch text-left">
                <button type="submit" className="btn_fill">Member Login/Registration</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-default navbar-sticky dark bootsnav">
        <div className="container">
       
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu">
              <i className="fa fa-bars"></i>
            </button>
            <Link passHref className="navbar-brand  desktop-only" href="/">
                            <a className="navbar-brand  desktop-only"> <img src={getImageUrl(siteLogo.site_logo).toString()} className="img-fluid desktop-only" alt="logo" /></a>
                            </Link>
                            <Link passHref className="navbar-brand mobile-only" href="/">
                            <a className="navbar-brand  mobile-only"><img src={getImageUrl(siteLogo.site_logo).toString()} className="img-fluid mobile-only" alt="logo" /></a>
                            </Link>
          </div>
         
          <div className="collapse navbar-collapse nav_bor_bot" id="navbar-menu">
            <ul className="nav navbar-nav navbar-right nav_3" data-in="fadeInDown" data-out="fadeOutUp">
              <li className="mobile-only">
                <div className="get-tuch text-left">
                  <div className="bs-searchbox">
                    <input type="text" className="form-control" placeholder="Search" />
                  </div>
                </div>
              </li>
              
              {headerItem && headerItem.length > 0  && headerItem.map((val, index) => {
                                    return (
                                        <li key={index} className={val.children && val.children.length > 0 ?"dropdown ":""} >
                                            <Link passHref className={val.children && val.children.length > 0 ? 'list-items dropdown-toggle':"list-items"} data-toggle="dropdown" href={'/'+getUrlSlug(val?.url)}><a className={val.children && val.children.length > 0 ? 'list-items dropdown-toggle':"list-items"} data-toggle="dropdown" dangerouslySetInnerHTML={createMarkup(val.title?val.title:'#')}></a></Link>
                                        {/* {'/'+val?.object+'/'+val?.object_id} */}
                                        {val.children &&
                                        <ul className="dropdown-menu">
                                             {val.children.length > 0 && val.children.map((sub, i) => {
                                                return (
                                                    <li key={i}><Link passHref href={'/'+getUrlSlug(sub?.url)}><a dangerouslySetInnerHTML={createMarkup(sub.title?sub.title:'#')}></a></Link>
                                                    <div className="d-flex flex-column ">
                                                        {sub.children && 
                                                            <ul className="submenus_submenus">
                                                            {sub.children && sub.children.length && sub.children.map((subsub, i) => {
                                                            return (
                                                                <li key={i}>
                                                                <Link passHref
                                                                className="d-block text-white HeaderDropDownListItem "
                                                                href={'/'+getUrlSlug(subsub?.url)}
                                                                key={i}
                                                                >
                                                                <a className="d-block text-white HeaderDropDownListItem " dangerouslySetInnerHTML={createMarkup(subsub.title?subsub.title:'#')}></a>
                                                                </Link>
                                                                </li>
                                                        );
                                                        })}
                                                </ul>}
							  </div>
                                                    
                                                    </li>
                                                );
                                            })}
                                            </ul>
                                            }
                                        </li>
                                    );
                                    })}
             
             <li className="translatorSection">
             <div id="google_translate_element" ></div>
                                </li>
              <li className="desktop-only">
                <a className="" href="#">
                  <i className="fa fa-search"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
            <section className="registration-section mobile-only">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <button type="submit" className="btn_fill">Member Login/Registration</button>
          </div>
        </div>
      </div>
    </section>
        </>
    );

} 


const CustomSelect = ({ onChange }) => {
    const [lang, setLang] = useState(LANGS[0]);
    const [isShow, setIsShow] = useState(false);
    const ref = useRef(null);
    useClickOutside(ref, () => setIsShow(false));
    return (
      <div className="w-24 cursor-pointer relative">
        <div onClick={() => setIsShow(true)} ref={ref}>
          <span className={`fi ${lang.icon}`} /> {` ${lang.name}`}
        </div>
        <div
          className={`border border-b-0 absolute top-6 left-0 bg-white ${!isShow && "hidden"
            }`}
        >
          {LANGS.map((lang, index) => (
            <div
              key={index}
              className="border-b"
              onClick={() => {
                setLang(lang);
                onChange(lang);
              }}
            >
              <span className={`fi ${lang.icon}`} />
              {` ${lang.name}`}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const LANGS = [
    {
      name: "English",
      icon: "fi-us"
    },
    {
      name: "French",
      icon: "fi-fr"
    },
    { name: "Spanish", 
    icon: "fi-es" },
    { name: "Hindi", 
    icon: "fi-in" }
  ];
  
  const useClickOutside = (ref, callback) => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback(e);
      }
    };
    React.useEffect(() => {
      document.addEventListener("click", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
      };
    });
  };