using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Table.Models;

namespace Table.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetUsers()
        {
            var jsondata = UsersRepository.GetUsers();
            return Json(jsondata, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult AddUsers(Users user)
        {
            UsersRepository.InsertUser(user);
            return Json(user, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult EditUser(Users user)
        {
            UsersRepository.EditUser(user);
            return Json(user, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult DeleteUser(int Id)
        {
            UsersRepository.DeleteUser(Id);
            return Json("Удален");
        }
    }
}