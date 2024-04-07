using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace mercury.controller
{
    public class ctrl_default : Controller
    {
        [Route("/login")]
        public IActionResult login()
        {
            return File("login.html", "text/html");
        }

        [Route("/")]
        public IActionResult index()
        {
            return File("index.html", "text/html");
        }

        [Route("/cms")]
        public IActionResult cms_index()
        {
            return View("client_index");
        }

        [Route("/cms/login")]
        public IActionResult cms_login()
        {
            return View("cms_login");
        }


        [HttpGet]
        [Route("/attachment_get")]
        public IActionResult attachment_get(string id)
        {
            string data = "";
            // if (!string.IsNullOrEmpty(id))
            //     data = _attachments.get_def(id).data;
            // else
            //     return Content("404");
            MemoryStream s = new MemoryStream(Encoding.UTF8.GetBytes(data));
            return new FileStreamResult(s, System.Net.Mime.MediaTypeNames.Text.Plain);

        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return Content("What are you looking for? He!");
        }
        
        [Route("{*url}")]
        public IActionResult error(string code)
        {
            return Content("What are you looking for? He!");
        }
    }    
}